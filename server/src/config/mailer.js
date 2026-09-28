const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter.
 * - If EMAIL_USER + EMAIL_PASS are set  → real Gmail SMTP
 * - Otherwise                           → Ethereal (test) transport that logs the preview URL
 */
async function createTransporter() {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback: Ethereal test account (preview URL printed to console)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.warn('[Mailer] No EMAIL_USER/EMAIL_PASS set — using Ethereal test transport.');
  return transporter;
}

/**
 * Sends a password-reset email.
 * @param {string} toEmail  - Recipient email address
 * @param {string} resetUrl - Full reset URL with token
 */
async function sendPasswordResetEmail(toEmail, resetUrl) {
  const transporter = await createTransporter();

  const from =
    process.env.EMAIL_FROM ||
    (process.env.EMAIL_USER
      ? `SafeRoad AI <${process.env.EMAIL_USER}>`
      : 'SafeRoad AI <noreply@saferoad.ai>');

  const info = await transporter.sendMail({
    from,
    to: toEmail,
    subject: '🔒 Reset Your SafeRoad AI Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:linear-gradient(135deg,#2563eb,#f59e0b);border-radius:12px;padding:12px 20px;">
            <span style="color:white;font-size:20px;font-weight:800;">🛡️ SafeRoad AI</span>
          </div>
        </div>
        <h2 style="color:#1e293b;font-size:20px;margin-bottom:8px;">Password Reset Request</h2>
        <p style="color:#475569;font-size:14px;line-height:1.6;">
          We received a request to reset the password for your SafeRoad AI account associated with <strong>${toEmail}</strong>.
        </p>
        <p style="color:#475569;font-size:14px;line-height:1.6;">
          Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
        </p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${resetUrl}"
             style="display:inline-block;background:linear-gradient(135deg,#2563eb,#f59e0b);color:white;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
            Reset My Password
          </a>
        </div>
        <p style="color:#94a3b8;font-size:12px;line-height:1.6;">
          If you didn't request this, you can safely ignore this email. Your password will not be changed.
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p style="color:#cbd5e1;font-size:11px;text-align:center;">
          SafeRoad AI Intelligence Platform &bull; This is an automated message, please do not reply.
        </p>
      </div>
    `,
    text: `Reset your SafeRoad AI password by visiting: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.`,
  });

  // If using Ethereal, print the preview URL so devs can inspect it
  if (!process.env.EMAIL_USER) {
    console.log('[Mailer] Ethereal preview URL:', nodemailer.getTestMessageUrl(info));
  } else {
    console.log(`[Mailer] Password reset email sent to ${toEmail} (messageId: ${info.messageId})`);
  }
}

module.exports = { sendPasswordResetEmail };
