import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Receipt = {
  packageName: string;
  packagePrice: number;
  subtotal: number;
  total: number;
  paidStatus: "cash_on_site" | "pending_online_payment";
};

type BookingRequest = {
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
  status?: "pending" | "approved" | "cancelled"; // Add status field
};

export async function POST(
  req: Request
) {
  try {
    const booking: BookingRequest =
      await req.json();

    if (
      !booking.email ||
      !booking.name ||
      !booking.confirmationNumber
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required booking fields.",
        },
        { status: 400 }
      );
    }

    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD
    ) {
      console.error("❌ Missing email environment variables:", {
        EMAIL_HOST: !!process.env.EMAIL_HOST,
        EMAIL_PORT: !!process.env.EMAIL_PORT,
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Email server configuration error.",
        },
        { status: 500 }
      );
    }

    const portNum = Number(process.env.EMAIL_PORT);
    const isSecure = process.env.EMAIL_SECURE === "true" || portNum === 465;
    
    console.log("📧 Email Configuration:", {
      host: process.env.EMAIL_HOST,
      port: portNum,
      secure: isSecure,
      user: process.env.EMAIL_USER?.substring(0, 5) + "***",
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL_URL,
    });

    // For Vercel: prefer port 465 (SSL) over 587 (STARTTLS) as Vercel blocks STARTTLS
    let finalPort = portNum;
    let finalSecure = isSecure;
    
    if (process.env.VERCEL_URL && portNum === 587) {
      console.log("⚠️  Vercel detected with port 587. Attempting with SSL defaults (465).");
      finalPort = 465;
      finalSecure = true;
    }

    const transportConfig = {
      host: process.env.EMAIL_HOST,
      port: finalPort,
      secure: finalSecure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    };

    const transporter =
      nodemailer.createTransport(transportConfig);

    // Verify SMTP connection
    try {
      console.log("🔍 Verifying SMTP connection...");
      await transporter.verify();
      console.log("✓ SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError instanceof Error ? verifyError.message : verifyError);
      throw new Error(`SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : "Unknown error"}`);
    }

    // Determine email subject and status message based on booking status
    let emailSubject = `Booking Confirmation - ${booking.confirmationNumber}`;
    let statusMessage = "PENDING APPROVAL";
    let statusColor = "#00ff99";

    if (booking.status === "approved") {
      emailSubject = `✓ Your Booking Has Been Approved - ${booking.confirmationNumber}`;
      statusMessage = "APPROVED";
      statusColor = "#00ff99";
    } else if (booking.status === "cancelled") {
      emailSubject = `✗ Your Booking Has Been Cancelled - ${booking.confirmationNumber}`;
      statusMessage = "CANCELLED";
      statusColor = "#ff4444";
    }

    const receiptHtml = booking.receipt
      ? `
      <div
        style="
          background:#1a1a1a;
          padding:20px;
          border-radius:14px;
          margin-top:20px;
        "
      >
        <h2
          style="
            margin-top:0;
            color:#ffffff;
          "
        >
          Receipt Summary
        </h2>

        <table
          style="
            width:100%;
            border-collapse:collapse;
            color:#ddd;
          "
        >
          <tr>
            <td style="padding:8px 0;">
              Package
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
              "
            >
              ${
                booking.receipt
                  .packageName
              }
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;">
              Package Price
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
              "
            >
              ₱${
                booking.receipt
                  .packagePrice
              }
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;">
              Subtotal
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
              "
            >
              ₱${
                booking.receipt
                  .subtotal
              }
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;">
              Payment Method
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
              "
            >
              ${
                booking.paymentMethod ||
                "N/A"
              }
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;">
              Payment Status
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
                color:#00ff99;
                font-weight:bold;
              "
            >
              ${
                booking.receipt
                  .paidStatus ===
                "cash_on_site"
                  ? "PAY ON EVENT DATE"
                  : "PENDING ONLINE PAYMENT"
              }
            </td>
          </tr>

          <tr>
            <td
              colspan="2"
              style="
                border-top:1px solid #444;
                padding-top:14px;
              "
            ></td>
          </tr>

          <tr>
            <td
              style="
                padding-top:12px;
                font-size:18px;
                font-weight:bold;
                color:#fff;
              "
            >
              TOTAL
            </td>

            <td
              style="
                padding-top:12px;
                text-align:right;
                font-size:20px;
                font-weight:bold;
                color:#fff;
              "
            >
              ₱${
                booking.receipt.total
              }
            </td>
          </tr>
        </table>
      </div>
    `
      : "";

    // Send email with proper error handling
    let mailResult;
    try {
      console.log(`📨 Attempting to send email to: ${booking.email}`);
      console.log(`   Status: ${booking.status || "pending"}`);
      console.log(`   Confirmation #: ${booking.confirmationNumber}`);
      
      mailResult = await transporter.sendMail({
        from: `"Timeless Media Studio" <${process.env.EMAIL_USER}>`,

        to: booking.email,

        subject: emailSubject,

        html: `
        <div
          style="
            max-width:700px;
            margin:auto;
            background:#111111;
            color:#ffffff;
            font-family:Arial,sans-serif;
            border-radius:18px;
            overflow:hidden;
            border:1px solid #2b2b2b;
          "
        >

          <div
            style="
              background:linear-gradient(
                135deg,
                #000000,
                #2a2a2a
              );
              padding:40px 24px;
              text-align:center;
            "
          >
            <h1
              style="
                margin:0;
                font-size:32px;
                letter-spacing:1px;
              "
            >
              ${
                booking.status === "approved"
                  ? "✓ BOOKING APPROVED"
                  : booking.status === "cancelled"
                  ? "✗ BOOKING CANCELLED"
                  : "BOOKING CONFIRMATION"
              }
            </h1>

            <p
              style="
                margin-top:10px;
                color:#bdbdbd;
                font-size:15px;
              "
            >
              ${
                booking.status === "approved"
                  ? "Your booking has been approved!"
                  : booking.status === "cancelled"
                  ? "Your booking has been cancelled."
                  : "Your booking request has been successfully received."
              }
            </p>
          </div>

          <div style="padding:28px;">

            <p style="font-size:16px;">
              Hello
              <strong>
                ${booking.name}
              </strong>,
            </p>

            <p
              style="
                color:#d5d5d5;
                line-height:1.7;
              "
            >
              ${
                booking.status === "approved"
                  ? "Great news! Your booking has been approved by our team. We're excited to work with you!"
                  : booking.status === "cancelled"
                  ? "We regret to inform you that your booking has been cancelled. We understand this may be disappointing, and we sincerely apologize for any inconvenience this may cause. If you would like to discuss this decision, reschedule for another date, or have any concerns, please don't hesitate to reach out to us directly. We value your interest and would love to work with you in the future."
                  : "Thank you for choosing our service. Your booking is currently under review and waiting for approval."
              }
            </p>

            <div
              style="
                background:#000;
                border:1px solid #333;
                border-radius:16px;
                padding:24px;
                text-align:center;
                margin:28px 0;
              "
            >
              <p
                style="
                  margin:0;
                  font-size:13px;
                  color:#aaaaaa;
                  letter-spacing:1px;
                "
              >
                CONFIRMATION NUMBER
              </p>

              <h1
                style="
                  margin:10px 0 0;
                  font-size:34px;
                  letter-spacing:4px;
                  color:#ffffff;
                "
              >
                ${
                  booking.confirmationNumber
                }
              </h1>
            </div>

            <div
              style="
                background:#1b1b1b;
                border-radius:14px;
                padding:20px;
                border:1px solid #2f2f2f;
              "
            >
              <h2
                style="
                  margin-top:0;
                  color:#fff;
                "
              >
                Booking Details
              </h2>

              <table
                style="
                  width:100%;
                  border-collapse:collapse;
                  color:#dddddd;
                "
              >

                <tr>
                  <td
                    style="
                      padding:8px 0;
                      width:40%;
                    "
                  >
                    Full Name
                  </td>

                  <td style="padding:8px 0;">
                    ${booking.name}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    Email Address
                  </td>

                  <td style="padding:8px 0;">
                    ${booking.email}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    Phone Number
                  </td>

                  <td style="padding:8px 0;">
                    ${booking.phone}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    Event Date
                  </td>

                  <td style="padding:8px 0;">
                    ${booking.date}
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    Selected Package
                  </td>

                  <td style="padding:8px 0;">
                    ${
                      booking.packageType
                    }
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0;">
                    Booking Status
                  </td>

                  <td
                    style="
                      padding:8px 0;
                      color:${statusColor};
                      font-weight:bold;
                    "
                  >
                    ${statusMessage}
                  </td>
                </tr>

              </table>
            </div>

            ${receiptHtml}

            ${
              booking.message
                ? `
                <div
                  style="
                    margin-top:22px;
                    background:#1b1b1b;
                    padding:20px;
                    border-radius:14px;
                    border:1px solid #2f2f2f;
                  "
                >
                  <h3 style="margin-top:0;">
                    Client Request
                  </h3>

                  <p
                    style="
                      color:#d0d0d0;
                      line-height:1.7;
                      margin-bottom:0;
                    "
                  >
                    ${booking.message}
                  </p>
                </div>
              `
                : ""
            }

            <div
              style="
                margin-top:28px;
                background:#0d0d0d;
                border-left:4px solid #ffffff;
                padding:18px;
                border-radius:10px;
              "
            >
              <p
                style="
                  margin:0;
                  color:#d8d8d8;
                  line-height:1.6;
                "
              >
                Please save your
                confirmation number for
                booking tracking and
                future support inquiries.
              </p>
            </div>

          </div>

          <div
            style="
              background:#080808;
              padding:20px;
              text-align:center;
              border-top:1px solid #222;
            "
          >
            <p
              style="
                margin:0;
                color:#8f8f8f;
                font-size:13px;
              "
            >
              This is an automated
              booking confirmation email.
            </p>
          </div>

        </div>
      `,
      });
      console.log(`✅ Email sent successfully to ${booking.email}`);
      console.log(`   Message ID: ${mailResult.messageId}`);
      console.log(`   Response: ${mailResult.response}`);
    } catch (sendError) {
      console.error(`❌ Email send error for ${booking.email}:`);
      console.error(`   Error Type: ${sendError instanceof Error ? sendError.name : typeof sendError}`);
      console.error(`   Error Message: ${sendError instanceof Error ? sendError.message : String(sendError)}`);
      console.error(`   Full Error:`, sendError);
      
      // Log additional debugging info
      interface ErrorWithCode extends Error {
        code?: string;
      }
      
      if (sendError instanceof Error) {
        const err = sendError as ErrorWithCode;
        if (err.code) {
          console.error(`   Error Code: ${err.code}`);
        }
      }
      
      throw sendError;
    }

    return NextResponse.json({
      success: true,
      confirmationNumber:
        booking.confirmationNumber,
      message: `${booking.status === "approved" ? "Approval" : booking.status === "cancelled" ? "Cancellation" : "Confirmation"} email sent successfully to ${booking.email}`,
      messageId: mailResult?.messageId,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    interface ErrorWithCode extends Error {
      code?: string;
    }
    
    let errorCode: string | null = null;
    if (error instanceof Error) {
      const err = error as ErrorWithCode;
      errorCode = err.code || null;
    }
    
    console.error(`\n❌ FINAL ERROR - Email send failed`);
    console.error(`   Message: ${errorMessage}`);
    console.error(`   Code: ${errorCode}`);
    console.error(`   Type: ${error instanceof Error ? error.name : typeof error}`);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send confirmation email.",
        error: errorMessage,
        errorCode: errorCode,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
