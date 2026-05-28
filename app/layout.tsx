import type { Metadata } from "next";
import "./globals.css";
import LiveChatWidget from "@/components/LiveChatWidget";
import { TransitionProvider } from "@/context/TransitionContext";

export const metadata: Metadata = {
  title: "Timeless Media Studio",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TransitionProvider>
          {children}
          <LiveChatWidget />
        </TransitionProvider>
      </body>
    </html>
  );
}
