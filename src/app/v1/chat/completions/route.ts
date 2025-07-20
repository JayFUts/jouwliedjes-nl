import { NextResponse, NextRequest } from "next/server";
// import { DEFAULT_MODEL, sunoApi } from "@/lib/SunoApi";
// import { corsHeaders } from "@/lib/utils";
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

/**
 * desc
 *
 */
export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    let userMessage = null;
    const { messages } = body;
    for (let message of messages) {
      if (message.role == 'user') {
        userMessage = message;
      }
    }

    if (!userMessage) {
      return new NextResponse(JSON.stringify({ error: 'Prompt message is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          // ...corsHeaders
        }
      });
    }


    // Temporarily disable sunoApi to test build
    // const audioInfo = await (await sunoApi((await cookies()).toString())).generate(userMessage.content, true, DEFAULT_MODEL, true);
    
    // const audio = audioInfo[0]
    const data = `## Build Test: API temporarily disabled for debugging. Prompt was: ${userMessage.content}`

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error('Error generating audio:', JSON.stringify(error.response.data));
    return new NextResponse(JSON.stringify({ error: 'Internal server error: ' + JSON.stringify(error.response.data.detail) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        // ...corsHeaders
      }
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}