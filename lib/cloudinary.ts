import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Configure Cloudinary v2
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const FOLDER = 'blog-covers';

export type UploadFile = File | Blob | { arrayBuffer: () => Promise<ArrayBuffer>; type?: string };

export async function uploadImage(file: UploadFile): Promise<string> {
  console.log('🔵 uploadImage called');

  if (!cloudName || !apiKey || !apiSecret) {
    const error = 'Cloudinary env vars (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) must be set';
    console.error('❌ Missing env vars:', { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
    throw new Error(error);
  }

  console.log('✅ Cloudinary config verified:', {
    cloudName,
    hasApiKey: !!apiKey,
    hasApiSecret: !!apiSecret,
  });

  // Convert file to base64 data URI
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = file instanceof File ? file.type : (file as { type?: string }).type || 'image/jpeg';
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64}`;

  console.log('📦 File converted to base64:', {
    mimeType,
    bufferSize: buffer.length,
    base64Length: base64.length,
    dataUriPrefix: dataUri.substring(0, 50) + '...',
  });

  try {
    console.log('🚀 Starting Cloudinary upload...');

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: FOLDER,
    });

    console.log('✅ Cloudinary upload successful!', {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    });

    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', {
      error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
