"use client";

import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type FormState = {
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
};

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

type BookingLog = FormState & {
  email: string;
  emailProvider: EmailProvider | "";
  confirmationNumber: string;
  id: string;
  timestamp: string;
  status: BookingStatus;
};

export default function BookingForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    date: "",
    packageType: "",
    message: "",
  });

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

  const generateConfirmationNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `BK-${year}-${random}`;
  };

  const detectProvider = (email: string): EmailProvider | "" => {
    const domain = email.split("@")[1]?.toLowerCase() || "";

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(cleanEmail)) {
      return {
        valid: false,
        error: "Please enter a valid email address.",
        suggestion: "",
        provider: "" as EmailProvider | "",
      };
    }

    const domain = cleanEmail.split("@")[1] || "";
    const correctedDomain = typoMap[domain];

    if (correctedDomain) {
      const suggestedEmail = cleanEmail.replace(domain, correctedDomain);

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openEmailDialog = (e: FormEvent) => {
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

    const newBooking: BookingLog = {
      ...form,
      email: cleanEmail,
      emailProvider: result.provider,
      confirmationNumber: generatedConfirmation,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const existing: BookingLog[] = JSON.parse(
      localStorage.getItem("adminBookingLogs") || "[]"
    );

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
    } catch (error) {
      console.log("Email API is not connected yet.", error);
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
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-5 pb-12 pt-28 font-sans text-white sm:px-8 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_30%)]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col justify-center text-center lg:text-left">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-white/70">
            Book Now
          </p>

          <h1 className="mx-auto max-w-3xl text-[42px] font-black leading-[0.95] tracking-[-0.05em] text-[#d7d7d7] drop-shadow-2xl sm:text-[64px] lg:mx-0 lg:text-[88px]">
            Make your
            <br />
            memories
            <br />
            documented
            <br />
            with us.
          </h1>

          <div className="mx-auto mb-6 mt-8 h-px w-full max-w-xl bg-gradient-to-r from-transparent via-white/60 to-transparent lg:mx-0 lg:bg-gradient-to-r lg:from-white/60 lg:to-transparent" />

          <p className="mx-auto max-w-md text-base leading-7 text-white/55 lg:mx-0">
            After booking, you will receive a confirmation number for tracking.
          </p>

          <div className="mx-auto mt-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.08] p-5 text-left shadow-[0_25px_80px_rgba(255,255,255,0.1)] backdrop-blur-2xl lg:mx-0 lg:max-w-none sm:p-6">
            <h3 className="mb-4 text-xl font-black sm:text-2xl">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              <div className="rounded-3xl bg-white/[0.06] p-4 transition hover:bg-white/[0.1]">
                <h4 className="font-black">How do I track my booking?</h4>
                <p className="mt-1 text-sm leading-6 text-white/60">
                  Use your confirmation number after submitting your booking.
                </p>
                <a href="/api" className="mt-2 inline-block text-sm font-bold underline">
                  Track booking
                </a>
              </div>

              <div className="rounded-3xl bg-white/[0.06] p-4 transition hover:bg-white/[0.1]">
                <h4 className="font-black">What packages are available?</h4>
                <p className="mt-1 text-sm leading-6 text-white/60">
                  Basic, Elite, and Premium packages are available.
                </p>
                <a
                  href="/services"
                  className="mt-2 inline-block text-sm font-bold underline"
                >
                  View services
                </a>
              </div>

              <div className="rounded-3xl bg-white/[0.06] p-4 transition hover:bg-white/[0.1]">
                <h4 className="font-black">Can I contact you directly?</h4>
                <p className="mt-1 text-sm leading-6 text-white/60">
                  Yes, you can message us for custom bookings or questions.
                </p>
                <a
                  href="/contact"
                  className="mt-2 inline-block text-sm font-bold underline"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 lg:max-w-none">
          <form
            onSubmit={openEmailDialog}
            className="w-full rounded-[32px] border border-white/10 bg-white/[0.08] p-6 shadow-[0_30px_120px_rgba(255,255,255,0.12)] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.1] sm:p-9"
          >
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/80">
              Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="mb-4 h-12 w-full rounded-2xl border border-white/10 bg-white/90 px-4 text-sm text-black outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-white focus:bg-white focus:ring-4 focus:ring-white/20"
            />

            <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/80">
              Phone Number
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="09XXXXXXXXX"
              className="mb-4 h-12 w-full rounded-2xl border border-white/10 bg-white/90 px-4 text-sm text-black outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-white focus:bg-white focus:ring-4 focus:ring-white/20"
            />

            <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/80">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="mb-4 h-12 w-full rounded-2xl border border-white/10 bg-white/90 px-4 text-sm text-black outline-none transition-all duration-300 focus:border-white focus:bg-white focus:ring-4 focus:ring-white/20"
            />

            <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/80">
              Package
            </label>

            <select
              name="packageType"
              value={form.packageType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setForm({
                  ...form,
                  packageType: e.target.value,
                })
              }
              required
              className="mb-4 h-12 w-full rounded-2xl border border-white/10 bg-white/90 px-4 text-sm text-black outline-none transition-all duration-300 focus:border-white focus:bg-white focus:ring-4 focus:ring-white/20"
            >
              <option value="">Select Package</option>
              <option value="BASIC PACKAGE - ₱10">BASIC PACKAGE - ₱10</option>
              <option value="ELITE PACKAGE - ₱20">ELITE PACKAGE - ₱20</option>
              <option value="PREMIUM PACKAGE - ₱30">
                PREMIUM PACKAGE - ₱30
              </option>
            </select>

            <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-white/80">
              Message
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Tell us more about your booking..."
              className="h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/90 px-4 py-3 text-sm text-black outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-white focus:bg-white focus:ring-4 focus:ring-white/20"
            />

            <button
              type="submit"
              className="group relative mt-7 w-full overflow-hidden rounded-2xl bg-white py-4 font-black uppercase tracking-[0.18em] text-black shadow-[0_16px_45px_rgba(255,255,255,0.18)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_24px_70px_rgba(255,255,255,0.25)] active:translate-y-0 active:scale-[0.96]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="absolute inset-0 scale-0 rounded-2xl bg-black/10 opacity-0 transition-all duration-300 group-active:scale-100 group-active:opacity-100" />

              <span className="relative flex items-center justify-center gap-3">
                Submit Booking
                <span className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-2">
                  →
                </span>
              </span>
            </button>
          </form>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.08] p-4 shadow-[0_25px_80px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
            <h3 className="mb-4 text-xl font-black sm:text-2xl">Find Us</h3>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title="Studio Location Map"
                src="https://www.google.com/maps?q=Quezon%20City%20Philippines&output=embed"
                className="h-[260px] w-full border-0 sm:h-[320px]"
                loading="lazy"
                allowFullScreen
              />
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Quezon+City+Philippines"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-2xl bg-white py-3 text-center font-black text-black transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      {showEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#141414]/95 p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <h2 className="mb-2 text-2xl font-black">Confirm Your Booking</h2>

            <p className="mb-5 text-sm leading-6 text-white/60">
              Please enter your email address. Your booking details and
              confirmation number will be sent to this email.
            </p>

            <input
              type="email"
              value={dialogEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="example@gmail.com"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/90 px-4 text-sm text-black outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-white focus:bg-white focus:ring-4 focus:ring-white/20"
            />

            {emailProvider && !emailError && (
              <p className="mt-2 text-sm font-semibold text-green-300">
                Detected provider: {emailProvider}
              </p>
            )}

            {emailError && (
              <p className="mt-2 text-sm font-semibold text-red-300">
                {emailError}
              </p>
            )}

            {emailSuggestion && (
              <button
                type="button"
                onClick={applySuggestion}
                className="mt-2 text-sm font-bold text-yellow-300 underline transition hover:text-yellow-200 active:scale-95"
              >
                Did you mean {emailSuggestion}?
              </button>
            )}

            <div className="mt-5 space-y-2 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm">
              <p>
                <span className="text-white/50">Name:</span> {form.name}
              </p>
              <p>
                <span className="text-white/50">Phone:</span> {form.phone}
              </p>
              <p>
                <span className="text-white/50">Date:</span> {form.date}
              </p>
              <p>
                <span className="text-white/50">Package:</span>{" "}
                {form.packageType}
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowEmailDialog(false)}
                className="w-1/2 rounded-2xl bg-white/10 py-3 font-bold text-white transition-all duration-300 hover:bg-white/20 active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmBooking}
                disabled={sending}
                className="group relative w-1/2 overflow-hidden rounded-2xl bg-white py-3 font-black text-black transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">
                  {sending ? "SENDING..." : "CONFIRM"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 text-center text-black shadow-[0_30px_100px_rgba(255,255,255,0.16)]">
            <h2 className="mb-2 text-2xl font-black">Booking Submitted!</h2>

            <p className="mb-4 text-sm leading-6 text-gray-600">
              Save this confirmation number to track your booking:
            </p>

            <div className="mb-5 rounded-2xl bg-black py-4 text-xl font-black tracking-widest text-white sm:text-2xl">
              {confirmationNumber}
            </div>

            <a
              href="/api"
              className="mb-3 block w-full rounded-2xl bg-black py-3 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
            >
              Track Booking
            </a>

            <button
              onClick={() => setConfirmationNumber("")}
              className="w-full rounded-2xl bg-gray-200 py-3 font-bold transition-all duration-300 hover:bg-gray-300 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
