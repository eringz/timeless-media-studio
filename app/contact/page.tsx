"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type ContactSubmission = {
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
  email: string;
  timestamp: string;
  id: string;
};

function saveContactSubmission(submission: ContactSubmission) {
  if (typeof window === "undefined") return;

  const existing = JSON.parse(
    localStorage.getItem("contactSubmissions") || "[]"
  ) as ContactSubmission[];

  localStorage.setItem(
    "contactSubmissions",
    JSON.stringify([submission, ...existing])
  );
}

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("");
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);

  const emailDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "icloud.com",
    "hotmail.com",
  ];

  useEffect(() => {
    document.body.classList.add("contact-page");
    return () => document.body.classList.remove("contact-page");
  }, []);

  // EMAIL VALIDATION (anti typo + domain rules)
  const isValidEmail = (value: string) => {
    const regex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(value)) return false;

    const blockedTLDs = [".co", ".c", ".cm", ".con", ".cmo"];

    const domain = value.split("@")[1]?.toLowerCase() || "";
    const tld = "." + domain.split(".").pop();

    if (blockedTLDs.includes(tld)) return false;

    return true;
  };

  // AUTOCOMPLETE SUGGESTIONS
  const getEmailSuggestions = (value: string) => {
    if (!value.includes("@")) return [];

    const [name, domainPart] = value.split("@");

    if (!domainPart) {
      return emailDomains.map((d) => `${name}@${d}`);
    }

    return emailDomains
      .filter((d) =>
        d.startsWith(domainPart.toLowerCase())
      )
      .map((d) => `${name}@${d}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !phone ||
      !date ||
      !packageType ||
      !message
    ) {
      setFeedback("Please fill in all required fields.");
      return;
    }

    setShowEmailDialog(true);
  };

  const confirmBooking = async () => {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError(
        "Invalid email. Please check spelling (e.g. gmail.com)."
      );
      return;
    }

    try {
      const body = {
        name,
        phone,
        date,
        packageType,
        message,
        email,
      };

      const res = await fetch(
        "/api/send-confirmation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        throw new Error(
          await res.text() ||
            "Unable to send confirmation"
        );
      }

      const submission: ContactSubmission = {
        ...body,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
      };

      saveContactSubmission(submission);

      setFeedback(
        `Booking confirmed! Sent to ${email}`
      );

      setName("");
      setPhone("");
      setDate("");
      setPackageType("");
      setMessage("");
      setEmail("");

      setShowEmailDialog(false);
    } catch (err) {
      setFeedback(
        err instanceof Error
          ? err.message
          : "Error sending booking"
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-[1300px] mx-auto">

          {/* HEADER */}
          <div className="flex justify-end mb-8">
            <Link
              href="/"
              className="rounded-full border border-gray-700 bg-gray-900 px-5 py-3 text-sm hover:bg-gray-800"
            >
              Go back home
            </Link>
          </div>

          {/* FORM */}
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8">

            <div className="p-10">
              <span className="text-gray-400 uppercase tracking-[0.3em] text-sm">
                BOOK NOW
              </span>
              <h1 className="mt-6 text-5xl font-bold">
                Make memories with us
              </h1>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                Contact Form
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full p-3 bg-gray-800 rounded-xl"
                />

                <input
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="w-full p-3 bg-gray-800 rounded-xl"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full p-3 bg-gray-800 rounded-xl"
                />

                <select
                  value={packageType}
                  onChange={(e) =>
                    setPackageType(e.target.value)
                  }
                  className="w-full p-3 bg-gray-800 rounded-xl"
                >
                  <option value="">
                    Select Package
                  </option>
                  <option value="basic">
                    Basic
                  </option>
                  <option value="standard">
                    Standard
                  </option>
                  <option value="premium">
                    Premium
                  </option>
                </select>

                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  className="w-full p-3 bg-gray-800 rounded-xl"
                />

                <button className="w-full bg-gray-600 py-3 rounded-xl">
                  Submit
                </button>
              </form>

              {feedback && (
                <p className="mt-4 text-green-300 text-sm">
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL DIALOG */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-700">

            <h2 className="text-xl font-bold mb-3">
              Confirm Email
            </h2>

            <p className="text-gray-400 mb-4">
              Enter email for booking confirmation
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setShowSuggestions(true);
              }}
              onFocus={() =>
                setShowSuggestions(true)
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setShowSuggestions(false),
                  150
                )
              }
              className="w-full p-3 bg-gray-800 rounded-xl"
              placeholder="you@gmail.com"
            />

            {/* Suggestions */}
            {showSuggestions &&
              email.includes("@") && (
                <div className="mt-2 bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  {getEmailSuggestions(email)
                    .slice(0, 4)
                    .map((s, i) => (
                      <div
                        key={i}
                        onMouseDown={() => {
                          setEmail(s);
                          setShowSuggestions(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                      >
                        {s}
                      </div>
                    ))}
                </div>
              )}

            {emailError && (
              <p className="text-red-400 text-sm mt-2">
                {emailError}
              </p>
            )}

            <div className="flex gap-3 mt-5">

              <button
                onClick={() =>
                  setShowEmailDialog(false)
                }
                className="flex-1 bg-gray-800 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                className="flex-1 bg-gray-600 py-2 rounded-xl"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}