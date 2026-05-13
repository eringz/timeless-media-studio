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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking = {
      ...form,
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

    alert("Booking submitted!");

    setForm({
      name: "",
      email: "",
      phone: "",
      date: "",
      packageType: "",
      message: "",
    });
  };

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT TEXT */}
        <div className="px-2 lg:px-10">
          <p className="text-2xl font-black mb-3">
            BOOK NOW!
          </p>

          <h1 className="font-serif text-[#bfbfbf] text-[60px] sm:text-[78px] lg:text-[92px] leading-[0.82] tracking-[-4px]">
            Make your
            <br />
            memories
            <br />
            Documented
            <br />
            with us.
          </h1>

          <div className="h-px bg-gray-500 max-w-xl mt-10 mb-5" />

          <div className="flex justify-center gap-5 max-w-xl">
            <div className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center text-3xl font-bold">
              f
            </div>

            <div className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center text-2xl font-bold">
              ◎
            </div>

            <div className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center text-2xl font-bold">
              𝕏
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto bg-[#555555] rounded-[22px] p-8 lg:p-9 shadow-2xl"
        >
          <label className="block text-sm font-black mb-2">
            NAME
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full h-11 rounded bg-[#d9d9d9] text-black px-3 mb-2 outline-none"
          />

          <label className="block text-sm font-black mb-2">
            EMAIL
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full h-11 rounded bg-[#d9d9d9] text-black px-3 mb-2 outline-none"
          />

          <label className="block text-sm font-black mb-2">
            PHONE NUMBER
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full h-11 rounded bg-[#d9d9d9] text-black px-3 mb-2 outline-none"
          />

          <label className="block text-sm font-black mb-2">
            DATE
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full h-11 rounded bg-[#d9d9d9] text-black px-3 mb-2 outline-none"
          />

          <label className="block text-sm font-black mb-2">
            PACKAGE
          </label>
          <input
            name="packageType"
            value={form.packageType}
            onChange={handleChange}
            required
            className="w-full h-11 rounded bg-[#d9d9d9] text-black px-3 mb-2 outline-none"
          />

          <label className="block text-sm font-black mb-2">
            MESSAGE
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full h-32 rounded bg-[#d9d9d9] text-black px-3 py-2 outline-none resize-none"
          />

          <button
            type="submit"
            className="mt-5 w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-900 transition"
          >
            SUBMIT BOOKING
          </button>
        </form>
      </div>
    </section>
  );
}