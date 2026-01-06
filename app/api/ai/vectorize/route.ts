import { NextRequest, NextResponse } from "next/server";
import type { VectorizeRequest } from "@/lib/ai/types";

const RECRAFT_API_URL = "https://external.api.recraft.ai/v1/images/vectorize";

export async function POST(request: NextRequest) {
  try {
    // Validate API key is configured
    if (!process.env.RECRAFT_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Recraft API key not configured" },
        { status: 500 }
      );
    }

    const body: VectorizeRequest = await request.json();

    // Validate image data
    if (!body.image || body.image.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 }
      );
    }

    // Convert base64 to blob for multipart upload
    const imageBuffer = Buffer.from(body.image, "base64");
    const blob = new Blob([imageBuffer], { type: "image/png" });

    // Create form data for Recraft API
    const formData = new FormData();
    formData.append("file", blob, "logo.png");

    // Call Recraft vectorization API
    const response = await fetch(RECRAFT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RECRAFT_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Recraft API error:", response.status, errorText);

      if (response.status === 401) {
        return NextResponse.json(
          { success: false, error: "Invalid Recraft API key" },
          { status: 500 }
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded. Please try again." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Vectorization failed" },
        { status: 500 }
      );
    }

    // Recraft returns SVG directly
    const svgData = await response.text();

    // Basic validation that we got SVG
    if (!svgData.includes("<svg")) {
      return NextResponse.json(
        { success: false, error: "Invalid SVG response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      svg: svgData,
    });
  } catch (error) {
    console.error("Vectorization error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to vectorize image" },
      { status: 500 }
    );
  }
}
