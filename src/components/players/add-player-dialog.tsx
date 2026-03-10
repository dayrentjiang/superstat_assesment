"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import { Player } from "@/lib/types";
import { createPlayer } from "@/actions/players";
import { useUpload } from "@/hooks/use-upload";
import { UserPlus, Image as ImageIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onPlayerCreated: (player: Player) => void;
}

export function AddPlayerDialog({ open, onClose, onPlayerCreated }: Props) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const avatarUpload = useUpload("avatars");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  function reset() {
    setName("");
    setPosition("");
    setAvatarFile(null);
    setAvatarPreview(null);
    setError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    startTransition(async () => {
      try {
        let avatarUrl: string | null = null;
        if (avatarFile) {
          avatarUrl = await avatarUpload.upload(avatarFile);
          if (!avatarUrl)
            throw new Error(avatarUpload.error ?? "Avatar upload failed");
        }

        const player = await createPlayer(
          name.trim(),
          avatarUrl,
          position || null,
        );
        onPlayerCreated(player);
        reset();
        onClose();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create player",
        );
      }
    });
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="backdrop:bg-black/40 bg-transparent p-0 m-auto"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-5 w-72 shadow-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-teal-600" />
          Add Player
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="e.g. Michael Jordan"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              <option value="">Any Position</option>
              <option value="PG">Point Guard (PG)</option>
              <option value="SG">Shooting Guard (SG)</option>
              <option value="SF">Small Forward (SF)</option>
              <option value="PF">Power Forward (PF)</option>
              <option value="C">Center (C)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Profile Photo
            </label>
            <div className="flex items-center gap-3">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Preview"
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
              )}
              <div className="relative flex-1">
                <input
                  type="file"
                  id="dialog-avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label
                  htmlFor="dialog-avatar-upload"
                  className="block w-full text-center px-3 py-2 text-xs font-semibold text-teal-800 bg-[#ccfbf1]/50 border border-[#ccfbf1] hover:bg-[#ccfbf1] rounded-lg cursor-pointer transition-colors"
                >
                  {avatarFile ? "Change Photo" : "Upload Photo"}
                </label>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-rose-600 text-xs">{error}</p>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full rounded-lg bg-teal-900 border border-teal-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 hover:border-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save Player"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
