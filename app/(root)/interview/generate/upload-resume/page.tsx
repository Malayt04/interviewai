"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUp, Loader2 } from "lucide-react"; 
import { useRouter } from "next/navigation";

type ScannedResume = {
  type: string;
  role: string;
  level: string;
  techStack: string[];
};

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState<ScannedResume | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5); 
  const [generating, setGenerating] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/currentUser")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUserId(data?.id ?? null));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (
      selectedFile &&
      selectedFile.type === "application/pdf" &&
      selectedFile.size <= 5 * 1024 * 1024
    ) {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast.error("Only PDF files under 5MB are allowed.");
      setFile(null);
    }
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    setLoading(true);
    setScanned(null);
    try {
      const encodedFile = {
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      };
      const res = await fetch("/api/read-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: encodedFile, numQuestions }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to scan resume");
      }
      const data = await res.json();
      setScanned(data);
    } catch (err) {
      toast.error((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  const handleGenerate = async () => {
    if (!scanned) {
      toast.error("No scanned resume data available.");
      return;
    }
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
    setGenerating(true);
    try {
      const generateRes = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: scanned.type,
          role: scanned.role,
          level: scanned.level,
          techstack: scanned.techStack.join(","),
          amount: numQuestions,
          userid: userId,
        }),
      });
      if (!generateRes.ok) {
        const errorData = await generateRes.json();
        throw new Error(errorData.message || "Failed to generate interview");
      }
      toast.success("Interview created successfully!");
      router.push("/");
    } catch (err) {
      toast.error((err as Error).message || "An unexpected error occurred.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div 
      className="w-full"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <section className="max-w-xl mx-auto bg-white dark:bg-dark-200 rounded-2xl shadow-lg p-8 mt-12 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-primary-100 dark:text-primary-200 mb-2">
          Upload Resume
        </h2>
        <form className="flex flex-col gap-6" onSubmit={handleScan}>
          <div
            className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging
                ? "border-primary-200 bg-primary-200/10"
                : "border-input hover:border-muted-foreground/50"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              {file ? (
                <span className="font-medium text-light-100">{file.name}</span>
              ) : (
                <span>Drop your PDF here or click to browse.</span>
              )}
            </p>
          </div>


          <label className="flex flex-col gap-2">
            <span className="font-semibold text-light-600">
              Number of Questions
            </span>
            <input
              type="number"
              min={1}
              max={20}
              step={1}
              className="input !bg-light-100 !text-dark-100 !rounded-lg px-4 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-primary-200 w-fit"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
            />
          </label>

          <Button
            className="btn-primary w-fit self-end"
            type="submit"
            disabled={!file || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </span>
            ) : (
              "Scan"
            )}
          </Button>
        </form>


        {scanned && (
          <div className="bg-light-100 dark:bg-dark-300 rounded-xl p-6 flex flex-col gap-3 border border-input">
            <h3 className="text-lg font-semibold text-primary-100 dark:text-primary-200 mb-2">
              Scanned Resume Data
            </h3>
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-semibold text-light-600">Type:</span>{" "}
                <span className="text-light-100">{scanned.type}</span>
              </div>
              <div>
                <span className="font-semibold text-light-600">Role:</span>{" "}
                <span className="text-light-100">{scanned.role}</span>
              </div>
              <div>
                <span className="font-semibold text-light-600">Level:</span>{" "}
                <span className="text-light-100">{scanned.level}</span>
              </div>
              <div>
                <span className="font-semibold text-light-600">
                  Tech Stack:
                </span>{" "}
                <span className="text-light-100">
                  {scanned.techStack.join(", ")}
                </span>
              </div>
            </div>
          </div>
        )}
        <Button
          className="btn-primary w-fit self-end"
          type="button"
          disabled={!scanned || generating}
          onClick={handleGenerate}
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate"
          )}
        </Button>
      </section>
    </div>
  );
}
