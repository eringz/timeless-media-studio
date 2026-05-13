"use client";

import { useEffect, useState } from "react";

type BookingLog = {
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
  email: string;
  timestamp: string;
  id: string;
  status?: "pending" | "approved";
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingLog[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BookingLog | null>(null);

  // LOAD LIVE DATA
  useEffect(() => {
    const load = () => {
      if (typeof window === "undefined") return;

      const data = JSON.parse(
        localStorage.getItem("adminBookingLogs") || "[]"
      ) as BookingLog[];

      setBookings(data);
    };

    load();
    const interval = setInterval(load, 2000);

    return () => clearInterval(interval);
  }, []);

  // SAVE BACK TO STORAGE
  const updateStorage = (data: BookingLog[]) => {
    localStorage.setItem(
      "adminBookingLogs",
      JSON.stringify(data)
    );
    setBookings(data);
  };

  // DELETE BOOKING
  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    updateStorage(updated);
    setSelected(null);
  };

  // APPROVE BOOKING
  const approveBooking = (id: string) => {
    const updated = bookings.map((b) =>
      b.id === id
        ? { ...b, status: "approved" }
        : b
    );

    updateStorage(updated);
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search..."
            className="w-full md:w-80 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
            <p>Total</p>
            <p className="text-2xl font-bold">
              {bookings.length}
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
            <p>Approved</p>
            <p className="text-2xl font-bold text-green-400">
              {
                bookings.filter(
                  (b) =>
                    b.status === "approved"
                ).length
              }
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
            <p>Pending</p>
            <p className="text-2xl font-bold text-yellow-400">
              {
                bookings.filter(
                  (b) =>
                    !b.status ||
                    b.status === "pending"
                ).length
              }
            </p>
          </div>
        </div>

        {/* LIST */}
        <div className="grid md:grid-cols-2 gap-4">

          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-5"
            >
              <div className="flex justify-between">
                <h2 className="font-bold">
                  {b.name}
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    b.status === "approved"
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {b.status || "pending"}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                📧 {b.email}
              </p>

              <p className="text-sm text-gray-400">
                📞 {b.phone}
              </p>

              <p className="text-sm text-gray-400">
                📅 {b.date}
              </p>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() =>
                    setSelected(b)
                  }
                  className="px-3 py-1 bg-gray-700 rounded-lg text-sm"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    approveBooking(b.id)
                  }
                  className="px-3 py-1 bg-green-600 rounded-lg text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    deleteBooking(b.id)
                  }
                  className="px-3 py-1 bg-red-600 rounded-lg text-sm"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">

            <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-gray-700">

              <h2 className="text-xl font-bold mb-4">
                Booking Details
              </h2>

              <div className="space-y-2 text-sm">
                <p>Name: {selected.name}</p>
                <p>Email: {selected.email}</p>
                <p>Phone: {selected.phone}</p>
                <p>Date: {selected.date}</p>
                <p>Package: {selected.packageType}</p>
                <p>Message: {selected.message}</p>
              </div>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="mt-5 w-full bg-gray-700 py-2 rounded-xl"
              >
                Close
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}