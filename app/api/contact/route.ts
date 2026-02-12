import { NextRequest, NextResponse } from 'next/server';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meeleygp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Sending to Formspree:', { name, email });

    // Send to Formspree
    const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });

    const responseData = await formspreeResponse.json();

    if (!formspreeResponse.ok) {
      console.error('Formspree error:', responseData);
      return NextResponse.json(
        { error: `Failed to send message: ${responseData.error || 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log('Message sent successfully via Formspree');
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
