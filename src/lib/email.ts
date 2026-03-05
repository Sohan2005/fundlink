// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: 'FundLink <onboarding@resend.dev>', // Use your verified domain later
      to,
      subject,
      html,
    })

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

/**
 * Email Templates
 */

export function getApplicationSubmittedEmail(userName: string, companyName: string) {
  return {
    subject: `Application Submitted to ${companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Submitted! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your application to <strong>${companyName}</strong> has been successfully submitted.</p>
              <p>You'll receive an email notification when they review your application. In the meantime, you can:</p>
              <ul>
                <li>Track your application status in your dashboard</li>
                <li>Explore more funding opportunities</li>
                <li>Complete your profile to increase your chances</li>
              </ul>
              <a href="http://localhost:3000/dashboard/applications" class="button">View Application Status</a>
              <p>Good luck!</p>
              <p><strong>The FundLink Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 FundLink. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export function getNewMatchEmail(userName: string, companyName: string, matchPercentage: number) {
  return {
    subject: `New ${matchPercentage}% Match: ${companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .match-badge { display: inline-block; background: #4CAF50; color: #fff; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You Have a New Match! 🎯</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Great news! We found a company that's a perfect fit for your profile:</p>
              <h2>${companyName}</h2>
              <div class="match-badge">${matchPercentage}% Match</div>
              <p>This company aligns with your funding goals, industry preferences, and experience level.</p>
              <a href="http://localhost:3000/dashboard/matches" class="button">View All Matches</a>
              <p>Don't miss this opportunity!</p>
              <p><strong>The FundLink Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 FundLink. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export function getProfileIncompleteEmail(userName: string, completionPercentage: number) {
  return {
    subject: 'Complete Your Profile to Get Better Matches',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2196F3; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .progress { background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden; margin: 20px 0; }
            .progress-bar { background: #2196F3; height: 100%; }
            .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Complete Your Profile 📝</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your profile is <strong>${completionPercentage}% complete</strong>. A complete profile helps us match you with the best funding opportunities!</p>
              <div class="progress">
                <div class="progress-bar" style="width: ${completionPercentage}%"></div>
              </div>
              <p>Complete your profile to:</p>
              <ul>
                <li>Get personalized company matches</li>
                <li>Increase your chances of approval</li>
                <li>Stand out to funding partners</li>
              </ul>
              <a href="http://localhost:3000/dashboard/profile/edit" class="button">Complete Profile Now</a>
              <p><strong>The FundLink Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 FundLink. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export function getMessageReceivedEmail(userName: string, companyName: string, messagePreview: string) {
  return {
    subject: `New Message from ${companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #9C27B0; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .message-preview { background: #f5f5f5; padding: 15px; border-left: 4px solid #9C27B0; margin: 20px 0; font-style: italic; }
            .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message 💬</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>You have a new message from <strong>${companyName}</strong>:</p>
              <div class="message-preview">${messagePreview}</div>
              <a href="http://localhost:3000/dashboard/messages" class="button">View Message</a>
              <p><strong>The FundLink Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 FundLink. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}
