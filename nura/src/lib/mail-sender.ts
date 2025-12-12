import nodemailer from "nodemailer";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface EmailSendingProps {
  email: string;
  title: string;
  body: string;
  url?: string;
}

export const sendEmail = async ({
  email,
  body,
  title,
  url,
}: EmailSendingProps) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const confirmationLink = url;

    const skeleton = `
      <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #282a54; padding: 15px; color: #ffffff; text-align: center;">
            <h2>Verify Your Email</h2>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p>${body}</p>
            <a href="${confirmationLink}" style="display: inline-block; background-color: #282a54; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Verify Email</a>
            <p style="margin-top: 15px; color: #666; font-size: 0.9em;">This link will expire in 5 minutes.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"NURA - AI Driven Mental Health Dignosis" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: skeleton,
    });
    return {
      success: "Confirmation mail has been sent to email!",
    };
  } catch (error) {
    console.log("Mail Sending error: ", error);

    return {
      error: "Some error occurred while sending email.",
    };
  }
};
