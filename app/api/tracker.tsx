"use client";

import { useEffect, useState } from "react";

type BookingStatus =
  | "pending"
  | "approved"
  | "in_process"
  | "for_pick_up"
  | "completed";

type BookingLog = {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  packageType: string;
  message: string;
  timestamp: string;
  confirmationNumber: string;
  status: BookingStatus;
};

export default function TrackerPage() {
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [booking, setBooking] = useState<BookingLog | null>(null);
  const [notFound, setNotFound] = useState(false);

  const findBooking = () => {
    const logs = JSON.parse(
      localStorage.getItem("adminBookingLogs") || "[]"
    ) as BookingLog[];

    const found = logs.find(
      (log) =>
        log.confirmationNumber?.toLowerCase() ===
        confirmationNumber.trim().toLowerCase()
    );

    setBooking(found || null);
    setNotFound(!found);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (confirmationNumber.trim()) {
        findBooking();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [confirmationNumber]);

  const getStatusLabel = (status: BookingStatus) => {
    if (status === "pending") return "Pending Approval";
    if (status === "approved") return "Approved";
    if (status === "in_process") return "In Process";
    if (status === "for_pick_up") return "For Pick Up";
    if (status === "completed") return "Completed";
    return status;
  };

  const steps: BookingStatus[] = [
    "pending",
    "approved",
    "in_process",
    "for_pick_up",
    "completed",
  ];

  const currentStep = booking ? steps.indexOf(booking.status) : -1;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl bg-[#4f4f4f] rounded-3xl p-8 border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-black mb-2">Track Your Booking</h1>

        <p className="text-gray-300 mb-6">
          Enter your confirmation number to view real-time booking status.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={confirmationNumber}
            onChange={(e) => setConfirmationNumber(e.target.value)}
            placeholder="Example: BK-2026-123456"
            className="flex-1 h-12 rounded-xl bg-white text-black px-4 outline-none"
          />

          <button
            onClick={findBooking}
            className="bg-white text-black px-6 py-3 rounded-xl font-black hover:scale-[1.03] active:scale-[0.97] transition"
          >
            TRACK
          </button>
        </div>

        {notFound && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 p-4 rounded-xl">
            No booking found with this confirmation number.
          </div>
        )}

        {booking && (
          <div className="bg-black/35 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Confirmation Number</p>
            <p className="text-2xl font-black tracking-widest mb-5">
              {booking.confirmationNumber}
            </p>

            <p className="text-gray-400 text-sm">Current Status</p>
            <p className="text-xl font-black text-green-300 mb-6">
              {getStatusLabel(booking.status)}
            </p>

            <div className="space-y-3 mb-6">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index <= currentStep
                        ? "bg-green-500 text-black"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <p
                    className={
                      index <= currentStep
                        ? "text-white font-bold"
                        : "text-gray-400"
                    }
                  >
                    {getStatusLabel(step)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 text-sm space-y-1 text-gray-300">
              <p>Name: {booking.name}</p>
              <p>Email: {booking.email}</p>
              <p>Date: {booking.date}</p>
              <p>Package: {booking.packageType}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}