import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { file } = await request.json();

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  let fileBuffer: Buffer | null = null;
  if (typeof file.data === "string" && file.data.startsWith("data:")) {
    const base64 = file.data.split(",")[1];
    fileBuffer = Buffer.from(base64, "base64");
  } else {
    return NextResponse.json({ error: "Invalid file data" }, { status: 400 });
  }

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: z.object({
      type: z.string(),
      role: z.string(),
      level: z.string(),
      techStack: z.array(z.string()),
    }),
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that reads a resume and extracts the following information:\n- Type: What type of resume is this? (Behavioural or Technical)\n- Role: What are the roles that the candidate can apply for?\n- Level: What is the experience of the candidate?\n- Tech Stack: What are the technologies that the candidate is familiar with?\n\nAnd based on this information, you will generate a structured output in the following format:\n{\n    type: string\n    role: string,\n    level: string,\n    techStack: string[]\n}\n\nPlease return only the structured output, without any additional text.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the information from this resume.",
          },
          {
            type: "file",
            data: fileBuffer,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
  });

  return NextResponse.json(object);
}
