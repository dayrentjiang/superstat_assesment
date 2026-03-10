"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export function useUpload(bucket: string) {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      setState({ uploading: true, progress: 0, error: null });

      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileName = `${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, { contentType: file.type });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

        setState({ uploading: false, progress: 100, error: null });
        return data.publicUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setState({ uploading: false, progress: 0, error: message });
        return null;
      }
    },
    [bucket]
  );

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null });
  }, []);

  return { ...state, upload, reset };
}
