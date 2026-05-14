import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
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
      subject: `Booking Confirmation - ${booking.confirmationNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#111;color:#fff;padding:24px;border-radius:12px;">
          <h2>Booking Confirmation</h2>

          <p>Hi ${booking.name},</p>

          <p>Thank you for your booking. We received your request successfully.</p>

          <div style="background:#000;color:#fff;padding:18px;border-radius:10px;text-align:center;margin:20px 0;">
            <p style="margin:0;font-size:14px;color:#ccc;">Your Confirmation Number</p>
            <h1 style="margin:8px 0;font-size:28px;letter-spacing:2px;">
              ${booking.confirmationNumber}
            </h1>
          </div>

          <div style="background:#222;padding:16px;border-radius:10px;margin-top:16px;">
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Package:</strong> ${booking.packageType}</p>
            <p><strong>Message:</strong> ${booking.message}</p>
            <p><strong>Status:</strong> Pending Approval</p>
          </div>

          <p style="margin-top:20px;">
            You can use your confirmation number to track your booking status.
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      confirmationNumber: booking.confirmationNumber,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send confirmation email.",
      },
      { status: 500 }
    );
  }
}