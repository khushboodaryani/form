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

// Local uploaded image path (will be transformed to a URL by the environment)
const UPLOADED_IMAGE = "/mnt/data/f083feee-e916-452f-b3e6-0c83bc51ee36.png";

export default function EnquiryForm() {
  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [status, setStatus] = useState<string>("idle");
  const [sending, setSending] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = (data: FormState) => {
    if (!data.name.trim()) return "Please enter your name.";
    if (!data.email.trim()) return "Please enter your email.";
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
        age: form.age ? Number(form.age) : undefined,
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("Submitted successfully.");
        setForm({ ...initialForm });
      } else {
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

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: image / branding */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-tr from-slate-800 to-slate-700">
            <img
              src={UPLOADED_IMAGE}
              alt="form preview"
              className="object-cover w-full h-full opacity-90"
            />
          </div>
        </div>

        {/* Right: form card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Multycomm Enquiry
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Quick enquiry — we will get back within 24 hours
          </p>

          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company (optional)"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  placeholder="Age"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                type="tel"
                placeholder="Phone (optional)"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Query
              </label>
              <textarea
                name="query"
                value={form.query}
                onChange={handleChange}
                placeholder="Write your query or message here"
                className="w-full rounded-md border border-gray-200 px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disposition
              </label>
              <select
                name="disposition"
                value={form.disposition}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option>Customer Support</option>
                <option>Consultant Support</option>
                <option>B2B Lead</option>
                <option>New Lead</option>
                <option>General Enquiry</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={sending}
                className={`w-full rounded-md py-3 font-medium text-white transition-shadow ${
                  sending
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:shadow-lg"
                }`}
                aria-busy={sending}
              >
                {sending ? "Sending..." : "Submit Enquiry"}
              </button>
            </div>
          </form>

          <div
            className="mt-4 text-center text-sm text-gray-600 font-medium"
            role="status"
            aria-live="polite"
          >
            Status: <span className="text-gray-800">{status || "idle"}</span>
          </div>

          <div className="mt-4 text-xs text-gray-400 text-center">
            We respect your privacy — your data will only be used to contact you
            regarding this enquiry.
          </div>
        </div>
      </div>
    </div>
  );
}
