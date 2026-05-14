"use client";

import { useState } from "react";

type PackageType = "Basic Package" | "Elite Package" | "Premium Package";
type PaymentMethod = "Cash" | "GCash" | "Other Payment";

const packages: Record<PackageType, number> = {
  "Basic Package": 10,
  "Elite Package": 20,
  "Premium Package": 30,
};

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    packageType: "" as PackageType | "",
    message: "",
  });

  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [sending, setSending] = useState(false);

  const price = form.packageType ? packages[form.packageType] : 0;
  const total = price;

  const generateConfirmationNumber = () => {
    return `BK-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmailDialog(true);
  };

  const confirmBooking = async () => {
    if (!email.trim()) return alert("Email is required.");

    setSending(true);

    const confirmation = generateConfirmationNumber();

    const receipt = {
      package: form.packageType,
      packagePrice: price,
      subtotal: price,
      total,
      currency: "PHP",
      paymentMethod,
    };

    const booking = {
      ...form,
      email: email.trim().toLowerCase(),
      confirmationNumber: confirmation,
      receipt,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const existing = JSON.parse(localStorage.getItem("adminBookingLogs") || "[]");
    localStorage.setItem("adminBookingLogs", JSON.stringify([booking, ...existing]));

    await fetch("/api/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    }).catch(() => console.log("Email API not connected."));

    if (paymentMethod === "GCash" || paymentMethod === "Other Payment") {
      const res = await fetch("/api/create-paymongo-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
    }

    setSending(false);
    setShowEmailDialog(false);
    setConfirmationNumber(confirmation);

    setForm({
      name: "",
      phone: "",
      date: "",
      packageType: "",
      message: "",
    });

    setEmail("");
    setPaymentMethod("Cash");
  };

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-2xl font-black mb-3">BOOK NOW!</p>

          <h1 className="font-serif text-[#c9c9c9] text-[56px] sm:text-[78px] lg:text-[94px] leading-[0.84] tracking-[-4px]">
            Make your
            <br />
            memories
            <br />
            Documented
            <br />
            with us.
          </h1>

          <p className="text-gray-400 mt-6">
            After booking, you will receive a confirmation number and receipt.
          </p>
        </div>

        <form
          onSubmit={submitBooking}
          className="w-full max-w-md mx-auto bg-[#4f4f4f] rounded-[30px] p-8 shadow-2xl"
        >
          <label className="block text-sm font-black mb-2">NAME</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3"
          />

          <label className="block text-sm font-black mb-2">PHONE NUMBER</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3"
          />

          <label className="block text-sm font-black mb-2">DATE</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3"
          />

          <label className="block text-sm font-black mb-2">PACKAGE</label>
          <select
            name="packageType"
            value={form.packageType}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3"
          >
            <option value="">Select Package</option>
            <option value="Basic Package">Basic Package - ₱10</option>
            <option value="Elite Package">Elite Package - ₱20</option>
            <option value="Premium Package">Premium Package - ₱30</option>
          </select>

          {form.packageType && (
            <div className="bg-black/30 rounded-xl p-4 mb-3 text-sm">
              <p className="font-black mb-2">QUOTE BREAKDOWN</p>
              <p>Package: {form.packageType}</p>
              <p>Price: ₱{price}</p>
              <p className="font-black text-lg mt-2">Total: ₱{total}</p>
            </div>
          )}

          <label className="block text-sm font-black mb-2">PAYMENT METHOD</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3"
          >
            <option value="Cash">Cash</option>
            <option value="GCash">GCash via PayMongo</option>
            <option value="Other Payment">Other Payment via PayMongo</option>
          </select>

          <label className="block text-sm font-black mb-2">MESSAGE</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full h-32 rounded-md bg-[#dedede] text-black px-3 py-2"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-white text-black py-3 font-black"
          >
            SUBMIT BOOKING →
          </button>
        </form>
      </div>

      {showEmailDialog && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#505050] p-6">
            <h2 className="text-2xl font-black mb-2">Confirm Your Booking</h2>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="w-full h-12 rounded-xl bg-[#e0e0e0] text-black px-4 mb-4"
            />

            <div className="bg-black/30 rounded-2xl p-4 text-sm space-y-1">
              <p>Name: {form.name}</p>
              <p>Package: {form.packageType}</p>
              <p>Payment: {paymentMethod}</p>
              <p>Subtotal: ₱{price}</p>
              <p className="font-black text-lg">Total: ₱{total}</p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowEmailDialog(false)}
                className="w-1/2 rounded-xl bg-gray-700 py-3 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                disabled={sending}
                className="w-1/2 rounded-xl bg-white text-black py-3 font-black"
              >
                {sending ? "SENDING..." : "CONFIRM"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationNumber && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white text-black rounded-3xl p-6 text-center">
            <h2 className="text-2xl font-black mb-2">Booking Submitted!</h2>
            <p>Your confirmation number:</p>

            <div className="bg-black text-white rounded-xl py-4 text-2xl font-black my-5">
              {confirmationNumber}
            </div>

            <button
              onClick={() => setConfirmationNumber("")}
              className="w-full bg-gray-200 py-3 rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}