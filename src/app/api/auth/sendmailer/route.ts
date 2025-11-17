import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

import {
  CSRF_COOKIE_NAME,
  verifyCsrfToken,
} from "@/lib/security/csrf";

export async function POST(request: NextRequest) {
  const { csrfToken, name, email, message } = await request.json();

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (!csrfToken || !cookieToken || csrfToken !== cookieToken || !verifyCsrfToken(csrfToken)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  // Email configuration
  const EMAIL_HOST = process.env.EMAIL_HOST;
  const EMAIL_PORT = process.env.EMAIL_PORT;
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  const SENDTO_EMAIL = process.env.SENDTO_EMAIL;
  const EMAIL_SECURE = process.env.EMAIL_SECURE;

  if (
    !EMAIL_HOST ||
    !EMAIL_PORT ||
    !EMAIL_USER ||
    !EMAIL_PASSWORD ||
    !SENDTO_EMAIL ||
    !EMAIL_SECURE
  ) {
    return NextResponse.json(
      { error: "Email server not configured" },
      { status: 500 }
    );
  }

  // Validate form data
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT, 10),
    secure: EMAIL_SECURE === "true",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: SENDTO_EMAIL,
    subject: `New message from ${name}`,
    text: `Email: ${email}\nMessage: ${message}`,
  };

  try {
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}