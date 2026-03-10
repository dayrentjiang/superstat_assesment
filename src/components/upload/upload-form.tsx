"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo } from "@/actions/videos";
import { useUpload } from "@/hooks/use-upload";
import { Upload, FileVideo, CheckCircle2, AlertCircle } from "lucide-react";

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
      if (!publicUrl)
        throw new Error(videoUpload.error ?? "Failed to upload to storage.");

      const video = await createVideo(title.trim(), publicUrl);
      router.push(`/videos/${video.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed unexpectedly.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="text-center">
        <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Upload New Video</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Add a new match or training session to your video library.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="e.g. Grand Final 2026 Quarter 1"
            required
            disabled={videoUpload.uploading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Video File
          </label>

          <div className="relative group">
            <input
              type="file"
              accept="video/*"
              id="file-upload"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              required
              disabled={videoUpload.uploading}
            />
            <div
              className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
                file
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-300 bg-gray-50 group-hover:bg-gray-100 group-hover:border-teal-400"
              }`}
            >
              {file ? (
                <>
                  <FileVideo className="w-10 h-10 text-teal-600 mb-3" />
                  <p className="text-sm font-medium text-teal-900 truncate max-w-xs px-2">
                    {file.name}
                  </p>
                  <p className="text-xs text-teal-700 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-teal-600 bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> Ready to upload
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm font-semibold text-gray-700">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">(max 50MB)</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 p-4 rounded-lg border border-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={videoUpload.uploading || !file || !title.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-teal-600 focus:ring-4 focus:ring-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {videoUpload.uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Uploading Video...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Upload Video
          </>
        )}
      </button>
    </form>
  );
}
