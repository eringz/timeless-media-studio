import nodemailer from "nodemailer";

type BookingStatus = "pending" | "approved" | "cancelled" | "updated";

type Receipt = {
  packageName: string;
  packagePrice: number;
  subtotal: number;
  total: number;
  paidStatus?: "cash_on_site" | "pending_online_payment" | "paid";
};

export type BookingEmailPayload = {
  name: string;
  email: string;
  emailProvider?: string;
  phone: string;
  date: string;
  packageType: string;
  message?: string;
  confirmationNumber: string;
  paymentMethod?: string;
  receipt?: Receipt;
  status?: BookingStatus;
};

function peso(value?: number) {
  return typeof value === "number" ? `₱${value.toLocaleString("en-PH")}` : "N/A";
}

export async function sendBookingEmail(booking: BookingEmailPayload) {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const secure = process.env.EMAIL_SECURE === "true" || port === 465;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error("Missing email environment variables.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const status = booking.status || "pending";

  const subject =
    status === "approved"
      ? `Booking Approved - ${booking.confirmationNumber}`
      : status === "cancelled"
        ? `Booking Cancelled - ${booking.confirmationNumber}`
        : status === "updated"
          ? `Booking Updated - ${booking.confirmationNumber}`
          : `Booking Confirmation - ${booking.confirmationNumber}`;

  const title =
    status === "approved"
      ? "Your booking has been approved!"
      : status === "cancelled"
        ? "Your booking has been cancelled."
        : status === "updated"
          ? "Your booking has been updated!"
          : "Your booking request has been received.";

  const bodyMessage =
    status === "cancelled"
      ? "We regret to inform you that your booking has been cancelled. If you have questions or want to reschedule, please contact Timeless Media Studio."
      : status === "approved"
        ? "Your booking is now approved. We are excited to work with you."
        : status === "updated"
          ? "Your booking details have been successfully updated. Here are your updated booking details:"
          : "Thank you for choosing Timeless Media Studio. Please wait for approval from our team.";

  const receiptHtml = booking.receipt
    ? `
      <div style="margin-top:24px;padding:16px;border:1px solid #e5e5e5;border-radius:12px;">
        <h3 style="margin:0 0 12px;">Receipt Summary</h3>
        <p><strong>Package:</strong> ${booking.receipt.packageName}</p>
        <p><strong>Package Price:</strong> ${peso(booking.receipt.packagePrice)}</p>
        <p><strong>Subtotal:</strong> ${peso(booking.receipt.subtotal)}</p>
        <p><strong>Total:</strong> ${peso(booking.receipt.total)}</p>
      </div>
    `
    : "";

  const statusBadgeColor =
    status === "approved"
      ? "#10b981"
      : status === "cancelled"
        ? "#ef4444"
        : status === "updated"
          ? "#3b82f6"
          : "#f59e0b";

  const statusLabel =
    status === "approved"
      ? "✓ APPROVED"
      : status === "cancelled"
        ? "✕ CANCELLED"
        : status === "updated"
          ? "↻ UPDATED"
          : "⏳ PENDING";

  const introMessage =
    status === "approved"
      ? "We are delighted to confirm your booking approval at Timeless Media Studio! We are incredibly excited to work with you and capture some amazing memories."
      : status === "cancelled"
        ? "Your booking at Timeless Media Studio has been cancelled. If you would like to reschedule or have any questions, please don't hesitate to contact us."
        : status === "updated"
          ? "Your booking details have been successfully updated. Here are your new booking details below."
          : "We are delighted to confirm your booking request at Timeless Media Studio! We are incredibly excited to work with you and capture some amazing memories. Please wait for approval from our team.";

  await transporter.sendMail({
    from: `"Timeless Media Studio" <${user}>`,
    to: booking.email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:640px;margin:auto;background:#f5f5f5;">
        <!-- Header -->
        <div style="background:#3a3a3a;color:#fff;padding:40px 20px;text-align:center;">
          <img src="https://timeless.dreamplanfix.com/images/logo-banner.png" alt="Timeless Media Studio" style="max-width:100%;height:auto;max-height:120px;margin-bottom:15px;">
          <p style="margin:15px 0 0 0;font-size:14px;opacity:0.9;">Booking Confirmation : ${booking.confirmationNumber}</p>
        </div>

        <!-- Status Badge -->
        <div style="background:#fff;padding:20px;text-align:center;border-bottom:3px solid ${statusBadgeColor};">
          <div style="display:inline-block;background:${statusBadgeColor};color:#fff;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:bold;letter-spacing:1px;">
            ${statusLabel}
          </div>
        </div>

        <!-- Main Content -->
        <div style="background:#fff;padding:30px 20px;color:#333;">
          <p style="margin:0 0 20px 0;font-size:16px;">Hello <strong>${booking.name}</strong>,</p>
          
          <p style="margin:0 0 30px 0;font-size:15px;line-height:1.7;color:#555;">
            ${introMessage}
          </p>

          <!-- Booking Details Box -->
          <div style="background:#f9f9f9;border-left:4px solid ${statusBadgeColor};padding:20px;border-radius:4px;margin:30px 0;">
            <h3 style="margin:0 0 20px 0;color:#333;font-size:16px;font-weight:bold;">Booking Details</h3>
            
            <div style="margin-bottom:15px;">
              <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Confirmation Number</p>
              <p style="margin:5px 0 0 0;font-size:18px;font-weight:bold;color:${statusBadgeColor};font-family:'Courier New',monospace;">${booking.confirmationNumber}</p>
            </div>

            <div style="margin-bottom:15px;">
              <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Name</p>
              <p style="margin:5px 0 0 0;font-size:15px;color:#333;font-weight:500;">${booking.name}</p>
            </div>

            <div style="margin-bottom:15px;">
              <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
              <p style="margin:5px 0 0 0;font-size:15px;color:#333;font-weight:500;">${booking.email}</p>
            </div>

            <div style="margin-bottom:15px;">
              <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Phone</p>
              <p style="margin:5px 0 0 0;font-size:15px;color:#333;font-weight:500;">${booking.phone}</p>
            </div>

            <div style="margin-bottom:15px;">
              <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Date</p>
              <p style="margin:5px 0 0 0;font-size:15px;color:#333;font-weight:500;">${new Date(booking.date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            <div style="margin-bottom:15px;">
              <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Package</p>
              <p style="margin:5px 0 0 0;font-size:15px;color:#333;font-weight:500;">${booking.packageType}</p>
            </div>

            ${booking.message ? `
            <div>
              <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
              <p style="margin:5px 0 0 0;font-size:15px;color:#555;font-style:italic;">${booking.message}</p>
            </div>
            ` : ""}
          </div>

          ${receiptHtml}

          <p style="margin:30px 0 0 0;font-size:14px;color:#888;font-style:italic;">Please save your confirmation number for tracking and support.</p>
          
          <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e5e5e5;text-align:center;">
            <p style="margin:0;font-size:14px;color:#666;">
              <strong>Timeless Media Studio</strong><br>
              <span style="font-size:12px;color:#999;">Capturing your precious moments</span>
            </p>
          </div>
        </div>
      </div>
    `,
  });

  return {
    success: true,
    message:
      status === "cancelled"
        ? "Cancellation email sent."
        : status === "approved"
          ? "Approval email sent."
          : "Confirmation email sent.",
  };
}
