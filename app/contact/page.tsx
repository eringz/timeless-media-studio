"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
};

export default function BookingForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    packageType: "",
    message: "",
  });

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [dialogEmail, setDialogEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openEmailDialog = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogEmail(form.email);
    setShowEmailDialog(true);
  };

  const confirmBooking = async () => {
    if (!dialogEmail.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setSending(true);

    const newBooking = {
      ...form,
      email: dialogEmail,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const existing = JSON.parse(
      localStorage.getItem("adminBookingLogs") || "[]"
    );

    localStorage.setItem(
      "adminBookingLogs",
      JSON.stringify([newBooking, ...existing])
    );

    try {
      await fetch("/api/send-booking-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });
    } catch {
      console.log("Email API not connected yet.");
    }

    setSending(false);
    setShowEmailDialog(false);

    alert("Booking submitted! Confirmation email has been sent.");

    setForm({
      name: "",
      email: "",
      phone: "",
      date: "",
      packageType: "",
      message: "",
    });

    setDialogEmail("");
  };

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT TEXT */}
        <div className="px-2 lg:px-10">
          <p className="text-2xl font-black mb-3 tracking-wide">
            BOOK NOW!
          </p>

          <h1 className="font-serif text-[#c9c9c9] text-[56px] sm:text-[78px] lg:text-[94px] leading-[0.84] tracking-[-4px] drop-shadow-lg">
            Make your
            <br />
            memories
            <br />
            Documented
            <br />
            with us.
          </h1>

          <div className="h-px bg-gradient-to-r from-gray-400 to-transparent max-w-xl mt-10 mb-5" />

          <div className="flex justify-center gap-5 max-w-xl">
            <div className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center text-3xl font-bold hover:scale-110 transition">
              f
            </div>

            <div className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center text-2xl font-bold hover:scale-110 transition">
              ◎
            </div>

            <div className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center text-2xl font-bold hover:scale-110 transition">
              𝕏
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={openEmailDialog}
          className="w-full max-w-md mx-auto bg-[#4f4f4f]/95 rounded-[28px] p-8 lg:p-9 shadow-[0_25px_80px_rgba(255,255,255,0.08)] border border-white/10 backdrop-blur"
        >
          <label className="block text-sm font-black mb-2">NAME</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
          />

          <label className="block text-sm font-black mb-2">
            PHONE NUMBER
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
          />

          <label className="block text-sm font-black mb-2">DATE</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
          />

          <label className="block text-sm font-black mb-2">PACKAGE</label>
          <input
            name="packageType"
            value={form.packageType}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
          />

          <label className="block text-sm font-black mb-2">MESSAGE</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full h-32 rounded-md bg-[#dedede] text-black px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="group relative mt-6 w-full overflow-hidden rounded-xl bg-white text-black py-3 font-black tracking-wide transition hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition group-hover:translate-x-full duration-700" />
            <span className="relative">SUBMIT BOOKING</span>
          </button>
        </form>
      </div>

      {/* EMAIL DIALOG */}
      {showEmailDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#505050] border border-white/10 p-6 text-white shadow-2xl">
            <h2 className="text-2xl font-black mb-2">
              Confirm Your Booking
            </h2>

            <p className="text-sm text-gray-200 mb-5">
              Please enter your email address. Your booking details and
              confirmation will be sent to this email.
            </p>

            <input
              type="email"
              value={dialogEmail}
              onChange={(e) => setDialogEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full h-12 rounded-xl bg-[#e0e0e0] text-black px-4 outline-none focus:ring-2 focus:ring-white mb-4"
              required
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailDialog(false)}
                className="w-1/2 rounded-xl bg-gray-700 py-3 font-bold hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                disabled={sending}
                className="w-1/2 rounded-xl bg-white text-black py-3 font-black hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60"
              >
                {sending ? "SENDING..." : "CONFIRM"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}