"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("contact-page");
    return () => {
      document.body.classList.remove("contact-page");
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleGoogleSignIn();
  };

  const handleGoogleSignIn = () => {
    if (typeof window === "undefined") return;
    const googleSignInUrl = "https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin";
    window.location.href = googleSignInUrl;
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex justify-end mb-8">
          <a
            href="/"
            className="inline-flex items-center rounded-full border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Go back home
          </a>
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
  );
}
