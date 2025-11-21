
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        body: JSON.stringify({
          ...form,
          age: Number(form.age || 0), // ensure age sent as number if backend expects number
        }),
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
        setStatus(
          `Error submitting: ${data?.message ?? "Server responded with an error"}`
        );
      }
    } catch (err: any) {
      setStatus(`Error submitting: ${err?.message ?? "Network error"}`);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h1>Multycomm Enquiry Form</h1>

      <form onSubmit={submitForm}>
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Company</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Age</label>
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          type="number"
          required
        />

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
        />

        <label>Contact number</label>
        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          type="tel"
          required
        />

        <label>Query</label>
        <textarea
          name="query"
          value={form.query}
          onChange={handleChange}
        ></textarea>

        <label>Disposition</label>
        <select
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
          <button type="submit">Submit</button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>Status: {status || "idle"}</div>
    </div>
  );
}
