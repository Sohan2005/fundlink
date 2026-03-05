// src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, getApplicationSubmittedEmail, getNewMatchEmail, getProfileIncompleteEmail, getMessageReceivedEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, to, userName, companyName, matchPercentage, completionPercentage, messagePreview } = body

    // Validate required fields
    if (!type || !to || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: type, to, userName' },
        { status: 400 }
      )
    }

    let emailTemplate

    // Generate email based on type
    switch (type) {
      case 'application_submitted':
        if (!companyName) {
          return NextResponse.json(
            { error: 'Missing companyName for application_submitted email' },
            { status: 400 }
          )
        }
        emailTemplate = getApplicationSubmittedEmail(userName, companyName)
        break

      case 'new_match':
        if (!companyName || matchPercentage === undefined) {
          return NextResponse.json(
            { error: 'Missing companyName or matchPercentage for new_match email' },
            { status: 400 }
          )
        }
        emailTemplate = getNewMatchEmail(userName, companyName, matchPercentage)
        break

      case 'profile_incomplete':
        if (completionPercentage === undefined) {
          return NextResponse.json(
            { error: 'Missing completionPercentage for profile_incomplete email' },
            { status: 400 }
          )
        }
        emailTemplate = getProfileIncompleteEmail(userName, completionPercentage)
        break

      case 'message_received':
        if (!companyName || !messagePreview) {
          return NextResponse.json(
            { error: 'Missing companyName or messagePreview for message_received email' },
            { status: 400 }
          )
        }
        emailTemplate = getMessageReceivedEmail(userName, companyName, messagePreview)
        break

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        )
    }

    // Send the email
    const result = await sendEmail({
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error in send-email API route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
