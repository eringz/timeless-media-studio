import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface SubmissionRequest {
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
  email: string;
}

function createTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const secure = process.env.EMAIL_SECURE === "true";
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error("Email configuration is missing. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function POST(request: Request) {
  try {
    const body: SubmissionRequest = await request.json();
    const { name, phone, date, packageType, message, email } = body;

    if (!name || !phone || !date || !packageType || !message || !email) {
      return NextResponse.json({ message: "Incomplete submission data." }, { status: 400 });
    }

    const transporter = createTransporter();
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    const mailText = `Booking request received:\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nPackage: ${packageType}\nMessage: ${message}\n\nA confirmation email is being sent to ${email}.`;
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h1>Booking confirmation</h1>
        <p>Hi ${name},</p>
        <p>Thank you for booking with Timeless Media Studio. We received your request and will be in touch soon.</p>
        <h2>Booking details</h2>
        <ul>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Package:</strong> ${packageType}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
        <p>If you have more questions, reply to this email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Timeless Media Studio booking confirmation",
      text: mailText,
      html: mailHtml,
    });

    return NextResponse.json({ message: "Confirmation email sent." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
