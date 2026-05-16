import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload - Timeless Media Studio",
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  );
}