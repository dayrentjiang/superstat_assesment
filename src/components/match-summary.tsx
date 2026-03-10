"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Event } from "@/lib/types";
import { generateSummary } from "@/actions/summary";

interface MatchSummaryProps {
  events: Event[];
  videoId: string;
  videoTitle: string;
  initialSummary: string | null;
}

export function MatchSummary({
  events,
  videoId,
  videoTitle,
  initialSummary,
}: MatchSummaryProps) {
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateSummary(events, videoId, videoTitle);
      setSummary(result);
    } catch {
      setError(
        "Failed to generate summary. Check your OpenAI API key and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">AI Match Summary</h2>
          {summary && !loading && (
            <span className="text-xs text-gray-400 font-normal">
              Saved
            </span>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating...
            </>
          ) : summary ? (
            "Regenerate"
          ) : (
            "Generate Summary"
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {!summary && !loading && (
        <p className="text-sm text-gray-400">
          Click &quot;Generate Summary&quot; to create an AI-powered match
          analysis from your tagged events.
        </p>
      )}

      {summary && !loading && (
        <div className="prose prose-sm max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-2 prose-li:text-gray-600 prose-li:my-0.5 prose-ul:my-1 prose-strong:text-gray-900">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
