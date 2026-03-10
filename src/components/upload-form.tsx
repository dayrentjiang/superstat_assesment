"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo } from "@/actions/videos";
import { useUpload } from "@/hooks/use-upload";

export function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const videoUpload = useUpload("videos");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setError("");

    try {
      const publicUrl = await videoUpload.upload(file);
      if (!publicUrl) throw new Error(videoUpload.error ?? "Upload failed");

      const video = await createVideo(title.trim(), publicUrl);
      router.push(`/videos/${video.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="e.g. Lakers vs Celtics Q1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
          required
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={videoUpload.uploading || !file || !title.trim()}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {videoUpload.uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
