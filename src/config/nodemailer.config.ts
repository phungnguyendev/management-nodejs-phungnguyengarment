import 'dotenv/config'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { User } from '~/api/models/user.model'
import appConfig from './app.config'

const name = appConfig.company_name
const address = appConfig.admin.mail
const appPassword = appConfig.admin.app_password

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  // host: 'smtp.gmail.com',
  // port: 465,
  // secure: true,
  auth: {
    // type: 'oauth2',
    user: address, // Sender email address
    pass: appPassword // App password from gmail account
  }
})

export const mailOptionVerifyOTPCode = (sendToEmails: string[] | string, otpCode: string): Mail.Options => {
  return {
    from: {
      name: name,
      address: address
    },
    to: sendToEmails,
    subject: 'OTP for Authentication',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification Email</title>
    </head>
    <body>
        <div style="background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px;">
                <h2 style="text-align: center; color: #007bff;">OTP Verification</h2>
                <p>Dear ${sendToEmails},</p>
                <p>Your OTP (One-Time Password) for verification is: <h2><strong>${otpCode}</strong></h2></p>
                <p>Please use this OTP to verify your email address.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p>Thank you!</p>
                <div class="footer">
                <p>Best regards,</p>
                <p>Phung Nguyen Dev Team</p>
            </div>
            </div>
        </div>
    </body>
    </html>
    `
  }
}

export const mailOptionToSendUserInfo = (sendToEmails: string[] | string, userInfo: User): Mail.Options => {
  return {
    from: {
      name: name,
      address: address
    },
    to: sendToEmails,
    subject: 'User Information',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333333;
            }
            p {
                color: #666666;
                line-height: 1.5;
            }
            ul {
                padding-left: 20px;
            }
            li {
                color: #666666;
                list-style-type: none;
                margin-bottom: 5px;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>User login information</h2>
            <p>Hello,</p>
            <p>Below is your application login information:</p>
            <ul>
                <li><strong>Email:</strong> ${userInfo.email}</li>
                <li><strong>Password:</strong> ${userInfo.password}</li>
            </ul>
            <p>Link: ${appConfig.server.server_url}</p>
            <p>Thank you!</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Phung Nguyen Dev Team</p>
            </div>
        </div>
    </body>
    </html>`
  }
}
