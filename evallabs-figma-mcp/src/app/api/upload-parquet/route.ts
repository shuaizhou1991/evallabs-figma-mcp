import { NextRequest, NextResponse } from 'next/server';
import { ParquetReader } from '@dsnp/parquetjs';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Use a temporary file path to read with ParquetReader
    const tempFilePath = `/tmp/${file.name}`;
    await fs.promises.writeFile(tempFilePath, fileBuffer);

    const reader = await ParquetReader.openFile(tempFilePath);
    const cursor = reader.getCursor();
    
    const records = [];
    let record = null;
    while (record = await cursor.next()) {
      records.push(record);
    }
    
    await reader.close();
    await fs.promises.unlink(tempFilePath); // Clean up the temporary file

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error processing Parquet file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to process Parquet file', details: errorMessage }, { status: 500 });
  }
}
