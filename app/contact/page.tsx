const [submitError, setSubmitError] = useState("");

const confirmBooking = async () => {
  const cleanEmail = dialogEmail.trim().toLowerCase();
  const result = validateEmail(cleanEmail);

  setEmailError(result.error);
  setEmailSuggestion(result.suggestion);
  setEmailProvider(result.provider);
  setSubmitError("");

  if (!result.valid) return;

  try {
    setSending(true);

    const generatedConfirmation = generateConfirmationNumber();

    const receipt = {
      packageName: form.packageType,
      packagePrice,
      subtotal,
      total,
      currency: "PHP",
      paymentMethod,
      paidStatus:
        paymentMethod === "Cash" ? "cash_on_site" : "pending_payment",
    };

    const newBooking = {
      ...form,
      email: cleanEmail,
      emailProvider: result.provider,
      paymentMethod,
      receipt,
      confirmationNumber: generatedConfirmation,
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      status: "pending" as BookingStatus,
    };

    const existing = JSON.parse(
      localStorage.getItem("adminBookingLogs") || "[]"
    );

    localStorage.setItem(
      "adminBookingLogs",
      JSON.stringify([newBooking, ...existing])
    );

    const emailResponse = await fetch("/api/send-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send confirmation email.");
    }

    if (paymentMethod === "GCash" || paymentMethod === "Other Payment") {
      const paymentResponse = await fetch("/api/create-paymongo-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      const data = await paymentResponse.json();

      if (!paymentResponse.ok || !data.checkoutUrl) {
        throw new Error("Failed to create PayMongo checkout.");
      }

      window.location.href = data.checkoutUrl;
      return;
    }

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
  } catch (error) {
    setSubmitError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setSending(false);
  }
};