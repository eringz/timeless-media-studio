import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const booking = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Booking Confirmation" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "Your Booking Confirmation",
    html: `
      <h2>Booking Confirmation</h2>
      <p>Hi ${booking.name},</p>
      <p>Thank you for your booking. Here are your details:</p>

      <ul>
        <li><strong>Name:</strong> ${booking.name}</li>
        <li><strong>Phone:</strong> ${booking.phone}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Package:</strong> ${booking.packageType}</li>
        <li><strong>Message:</strong> ${booking.message}</li>
      </ul>

      <p>Status: Approved! </p>
      <p>We will contact you soon.</p>
    `,
  });

  return NextResponse.json({ success: true });
}