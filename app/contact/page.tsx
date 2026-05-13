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

  const next = [submission, ...existing];

  localStorage.setItem(
    "contactSubmissions",
    JSON.stringify(next)
  );
}

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("");
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [showEmailDialog, setShowEmailDialog] =
    useState(false);

  const [feedback, setFeedback] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    document.body.classList.add("contact-page");

    return () => {
      document.body.classList.remove("contact-page");
    };
  }, []);

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
      setEmailError("Email address is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");

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
        const errorText = await res.text();

        throw new Error(
          errorText ||
            "Unable to send confirmation email."
        );
      }

      const submission: ContactSubmission = {
        ...body,
        timestamp: new Date().toISOString(),
        id:
          typeof crypto !== "undefined" &&
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,
      };

      saveContactSubmission(submission);

      setFeedback(
        `Booking confirmed! Confirmation sent to ${email}.`
      );

      setName("");
      setPhone("");
      setDate("");
      setPackageType("");
      setMessage("");
      setEmail("");

      setShowEmailDialog(false);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Failed to send confirmation."
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-[1300px] mx-auto">

          {/* Back Button */}
          <div className="flex justify-end mb-8">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Go back home
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-center">

            {/* Left Content */}
            <div className="bg-transparent rounded-3xl p-10">
              <span className="text-sm font-semibold uppercase tracking-[0.32em] text-gray-400">
                BOOK NOW!
              </span>

              <h1
                className="mt-8 text-5xl font-extrabold leading-tight text-white"
                style={{ fontFamily: "sans-serif" }}
              >
                Make your memories documented with us.
              </h1>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-900 border border-gray-700 rounded-[32px] p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6">
                Contact Form
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter your phone number"
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Date + Package */}
                <div className="grid gap-4 lg:grid-cols-2">

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Date
                    </label>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
                      className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-gray-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Package
                    </label>

                    <select
                      value={packageType}
                      onChange={(e) =>
                        setPackageType(e.target.value)
                      }
                      className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-gray-500 focus:outline-none"
                      required
                    >
                      <option value="">
                        Select a package
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
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Message
                  </label>

                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    placeholder="Write your message"
                    rows={5}
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gray-600 py-4 text-lg font-semibold text-white transition duration-200 hover:bg-gray-500 active:scale-95"
                >
                  Submit
                </button>
              </form>

              {/* Feedback */}
              {feedback && (
                <p className="mt-4 text-sm text-green-300">
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL POPUP DIALOG */}
      {showEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <div className="w-full max-w-md rounded-3xl border border-gray-700 bg-gray-900 p-8 shadow-2xl">

            <h2 className="text-2xl font-bold text-white mb-4">
              Confirm Booking
            </h2>

            <p className="text-gray-300 mb-5">
              Enter the email address where the
              booking confirmation will be sent.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="Enter your email address"
              className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
            />

            {emailError && (
              <p className="mt-2 text-sm text-red-400">
                {emailError}
              </p>
            )}

            <div className="mt-6 flex gap-3">

              {/* Cancel */}
              <button
                type="button"
                onClick={() => {
                  setShowEmailDialog(false);
                  setEmail("");
                  setEmailError("");
                }}
                className="flex-1 rounded-2xl border border-gray-700 bg-gray-800 py-3 text-white transition hover:bg-gray-700"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                type="button"
                onClick={confirmBooking}
                className="flex-1 rounded-2xl bg-gray-600 py-3 font-semibold text-white transition hover:bg-gray-500"
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