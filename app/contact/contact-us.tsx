import { useState } from "react";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("");
  const [message, setMessage] = useState("");

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Contact Us</h1>
      <form style={{ display: "grid", gap: "1rem", maxWidth: "480px" }}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Phone number
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Package
          <select
            value={packageType}
            onChange={(e) => setPackageType(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Select a package</option>
            <option value="basic">Basic</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </label>

        <label>
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message"
            rows={5}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <button type="button" style={{ padding: "0.75rem 1rem" }}>
          Submit
        </button>
      </form>
    </main>
  );
}
