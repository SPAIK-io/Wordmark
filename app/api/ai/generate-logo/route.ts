import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { GenerateLogoRequest, AIIconStyle } from "@/lib/ai/types";

/** Lazy-initialized OpenAI client (prevents build-time errors) */
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/** Style-specific prompt prefixes for better logo results */
const STYLE_PREFIXES: Record<AIIconStyle, string> = {
  minimal: "Simple, clean, minimalist",
  geometric: "Geometric, sharp angles, modern shapes",
  abstract: "Abstract, artistic, creative forms",
  icon: "Flat icon style, simple shapes, app icon aesthetic",
};

/** Build an optimized prompt for logo generation */
function buildLogoPrompt(userPrompt: string, style: AIIconStyle): string {
  const prefix = STYLE_PREFIXES[style];
  return `${prefix} logo design: ${userPrompt}.
Single icon or symbol only, no text, no background,
vector-style with clean edges, suitable for branding.
Centered composition, monochromatic or limited colors.
Professional quality, scalable design.`;
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body: GenerateLogoRequest = await request.json();

    // Validate prompt
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (body.prompt.length > 500) {
      return NextResponse.json(
        { success: false, error: "Prompt too long (max 500 characters)" },
        { status: 400 }
      );
    }

    const style: AIIconStyle = body.style || "minimal";
    const enhancedPrompt = buildLogoPrompt(body.prompt.trim(), style);

    // Generate image with OpenAI
    const openai = getOpenAI();
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      background: "transparent",
      output_format: "png",
      quality: "high",
    });

    const imageData = result.data?.[0]?.b64_json;

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: "No image generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: imageData,
    });
  } catch (error) {
    console.error("Logo generation error:", error);

    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded. Please try again." },
          { status: 429 }
        );
      }
      if (error.status === 400) {
        return NextResponse.json(
          { success: false, error: "Invalid request. Try a different prompt." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate logo" },
      { status: 500 }
    );
  }
}
