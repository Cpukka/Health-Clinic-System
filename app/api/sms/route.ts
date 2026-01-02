import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client (make sure to install: npm install twilio)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, from = process.env.TWILIO_PHONE_NUMBER } = body;

    // Validation
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: "to" and "message" are required' },
        { status: 400 }
      );
    }

    // Send SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      to: to,
      from: from,
    });

    return NextResponse.json({
      success: true,
      messageId: result.sid,
      status: result.status,
      to: result.to,
      from: result.from,
      body: result.body,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('SMS sending error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to send SMS',
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}

// Get SMS status (optional)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const messageId = searchParams.get('messageId');

  if (!messageId) {
    return NextResponse.json(
      { error: 'Missing messageId parameter' },
      { status: 400 }
    );
  }

  try {
    const message = await twilioClient.messages(messageId).fetch();
    
    return NextResponse.json({
      messageId: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      body: message.body,
      sentDate: message.dateSent,
      direction: message.direction,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    });
  } catch (error: any) {
    console.error('SMS status error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch SMS status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Health check for SMS service (optional)
export async function HEAD() {
  const isTwilioConfigured = !!process.env.TWILIO_ACCOUNT_SID && 
                            !!process.env.TWILIO_AUTH_TOKEN && 
                            !!process.env.TWILIO_PHONE_NUMBER;

  return new NextResponse(null, {
    status: isTwilioConfigured ? 200 : 503,
    headers: {
      'X-SMS-Service-Status': isTwilioConfigured ? 'healthy' : 'unconfigured',
    },
  });
}