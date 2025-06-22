// app/api/gemini/route.ts

import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

import type { GeminiRequest, GeminiResponse } from '@/lib/gemini-types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest): Promise<NextResponse<GeminiResponse>> {
  try {
    const body: GeminiRequest = await request.json();
    const { message, model = 'gemini-1.5-flash', config } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required', success: false, text: '' },
        { status: 400 }
      );
    }

    const generateConfig = {
      model,
      contents: message,
      ...(config && {
        config: {
          maxOutputTokens: config.maxOutputTokens,
          temperature: config.temperature,
          topP: config.topP,
          topK: config.topK,
          stopSequences: config.stopSequences,
          systemInstruction: config.systemInstruction,
        },
      }),
    };

    const response = await ai.models.generateContent(generateConfig);
    // return (response = '');

    return NextResponse.json({
      text: response.text,
      success: true,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate content',
        success: false,
        text: '',
      },
      { status: 500 }
    );
  }
}
