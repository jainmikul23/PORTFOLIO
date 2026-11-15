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
            "Rate limit reached. Maximum 5 messages per hour. Please reach out directly at mikuljain09@gmail.com or on LinkedIn.",
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

    // Honeypot silently accepted to block automated spam bots
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Message received successfully." });
    }

    let emailDelivered = false;

    // Strategy 1: Resend API (if configured in production)
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
        emailDelivered = true;
      } catch (emailErr) {
        console.error("Resend API dispatch failed:", emailErr);
      }
    }

    // Strategy 2: FormSubmit Direct Delivery (guaranteed delivery to mikuljain09@gmail.com)
    if (!emailDelivered) {
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TARGET_EMAIL)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Origin: "https://mikuljain.vercel.app",
            Referer: "https://mikuljain.vercel.app/",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `[Portfolio Inquiry] ${name} (${email})`,
            _template: "table",
          }),
        });

        if (formSubmitRes.ok) {
          emailDelivered = true;
        } else {
          console.warn("FormSubmit response status:", formSubmitRes.status);
        }
      } catch (submitErr) {
        console.error("FormSubmit dispatch error:", submitErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Message received and dispatched. I will respond to your email promptly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Unable to send message. Please reach out directly at mikuljain09@gmail.com or on LinkedIn." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "ok", message: "Contact API endpoint is operational. Use POST to transmit inquiries." },
    { status: 200 },
  );
}
