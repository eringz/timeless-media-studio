# Vercel Email Configuration Guide

## Email Sender Setup for Vercel Production

The application uses Gmail SMTP to send booking confirmation and status update emails. Follow these steps to set up email sending in Vercel:

### Step 1: Create Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Click "App passwords" (at the bottom of the page)
4. Select "Mail" and "Windows Computer" (or your device type)
5. Google will generate a 16-character app password
6. Copy this password - you'll need it for Vercel

### Step 2: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **timeless-media-studio**
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `EMAIL_HOST` | `smtp.gmail.com` | Gmail SMTP server |
| `EMAIL_PORT` | `587` | Standard SMTP port |
| `EMAIL_SECURE` | `false` | Use STARTTLS (not SSL) |
| `EMAIL_USER` | `your-gmail@gmail.com` | Your Gmail address |
| `EMAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | 16-char app password from Step 1 |
| `EMAIL_FROM` | `your-gmail@gmail.com` | Sender email address |

### Step 3: Redeploy Your Application

1. After adding environment variables, redeploy your application:
   - Go to **Deployments** in Vercel
   - Click the three dots on the latest deployment
   - Select "Redeploy"
   - Or simply push a new commit to trigger auto-deployment

2. Verify deployment was successful by checking the build logs

### Step 4: Test Email Sending

1. Go to your admin panel at: `https://your-domain.vercel.app/admin`
2. Create or select a test booking
3. Change the booking status to "Approved" or "Cancelled"
4. Check the recipient's email for the confirmation/status update

### Common Issues & Troubleshooting

#### ❌ "Email server configuration error"
- **Cause**: Missing or incorrect environment variables in Vercel
- **Fix**: Double-check all EMAIL_* variables are set in Vercel Settings

#### ❌ "Failed to send confirmation email"
- **Cause**: Gmail app password might be incorrect or Gmail security issue
- **Fix**: 
  1. Re-create the app password in Google Account settings
  2. Make sure 2-Step Verification is enabled
  3. Try allowing "Less secure app access" if app password doesn't work

#### ❌ "Email send error: Invalid login"
- **Cause**: Email credentials are incorrect
- **Fix**: Verify the app password is exactly correct (spaces in app password are normal)

#### ✅ Email Working Locally but Not in Vercel
- **Cause**: Environment variables are set locally but not in Vercel
- **Fix**: Ensure ALL EMAIL_* variables are added to Vercel Settings
- **Note**: `.env.local` is for local development only and is never deployed to Vercel

### Environment Variables Summary

**Local Development (.env.local):**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=hibuyer81@gmail.com
EMAIL_PASSWORD=aylevnyiytqtukhq
EMAIL_FROM=hibuyer81@gmail.com
```

**Vercel Production (Settings → Environment Variables):**
- Set the same values but with your own Gmail account credentials
- Use Gmail App Password (not your regular password)

### Security Notes

- 🔒 Never commit `.env.local` to GitHub (already in .gitignore)
- 🔒 App passwords are different from your Gmail password
- 🔒 Each app password is specific to this application
- 🔒 You can revoke app passwords anytime in Google Account settings

### Support

If you continue to experience issues:
1. Check Vercel deployment logs: **Deployments** → select deployment → **Logs**
2. Look for error messages in the logs
3. Verify environment variables are correctly set in Vercel Settings (not in code)

---

**Last Updated**: May 17, 2026
