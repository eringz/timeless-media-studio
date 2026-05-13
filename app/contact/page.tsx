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
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 bg-gray-900 p-6 rounded-2xl border border-gray-700"
      >
        <h1 className="text-2xl font-bold">Book an Appointment</h1>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />

        {/* ✅ FIXED DATE PICKER */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <input
          name="packageType"
          placeholder="Package Type"
          value={form.packageType}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold">
          Submit Booking
        </button>
      </form>
    </div>
  );
}