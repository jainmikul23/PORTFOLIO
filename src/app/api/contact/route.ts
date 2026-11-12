import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  honeypot: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // Rate Limiting (5 requests per hour)
    const rateLimitResult = await rateLimit(ip, 5, 3600000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Maximum 5 transmissions per hour. Please contact via LinkedIn.",
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

    // Honeypot silently accepted
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Transmission received" });
    }

    // In local/preview environments with placeholder API key:
    const resendKey = process.env.RESEND_API_KEY || "";
    if (!resendKey || resendKey.includes("placeholder")) {
      console.info(
        `[Contact Form Mock] Received message from ${name} <${email}>: "${message.substring(0, 50)}..."`,
      );
      return NextResponse.json({
        success: true,
        message: "Transmission dispatched (development mode)",
      });
    }

    // If real Resend key is provided in production:
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL || "mikul.jain.placeholder@example.com",
        subject: `[Portfolio Inquiry] From ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });
    } catch (emailErr) {
      console.error("Resend API dispatch failed:", emailErr);
      // Fallback: log and do not break client experience
    }

    return NextResponse.json({ success: true, message: "Transmission dispatched successfully" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal transmission error. Please reach out directly on LinkedIn." },
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

