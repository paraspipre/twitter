import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload a stream to Cloudinary
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const streamUpload = (buffer: Buffer): Promise<any> => {
   return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
         { folder: 'your-folder-name' },
         (error, result) => {
            if (result) resolve(result);
            else reject(error);
         }
      );
      Readable.from(buffer).pipe(stream);
   });
};

export const POST = async (req: NextRequest) => {
   try {
      const contentType = req.headers.get('content-type') || '';

      // Ensure it's a binary blob
      if (!contentType.startsWith('application/octet-stream')) {
         return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
      }

      // Read the raw binary data
      const arrayBuffer = await req.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload the buffer to Cloudinary
      const uploadResult = await streamUpload(buffer);

      return NextResponse.json({ url: uploadResult.secure_url });
   } catch (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
   }
};
