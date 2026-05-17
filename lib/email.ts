import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'localhost',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
});

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@timelessmediastudio.com',
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text || params.html.replace(/<[^>]*>/g, ''),
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export function getApprovalEmail(clientName: string, confirmationNumber: string): EmailParams {
  return {
    subject: 'Your Booking Has Been Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1f2937; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Booking Approved ✓</h1>
        </div>
        <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #374151;">Hello ${clientName},</p>
          <p style="font-size: 16px; color: #374151;">
            Great news! Your booking has been approved. We're excited to work with you!
          </p>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase;">Confirmation Number</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #1f2937;">${confirmationNumber}</p>
          </div>
          <p style="font-size: 16px; color: #374151;">
            Keep this confirmation number handy for your records. If you have any questions, feel free to contact us.
          </p>
          <p style="font-size: 16px; color: #374151; margin-top: 30px;">
            Best regards,<br/>
            <strong>Timeless Media Studio</strong>
          </p>
        </div>
      </div>
    `,
    to: '',
  };
}

export function getCancellationEmail(clientName: string, confirmationNumber: string): EmailParams {
  return {
    subject: 'Your Booking Has Been Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1f2937; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Booking Cancelled</h1>
        </div>
        <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #374151;">Hello ${clientName},</p>
          <p style="font-size: 16px; color: #374151;">
            Your booking has been cancelled. If this was unexpected or if you have any questions, please contact us.
          </p>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase;">Confirmation Number</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #1f2937;">${confirmationNumber}</p>
          </div>
          <p style="font-size: 16px; color: #374151;">
            If you'd like to rebook or have any concerns, please don't hesitate to reach out to us.
          </p>
          <p style="font-size: 16px; color: #374151; margin-top: 30px;">
            Best regards,<br/>
            <strong>Timeless Media Studio</strong>
          </p>
        </div>
      </div>
    `,
    to: '',
  };
}
