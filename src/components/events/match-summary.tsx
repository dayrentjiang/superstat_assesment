"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Event } from "@/lib/types";
import { generateSummary } from "@/actions/summary";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateSummary(events, videoId, videoTitle);
      setSummary(result);
      setIsExpanded(true); // Auto-expand when newly generated
    } catch {
      setError(
        "Failed to generate summary. Check your OpenAI API key and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] shadow-sm mb-6 overflow-hidden">
      <div className="p-4 sm:p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#bbf7d0]/50 bg-linear-to-r from-[#f0fdf4] to-white">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 text-white p-2 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-teal-900 flex items-center gap-2">
              AI Match Summary
              {summary && !loading && (
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Saved
                </span>
              )}
            </h2>
            <p className="text-sm text-teal-700/80">
              Intelligent insights generated from your tagged events.
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-900 disabled:opacity-50 transition-all shadow-sm focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none"
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
            "Regenerate Snapshot"
          ) : (
            "Generate AI Summary"
          )}
        </button>
      </div>

      <div className="p-4 sm:p-6 bg-white shrink-0">
        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg mb-3 border border-rose-100 font-medium">
            {error}
          </p>
        )}

        {!summary && !loading && !error && (
          <p className="text-sm text-gray-500 text-center py-6">
            Click &quot;Generate AI Summary&quot; to create a detailed match
            analysis from your tagged timeline events.
          </p>
        )}

        {summary && !loading && (
          <div className="relative">
            <div
              className={`prose prose-sm max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-headings:text-teal-900 prose-a:text-teal-600 transition-all duration-300 ease-in-out ${
                isExpanded ? "h-auto" : "max-h-48 overflow-hidden"
              }`}
            >
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>

            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent pointer-events-none" />
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-100"
            >
              {isExpanded ? (
                <>
                  Read Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Read Full Summary <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
