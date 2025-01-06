// app/api/generateEpub/route.ts

import { NextResponse } from "next/server";
import { generateEpubFile } from "../../../../tools/generateEpub";

export async function POST(request: Request) {
  try {
    const { options }: { options: any } = await request.json(); // Parse JSON body

    // Generate the EPUB file
    const base64Epub = await generateEpubFile(options);

    // Return the base64 string in the response
    return NextResponse.json({ base64Epub });
  } catch (error: unknown) {
     // Handle error (default to a generic message if error isn't an instance of Error)
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
     return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}