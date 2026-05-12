"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type PendingSubmission = {
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
};

type ContactSubmission = PendingSubmission & {
  email: string;
  timestamp: string;
  id: string;
};

function saveContactSubmission(submission: ContactSubmission) {
  if (typeof window === "undefined") return;

  const existing = JSON.parse(localStorage.getItem("contactSubmissions") || "[]") as ContactSubmission[];
  const next = [submission, ...existing];
  localStorage.setItem("contactSubmissions", JSON.stringify(next));
}

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [pendingSubmission, setPendingSubmission] = useState<PendingSubmission | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    document.body.classList.add("contact-page");
    return () => {
      document.body.classList.remove("contact-page");
    };
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    const payload = decodeJwt(response.credential);
    if (!payload?.email) {
      setFeedback("Unable to determine the signed-in Google account email.");
      return;
    }

    if (!pendingSubmission) {
      setFeedback("No pending submission found. Please try again.");
      return;
    }

    const body = {
      ...pendingSubmission,
      email: payload.email,
    };

    try {
      const res = await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Unable to send confirmation email.");
      }

      const submission: ContactSubmission = {
        ...pendingSubmission,
        email: payload.email,
        timestamp: new Date().toISOString(),
        id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      saveContactSubmission(submission);

      setFeedback(`Booking confirmed! Confirmation sent to ${payload.email}. Saved to admin logs.`);
      setName("");
      setPhone("");
      setDate("");
      setPackageType("");
      setMessage("");
      setPendingSubmission(null);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Failed to send confirmation email.");
    }
  };

  const initializeGoogle = () => {
    const google = window.google;
    if (!google?.accounts?.id) {
      console.error("Google Identity Services not loaded");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable not set");
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
      });
      setGoogleReady(true);
    } catch (error) {
      console.error("Failed to initialize Google Identity Services:", error);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPendingSubmission({ name, phone, date, packageType, message });

    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setFeedback("Google sign-in is not configured. Please contact support.");
      return;
    }

    if (!googleReady) {
      setFeedback("Google sign-in is loading. Please wait a moment and try again.");
      return;
    }

    const google = window.google;
    if (!google?.accounts?.id) {
      setFeedback("Google sign-in is not available. Please refresh the page and try again.");
      return;
    }

    setFeedback("Opening Google sign-in... \nPlease select your account to receive confirmation.");
    google.accounts.id.prompt();
  };

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogle} />
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex justify-end mb-8">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Go back home
            </Link>
          </div>
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-center">
            <div className="bg-transparent rounded-3xl p-10">
              <span className="text-sm font-semibold uppercase tracking-[0.32em] text-gray-400">BOOK NOW!</span>
              <h1 className="mt-8 text-5xl font-sans font-extrabold leading-tight text-white" style={{ fontFamily: "sans-serif" }}>
                Make your memories documented with us.
              </h1>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-[32px] p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6">Contact Form</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Phone number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-gray-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Package</label>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value)}
                      className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-gray-500 focus:outline-none"
                      required
                    >
                      <option value="" className="bg-gray-800 text-white">Select a package</option>
                      <option value="basic" className="bg-gray-800 text-white">Basic</option>
                      <option value="standard" className="bg-gray-800 text-white">Standard</option>
                      <option value="premium" className="bg-gray-800 text-white">Premium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message"
                    rows={5}
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gray-600 py-4 text-lg font-semibold text-white transition duration-200 hover:bg-gray-500 active:scale-95"
                >
                  Submit
                </button>
              </form>
              {feedback ? <p className="mt-4 whitespace-pre-line text-sm text-green-300">{feedback}</p> : null}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-5">Live Maps</h2>
            <div className="overflow-hidden rounded-[32px] border border-gray-700 shadow-2xl">
              <iframe
                title="Live Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086988477722!2d-122.41941518468164!3d37.774929679759906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085818f0ebb8c4f%3A0x44c8f74ee4a5e0ae!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000"
                className="h-[260px] w-full border-0 bg-gray-900"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
