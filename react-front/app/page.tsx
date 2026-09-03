"use client";

import { useEffect, useRef, useState } from "react";

type SavedImage = {
  id: string;
  url: string;
  name: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [images, setImages] = useState<SavedImage[]>([]);
  const [preview, setPreview] = useState<SavedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/images`)
      .then((res) => res.json())
      .then(setImages)
      .catch(() => {});
  }, []);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/images`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const newImage: SavedImage = await res.json();
      setImages((prev) => [newImage, ...prev]);
    }
    e.target.value = "";
  }

  function handleRemoveImage(id: string) {
    setImages((prev) => prev.filter((image) => image.id !== id));
    setPreview((prev) => (prev?.id === id ? null : prev));
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col gap-8 py-16 px-6">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-foreground px-6 py-3 text-background font-medium hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Upload Image
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex flex-col gap-2 rounded-lg border border-black/[.08] p-2 dark:border-white/[.145]"
            >
              <img
                src={image.url}
                alt={image.name}
                className="aspect-video w-full rounded object-cover"
              />
              <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                {image.name}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreview(image)}
                  className="flex-1 rounded-full border border-black/[.08] px-4 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="flex-1 rounded-full border border-red-600/20 px-4 py-1.5 text-sm text-red-600 hover:bg-red-600/10 dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-400/10"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {preview && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview.url}
            alt={preview.name}
            className="max-h-full max-w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
