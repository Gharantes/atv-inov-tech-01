"use client";

import { useRef, useState } from "react";

type SavedImage = {
  id: string;
  url: string;
  name: string;
};

const DUMMY_IMAGES: SavedImage[] = [
  { id: "1", url: "https://picsum.photos/id/10/400/300", name: "forest.jpg" },
  { id: "2", url: "https://picsum.photos/id/20/400/300", name: "laptop.jpg" },
  { id: "3", url: "https://picsum.photos/id/30/400/300", name: "keyboard.jpg" },
  { id: "4", url: "https://picsum.photos/id/40/400/300", name: "plant.jpg" },
  { id: "5", url: "https://picsum.photos/id/50/400/300", name: "mountains.jpg" },
  { id: "6", url: "https://picsum.photos/id/60/400/300", name: "road.jpg" },
];

export default function Home() {
  const [images, setImages] = useState<SavedImage[]>(DUMMY_IMAGES);
  const [preview, setPreview] = useState<SavedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImage: SavedImage = {
      id: Date.now().toString(),
      url: URL.createObjectURL(file),
      name: file.name,
    };
    setImages((prev) => [newImage, ...prev]);
    e.target.value = "";
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
              <button
                onClick={() => setPreview(image)}
                className="rounded-full border border-black/[.08] px-4 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                Preview
              </button>
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
