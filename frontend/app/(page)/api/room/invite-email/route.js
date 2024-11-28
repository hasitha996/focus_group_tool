import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { userEmail, roomLink } = await req.json();

  if (!userEmail || !roomLink) {
    return NextResponse.json(
      { success: false, message: 'Missing required data' },
      { status: 400 }
    );
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: emailUser,
    to: userEmail,
    subject: 'You Have Been Invited to a Room',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              color: #333333;
              margin: 0;
            }
            .content {
              font-size: 16px;
              color: #555555;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              text-align: center;
              width: 100%;
              max-width: 200px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #888888;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Room Invitation</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You have been invited to join a room. Click the link below to join:</p>
              <a href="${roomLink}" class="button">Join Room</a>
            </div>
            <div class="footer">
              <p>If you have any questions, feel free to reach out.</p>
              <p>Best regards,<br>Focus Group tool</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
