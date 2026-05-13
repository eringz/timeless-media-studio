"use client";

import { useState } from "react";
import { Facebook, Instagram } from "lucide-react";

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  date: string;
  packageType: string;
  message: string;
};

export default function BookingPage() {
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    date: "",
    packageType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

    alert("Booking submitted successfully!");

    setForm({
      name: "",
      phone: "",
      email: "",
      date: "",
      packageType: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12">
      <section className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="px-2 lg:px-10">
          <p className="text-2xl font-black tracking-tight mb-2">
            BOOK NOW!
          </p>

          <h1 className="font-serif text-[64px] sm:text-[82px] lg:text-[92px] leading-[0.82] tracking-[-4px] text-[#bdbdbd] max-w-xl">
            Make your
            <br />
            memories
            <br />
            Documented
            <br />
            with us.
          </h1>

          <div className="h-px bg-[#777] max-w-xl mt-10 mb-5" />

          <div className="flex gap-5 justify-center max-w-xl">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center hover:scale-105 transition"
            >
              <Facebook size={28} />
            </a>

            <a
              href="#"
              className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center hover:scale-105 transition"
            >
              <Instagram size={28} />
            </a>

            <a
              href="#"
              className="w-12 h-12 rounded-full bg-[#d9d9d9] text-black flex items-center justify-center text-2xl font-bold hover:scale-105 transition"
            >
              𝕏
            </a>
          </div>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#555] rounded-[22px] p-8 lg:p-9 w-full max-w-md mx-auto shadow-2xl"
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
            DATE
          </label>
          <input
            name="date"
            type="date"
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

      </section>
    </main>
  );
}