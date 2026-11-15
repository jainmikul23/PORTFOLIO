import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  honeypot: z.string().optional(),
});

const TARGET_EMAIL = process.env.CONTACT_EMAIL || "mikuljain09@gmail.com";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // Rate Limiting (5 requests per hour per IP)
    const rateLimitResult = await rateLimit(ip, 5, 3600000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error:
            "Rate limit reached. Maximum 5 messages per hour. Please email directly at mikuljain09@gmail.com or connect on LinkedIn.",
        },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, message, honeypot } = parseResult.data;

    // Honeypot silently accepted to neutralize automated spam bots
    if (honeypot) {
      return NextResponse.json({ success: true, method: "honeypot", message: "Message received." });
    }

    // Direct Resend API Delivery (when valid RESEND_API_KEY is configured in Vercel)
    const resendKey = process.env.RESEND_API_KEY || "";
    if (resendKey && !resendKey.includes("placeholder")) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "Mikul Jain Portfolio <onboarding@resend.dev>",
          to: TARGET_EMAIL,
          replyTo: email,
          subject: `[Portfolio Inquiry] From ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        return NextResponse.json({
          success: true,
          method: "resend",
          message: "Message delivered directly to Mikul's inbox. You will receive a response within 24 hours.",
        });
      } catch (emailErr) {
        console.error("Resend API dispatch failed:", emailErr);
      }
    }

    // Fallback mode: Payload successfully validated and logged
    console.info(`[Contact Message] From ${name} <${email}>: ${message.substring(0, 100)}...`);
    return NextResponse.json({
      success: true,
      method: "client_compose",
      message: "Message validated. Opening email client...",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Unable to process message. Please reach out directly at mikuljain09@gmail.com." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "ok", message: "Contact API endpoint operational." },
    { status: 200 },
  );
}
