"use client";

import React, { useState } from "react";

type FormState = {
  name: string;
  company: string;
  gender: string;
  age: string;
  email: string;
  contact: string;
  query: string;
  disposition: string;
};

const initialForm: FormState = {
  name: "",
  company: "",
  gender: "Male",
  age: "",
  email: "",
  contact: "",
  query: "",
  disposition: "Customer Support",
};

export default function Home() {
  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [status, setStatus] = useState<string>("idle");
  const [sending, setSending] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // trim leading/trailing whitespace on text inputs
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (data: FormState) => {
    if (!data.name.trim()) return "Please enter your name.";
    if (!data.email.trim()) return "Please enter your email.";
    // basic email regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(data.email.trim())) return "Please enter a valid email.";
    if (data.age && Number(data.age) < 0) return "Please enter a valid age.";
    return null;
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setStatus("Validating...");
    const err = validate(form);
    if (err) {
      setStatus(err);
      return;
    }

    setSending(true);
    setStatus("Sending...");

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        contact: form.contact.trim(),
        query: form.query.trim(),
        age: Number(form.age || 0),
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("Submitted successfully.");
        setForm({ ...initialForm });
      } else {
        // try to parse json and surface message if present
        const data = await res.json().catch(() => ({}));
        setStatus(
          `Error submitting: ${data?.message ?? "Server returned an error"}`
        );
      }
    } catch (err: any) {
      setStatus(`Network error: ${err?.message ?? "Unknown error"}`);
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 15,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    marginBottom: 5,
    display: "block",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#0070f3",
    color: "white",
    padding: "12px 18px",
    border: "none",
    borderRadius: 6,
    cursor: sending ? "not-allowed" : "pointer",
    fontSize: 16,
    width: "100%",
    opacity: sending ? 0.7 : 1,
  };

  return (
    <div
      style={{
        maxWidth: 550,
        margin: "40px auto",
        padding: 25,
        borderRadius: 10,
        background: "#fafafa",
        border: "1px solid #e5e5e5",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        Multycomm Enquiry Form
      </h1>

      <form onSubmit={submitForm}>
        <label style={labelStyle}>Name</label>
        <input
          style={inputStyle}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Full name"
        />

        <label style={labelStyle}>Company</label>
        <input
          style={inputStyle}
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company (optional)"
        />

        <label style={labelStyle}>Gender</label>
        <select
          style={inputStyle}
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label style={labelStyle}>Age</label>
        <input
          style={inputStyle}
          name="age"
          value={form.age}
          onChange={handleChange}
          type="number"
          min={0}
          placeholder="Age (optional)"
        />

        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          placeholder="you@example.com"
        />

        <label style={labelStyle}>Contact Number</label>
        <input
          style={inputStyle}
          name="contact"
          value={form.contact}
          onChange={handleChange}
          type="tel"
          placeholder="Phone (optional)"
        />

        <label style={labelStyle}>Query</label>
        <textarea
          style={{ ...inputStyle, height: 80 }}
          name="query"
          value={form.query}
          onChange={handleChange}
          placeholder="Write your query or message here"
        />

        <label style={labelStyle}>Disposition</label>
        <select
          style={inputStyle}
          name="disposition"
          value={form.disposition}
          onChange={handleChange}
        >
          <option value="Customer Support">Customer Support</option>
          <option value="Consultant Support">Consultant Support</option>
          <option value="B2B Lead">B2B Lead</option>
          <option value="New Lead">New Lead</option>
          <option value="General Enquiry">General Enquiry</option>
        </select>

        <div style={{ marginTop: 12 }}>
          <button style={buttonStyle} type="submit" disabled={sending}>
            {sending ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: 15,
          textAlign: "center",
          fontWeight: 600,
          color: "#333",
        }}
        role="status"
        aria-live="polite"
      >
        Status: {status || "idle"}
      </div>
    </div>
  );
}
