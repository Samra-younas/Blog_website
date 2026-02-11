import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getCookieName } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  console.log('🔵 POST /api/upload called');

  try {
    // Verify authentication
    const token = request.cookies.get(getCookieName())?.value;
    if (!token) {
      console.error('❌ No auth token found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      console.error('❌ Invalid or expired token');
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    console.log('✅ User authenticated');

    // Get image from FormData
    const formData = await request.formData();
    const file = formData.get('image') as File;

    console.log('📦 FormData received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
    });

    if (!file || !(file instanceof File)) {
      console.error('❌ Missing or invalid image file in FormData');
      return NextResponse.json(
        { error: 'Missing or invalid "image" file in FormData' },
        { status: 400 }
      );
    }

    console.log('🚀 Calling uploadImage...');

    // Upload to Cloudinary
    const url = await uploadImage(file);

    console.log('✅ Upload complete, returning URL:', url);

    // Return the URL in the response
    return NextResponse.json({ url });
  } catch (err) {
    console.error('❌ POST /api/upload error:', err);
    console.error('Error details:', {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      fullError: err,
    });

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
