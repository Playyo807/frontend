import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
        where: { email: session.user.email }
    })

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}-${originalName}`;

    // Ensure assets directory exists
    const assetsDir = path.join(process.cwd(), "public", "assets");
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Write file
    const filepath = path.join(assetsDir, filename);
    await writeFile(filepath, buffer);

    // Return the CDN URL
    const cdnUrl = process.env.NEXT_PUBLIC_CDN || "http://localhost:3000/assets/";
    const imagePath = `${cdnUrl}${filename}`;

    return NextResponse.json({ path: imagePath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}