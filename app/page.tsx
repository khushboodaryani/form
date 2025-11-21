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

export default function Home() {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    gender: "Male",
    age: "",
    email: "",
    contact: "",
    query: "",
    disposition: "Customer Support",
  });

  const [status, setStatus] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, age: Number(form.age || 0) }),
      });

      if (res.ok) {
        setStatus("Submitted Successfully");
        setForm({
          name: "",
          company: "",
          gender: "Male",
          age: "",
          email: "",
          contact: "",
          query: "",
          disposition: "Customer Support",
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(`Error submitting: ${data?.message ?? "Server error"}`);
      }
    } catch (err: any) {
      setStatus(`Error submitting: ${err?.message ?? "Network error"}`);
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
    cursor: "pointer",
    fontSize: 16,
    width: "100%",
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
        />

        <label style={labelStyle}>Company</label>
        <input
          style={inputStyle}
          name="company"
          value={form.company}
          onChange={handleChange}
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
        />

        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
        />

        <label style={labelStyle}>Contact Number</label>
        <input
          style={inputStyle}
          name="contact"
          value={form.contact}
          onChange={handleChange}
          type="tel"
        />

        <label style={labelStyle}>Query</label>
        <textarea
          style={{ ...inputStyle, height: 80 }}
          name="query"
          value={form.query}
          onChange={handleChange}
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
          <button style={buttonStyle} type="submit">
            Submit
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
      >
        Status: {status || "idle"}
      </div>
    </div>
  );
}
