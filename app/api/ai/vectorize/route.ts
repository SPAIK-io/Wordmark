import { NextRequest, NextResponse } from "next/server";
import { vectorize, type Config } from "@neplex/vectorizer";
import type { VectorizeRequest } from "@/lib/ai/types";

// Enum values from @neplex/vectorizer (using literals to avoid isolatedModules issue)
// ColorMode: Color = 0, Binary = 1
// Hierarchical: Stacked = 0, Cutout = 1
// PathSimplifyMode: None = 0, Polygon = 1, Spline = 2

const VECTORIZE_CONFIG: Config = {
  colorMode: 0, // ColorMode.Color
  colorPrecision: 6,
  filterSpeckle: 4,
  spliceThreshold: 45,
  cornerThreshold: 60,
  hierarchical: 0, // Hierarchical.Stacked
  mode: 2, // PathSimplifyMode.Spline
  layerDifference: 5,
  lengthThreshold: 5,
  maxIterations: 2,
  pathPrecision: 5,
};

export async function POST(request: NextRequest) {
  try {
    const body: VectorizeRequest = await request.json();

    // Validate image data
    if (!body.image || body.image.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(body.image, "base64");

    // Vectorize using @neplex/vectorizer
    const svgData = await vectorize(imageBuffer, VECTORIZE_CONFIG);

    // Validate SVG output
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
