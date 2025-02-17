export const verifyEmailTemplate = (
  url: string,
  brandColor: string = '#2563EB',
) => ({
  subject: 'Confirm your account',
  text: `Hello, it's great to see you here :)`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-weight:bold; font-size: 24px; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .header img { max-width: 40px; margin-bottom: 10px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 24px; color: #333333; }
      .content p { font-size: 16px; color: #666666; margin: 10px 0 20px; }
      .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">Zentify</div>
        <div class="content">
          <h1>If you can see this message, it's means you email has just bee verified</h1>
          <p>Thank you for for joining us!!!</p>
         <img width="200" height="200" src="${url}" alt="confirmation email" />
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
        </div>
      </div>
    </body>
    <script>
    </script>
    </html>
  `,
});
