import { NextRequest, NextResponse } from 'next/server';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meeleygp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Newsletter subscription:', { email });

    // Send to Formspree
    const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        _subject: 'New Newsletter Subscription',
      }),
    });

    const responseData = await formspreeResponse.json();

    if (!formspreeResponse.ok) {
      console.error('Formspree error:', responseData);
      return NextResponse.json(
        { error: `Failed to subscribe: ${responseData.error || 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log('Newsletter subscription sent successfully via Formspree');
    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
