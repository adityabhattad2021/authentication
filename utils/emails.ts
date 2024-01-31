import nodemailer from "nodemailer";


export type EmailContent = {
  subject: string;
  body: string;
};


export enum EmailType {
  VERIFICATION_EMAIL = "VERIFICATION_EMAIL",
  PASSWORD_RESET_EMAIL = "PASSWORD_RESET_EMAIL",
  TWO_FACTOR_AUTHENTICATION_EMAIL = "TWO_FACTOR_AUTHENTICATION_EMAIL",
}


export async function generateEmail(emailType: EmailType, token: string) {
  let subject = "";
  let body = "";
  switch (emailType) {
    case EmailType.VERIFICATION_EMAIL:
      subject = "Verify your Email";
      body = `
            <html>
            <body>
              <table style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; width: 100%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <h2 style="text-align: center;">Verify Your Email</h2>
                    <p style="text-align: center;">Please click the button below to verify your email address.</p>
                    <a href="http://localhost:3000/auth/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; border-radius: 5px; background-color: #000; color: #fff; text-decoration: none;">Verify Email</a>
                  </td>
                </tr>
              </table>
            </body>
            `;
      break;
    case EmailType.PASSWORD_RESET_EMAIL:
      subject = "Reset Your Password";
      body = `
            <html>
            <body>
              <table style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; width: 100%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <h2 style="text-align: center;">Password Reset Request</h2>
                    <p style="text-align: center;">You have requested to reset your password. Click the button below to proceed.</p>
                    <a href="http://localhost:3000/auth/new-password?token=${token}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; border-radius: 5px; background-color: #000; color: #fff; text-decoration: none;">Reset Password</a>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `;
      break;
    case EmailType.TWO_FACTOR_AUTHENTICATION_EMAIL:
      subject = "Your Two-Factor Authentication Code";
      body = `
          <html>
          <body>
            <table style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; width: 100%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="text-align: center;">Your Authentication Code</h2>
                  <p style="text-align: center;">Here is your two-factor authentication code. Please enter this code to proceed with your login:</p>
                  <p style="text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">${token}</p>
                  <p style="text-align: center;">If you didn't request this code, please ignore this email and secure your account.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
          `;
        break;
    default:
      console.log("[GENERATE_EMAIL]: INVALID EMAIL TYPE");
  }
  return { subject, body };
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'stmp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD
  },
});


export async function sendMail(emailContent: EmailContent, sendTo: string[]) {
  if (process.env.SENDER_EMAIL) {
    const mailOptions = {
      from: {
        name: 'Not so simple NextAuthV0.5',
        address: process.env.SENDER_EMAIL as string,
      },
      to: sendTo,
      html: emailContent.body,
      subject: emailContent.subject
    };

    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        return console.log('[SEND_EMAIL]: Error encountered during sending the email: ', err);
      }
      console.log('[SEND_EMAIL]: Success ', info);
    })
  } else {
    console.log('[SEND_EMAIL]: Env key not set correctly.');
  }
}