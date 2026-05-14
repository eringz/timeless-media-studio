"use client";

import { useState } from "react";

type PackageType = "Basic Package" | "Elite Package" | "Premium Package";

type PaymentMethod = "Cash" | "GCash" | "Other Payment";

type BookingStatus =
  | "pending"
  | "approved"
  | "in_process"
  | "for_pick_up"
  | "completed";

type EmailProvider =
  | "Gmail"
  | "Yahoo"
  | "Outlook"
  | "Hotmail"
  | "iCloud"
  | "ProtonMail"
  | "AOL"
  | "Other Email Provider";

type FormState = {
  name: string;
  phone: string;
  date: string;
  packageType: PackageType | "";
  message: string;
};

const packagePrices: Record<PackageType, number> = {
  "Basic Package": 10,
  "Elite Package": 20,
  "Premium Package": 30,
};

export default function BookingForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    date: "",
    packageType: "",
    message: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [dialogEmail, setDialogEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailProvider, setEmailProvider] = useState<EmailProvider | "">("");
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");

  const typoMap: Record<string, string> = {
    "gmai.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gmal.com": "gmail.com",
    "gmail.con": "gmail.com",
    "gmail.co": "gmail.com",
    "gnail.com": "gmail.com",
    "gmaill.com": "gmail.com",
    "gmail.cm": "gmail.com",

    "yaho.com": "yahoo.com",
    "yahho.com": "yahoo.com",
    "yahoo.con": "yahoo.com",
    "yahoo.co": "yahoo.com",
    "yaoo.com": "yahoo.com",

    "outlok.com": "outlook.com",
    "outloo.com": "outlook.com",
    "outlook.con": "outlook.com",
    "outlook.co": "outlook.com",

    "hotmial.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "hotmail.con": "hotmail.com",
    "hotmail.co": "hotmail.com",

    "icloud.con": "icloud.com",
    "iclod.com": "icloud.com",
    "icoud.com": "icloud.com",

    "protonmail.con": "protonmail.com",
    "aol.con": "aol.com",
  };

  const packagePrice = form.packageType ? packagePrices[form.packageType] : 0;
  const subtotal = packagePrice;
  const total = subtotal;

  const generateConfirmationNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `BK-${year}-${random}`;
  };

  const detectProvider = (email: string): EmailProvider | "" => {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return "";

    if (domain === "gmail.com") return "Gmail";
    if (domain === "yahoo.com") return "Yahoo";
    if (domain === "outlook.com") return "Outlook";
    if (domain === "hotmail.com") return "Hotmail";
    if (domain === "icloud.com") return "iCloud";
    if (domain === "protonmail.com") return "ProtonMail";
    if (domain === "aol.com") return "AOL";

    return "Other Email Provider";
  };

  const validateEmail = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return {
        valid: false,
        error: "Email is required.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    if (cleanEmail.includes(" ")) {
      return {
        valid: false,
        error: "Email must not contain spaces.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    if (cleanEmail.includes("..")) {
      return {
        valid: false,
        error: "Email cannot contain double dots.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    const parts = cleanEmail.split("@");

    if (parts.length !== 2) {
      return {
        valid: false,
        error: "Email must contain only one @ symbol.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    const [username, domain] = parts;

    if (!username || username.length < 3) {
      return {
        valid: false,
        error: "Email username is too short.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    if (username.startsWith(".") || username.endsWith(".")) {
      return {
        valid: false,
        error: "Email username cannot start or end with a dot.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    if (!/^[a-z0-9._%+-]+$/.test(username)) {
      return {
        valid: false,
        error: "Email username contains invalid characters.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(cleanEmail)) {
      return {
        valid: false,
        error: "Please enter a valid email address.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    const correctedDomain = typoMap[domain];

    if (correctedDomain) {
      const suggestedEmail = `${username}@${correctedDomain}`;

      return {
        valid: false,
        error: "Possible email typo detected.",
        suggestion: suggestedEmail,
        provider: detectProvider(suggestedEmail),
      };
    }

    return {
      valid: true,
      error: "",
      suggestion: "",
      provider: detectProvider(cleanEmail),
    };
  };

  const handleEmailChange = (value: string) => {
    setDialogEmail(value);

    const result = validateEmail(value);

    setEmailError(result.error);
    setEmailSuggestion(result.suggestion);
    setEmailProvider(result.provider);
  };

  const applySuggestion = () => {
    setDialogEmail(emailSuggestion);

    const result = validateEmail(emailSuggestion);

    setEmailError(result.error);
    setEmailSuggestion(result.suggestion);
    setEmailProvider(result.provider);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openEmailDialog = (e: React.FormEvent) => {
    e.preventDefault();

    setDialogEmail("");
    setEmailError("Email is required.");
    setEmailSuggestion("");
    setEmailProvider("");
    setShowEmailDialog(true);
  };

  const confirmBooking = async () => {
    const cleanEmail = dialogEmail.trim().toLowerCase();
    const result = validateEmail(cleanEmail);

    setEmailError(result.error);
    setEmailSuggestion(result.suggestion);
    setEmailProvider(result.provider);

    if (!result.valid) return;

    setSending(true);

    const generatedConfirmation = generateConfirmationNumber();

    const receipt = {
      packageName: form.packageType,
      packagePrice,
      subtotal,
      total,
      currency: "PHP",
      paymentMethod,
      paidStatus: paymentMethod === "Cash" ? "cash_on_site" : "pending_payment",
    };

    const newBooking = {
      ...form,
      email: cleanEmail,
      emailProvider: result.provider,
      paymentMethod,
      receipt,
      confirmationNumber: generatedConfirmation,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: "pending" as BookingStatus,
    };

    const existing = JSON.parse(localStorage.getItem("adminBookingLogs") || "[]");

    localStorage.setItem(
      "adminBookingLogs",
      JSON.stringify([newBooking, ...existing])
    );

    try {
      await fetch("/api/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });
    } catch {
      console.log("Email API is not connected yet.");
    }

    if (paymentMethod === "GCash" || paymentMethod === "Other Payment") {
      try {
        const response = await fetch("/api/create-paymongo-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBooking),
        });

        const data = await response.json();

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
      } catch {
        console.log("PayMongo API is not connected yet.");
      }
    }

    setSending(false);
    setShowEmailDialog(false);
    setConfirmationNumber(generatedConfirmation);

    setForm({
      name: "",
      phone: "",
      date: "",
      packageType: "",
      message: "",
    });

    setDialogEmail("");
    setEmailError("");
    setEmailSuggestion("");
    setEmailProvider("");
    setPaymentMethod("Cash");
  };

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="px-2 lg:px-10">
          <p className="text-2xl font-black mb-3 tracking-wide">BOOK NOW!</p>

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

          <p className="text-gray-400 max-w-md">
            After booking, you will receive a confirmation number and receipt.
          </p>
        </div>

        <form
          onSubmit={openEmailDialog}
          className="w-full max-w-md mx-auto bg-[#4f4f4f]/95 rounded-[30px] p-8 lg:p-9 shadow-[0_25px_100px_rgba(255,255,255,0.12)] border border-white/10 backdrop-blur"
        >
          <label className="block text-sm font-black mb-2">NAME</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="w-full h-11 rounded-md bg-[#dedede] text-black placeholder:text-gray-600 px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
          />

          <label className="block text-sm font-black mb-2">PHONE NUMBER</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="09XXXXXXXXX"
            className="w-full h-11 rounded-md bg-[#dedede] text-black placeholder:text-gray-600 px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
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
          <select
            name="packageType"
            value={form.packageType}
            onChange={handleChange}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">Select package</option>
            <option value="Basic Package">Basic Package - ₱10</option>
            <option value="Elite Package">Elite Package - ₱20</option>
            <option value="Premium Package">Premium Package - ₱30</option>
          </select>

          {form.packageType && (
            <div className="rounded-2xl bg-black/30 p-4 mb-3 text-sm border border-white/10">
              <p className="font-black mb-2">QUOTE BREAKDOWN</p>
              <p>
                <span className="text-gray-300">Package:</span>{" "}
                {form.packageType}
              </p>
              <p>
                <span className="text-gray-300">Price:</span> ₱{packagePrice}
              </p>
              <p>
                <span className="text-gray-300">Subtotal:</span> ₱{subtotal}
              </p>
              <p className="font-black text-lg mt-2">Total: ₱{total}</p>
            </div>
          )}

          <label className="block text-sm font-black mb-2">PAYMENT METHOD</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            required
            className="w-full h-11 rounded-md bg-[#dedede] text-black px-3 mb-3 outline-none focus:ring-2 focus:ring-white"
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
            placeholder="Tell us more about your booking..."
            className="w-full h-32 rounded-md bg-[#dedede] text-black placeholder:text-gray-600 px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="group relative mt-6 w-full overflow-hidden rounded-xl bg-white text-black py-3 font-black tracking-wide transition duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_10px_30px_rgba(255,255,255,0.18)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-2">
              SUBMIT BOOKING
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </form>
      </div>

      {showEmailDialog && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#505050] border border-white/10 p-6 text-white shadow-2xl">
            <h2 className="text-2xl font-black mb-2">
              Confirm Your Booking
            </h2>

            <p className="text-sm text-gray-200 mb-5">
              Please enter your email address. Your booking receipt and
              confirmation number will be sent to this email.
            </p>

            <input
              type="email"
              value={dialogEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full h-12 rounded-xl bg-[#e0e0e0] text-black placeholder:text-gray-600 px-4 outline-none focus:ring-2 focus:ring-white"
            />

            {emailProvider && !emailError && (
              <p className="mt-2 text-sm text-green-300">
                Detected provider: {emailProvider}
              </p>
            )}

            {emailError && (
              <p className="mt-2 text-sm text-red-300">{emailError}</p>
            )}

            {emailSuggestion && (
              <button
                type="button"
                onClick={applySuggestion}
                className="mt-2 text-sm text-yellow-300 underline"
              >
                Did you mean {emailSuggestion}?
              </button>
            )}

            <div className="mt-5 rounded-2xl bg-black/25 p-4 text-sm space-y-1">
              <p>
                <span className="text-gray-300">Name:</span> {form.name}
              </p>
              <p>
                <span className="text-gray-300">Phone:</span> {form.phone}
              </p>
              <p>
                <span className="text-gray-300">Date:</span> {form.date}
              </p>
              <p>
                <span className="text-gray-300">Package:</span>{" "}
                {form.packageType}
              </p>
              <p>
                <span className="text-gray-300">Payment:</span>{" "}
                {paymentMethod}
              </p>
              <p>
                <span className="text-gray-300">Subtotal:</span> ₱{subtotal}
              </p>
              <p className="font-black text-lg">Total: ₱{total}</p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowEmailDialog(false)}
                className="w-1/2 rounded-xl bg-gray-700 py-3 font-bold hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmBooking}
                disabled={sending}
                className="w-1/2 rounded-xl bg-white text-black py-3 font-black hover:scale-[1.03] active:scale-[0.97] transition disabled:opacity-60"
              >
                {sending ? "SENDING..." : "CONFIRM"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationNumber && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white text-black rounded-3xl p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-black mb-2">Booking Submitted!</h2>

            <p className="text-gray-600 mb-4">
              Save this confirmation number to track your booking:
            </p>

            <div className="bg-black text-white rounded-xl py-4 text-2xl font-black tracking-widest mb-5">
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