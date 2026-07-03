const buildEmailMessage = (user, resetCode) => {
  const message = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color: #1a73e8; padding: 28px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px;">Password Reset</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; color: #333333; font-size: 16px;">Hello ${user.name},</p>
              <p style="margin: 0 0 24px; color: #555555; font-size: 15px; line-height: 1.6;">
                We received a request to reset the password on your account.
                Use the verification code below to continue.
              </p>

              <!-- Reset Code Box -->
              <div style="text-align: center; margin: 0 0 24px;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a73e8; background-color: #eef3fd; padding: 16px 28px; border-radius: 8px;">
                  ${resetCode}
                </span>
              </div>

              <p style="margin: 0 0 8px; color: #555555; font-size: 15px;">
                This code is valid for <strong>10 minutes</strong>.
              </p>
              <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                If you didn't request this, you can safely ignore this email — your account will remain secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; color: #999999; font-size: 13px;">
                Best regards,<br/>The E-commerce Team
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return message;
};

module.exports = buildEmailMessage;
