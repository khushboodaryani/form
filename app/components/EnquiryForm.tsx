// app/components/EnquiryForm.tsx
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

export default function EnquiryForm() {
  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [status, setStatus] = useState<string>("");
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
    if (data.age && (Number(data.age) < 0 || isNaN(Number(data.age))))
      return "Please enter a valid age.";
    return null;
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

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
        age: form.age || undefined,
      };

      console.log("Frontend: Sending payload:", payload);

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Frontend: Response status:", res.status);

      // Get the response text first to handle both JSON and non-JSON
      const responseText = await res.text();
      console.log("Frontend: Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Frontend: Failed to parse JSON:", parseError);
        throw new Error(
          `Server returned invalid JSON: ${responseText.substring(0, 100)}`
        );
      }

      console.log("Frontend: Parsed data:", data);

      if (res.ok && data.ok) {
        setStatus(
          "✅ Submitted successfully! We'll get back to you within 24 hours."
        );
        setForm({ ...initialForm });
      } else {
        setStatus(`❌ Error: ${data?.message || "Something went wrong"}`);
      }
    } catch (err: any) {
      console.error("Frontend: Submission error:", err);
      setStatus(
        `❌ Error: ${err.message || "Network error. Please try again."}`
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: image / branding */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h3 className="text-2xl font-bold mb-4">MultyComm</h3>
              <p className="text-lg opacity-90">
                Get in touch with our expert team
              </p>
              <p className="text-sm opacity-75 mt-2">
                We're here to help you with your business needs
              </p>
            </div>
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                required
                disabled={sending}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                disabled={sending}
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  disabled={sending}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
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
                  min="0"
                  max="120"
                  placeholder="Age"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  disabled={sending}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                required
                disabled={sending}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                disabled={sending}
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
                placeholder="Write your query or message here..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disposition *
              </label>
              <select
                name="disposition"
                value={form.disposition}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                required
                disabled={sending}
              >
                <option value="Customer Support">Customer Support</option>
                <option value="Consultant Support">Consultant Support</option>
                <option value="B2B Lead">B2B Lead</option>
                <option value="New Lead">New Lead</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={sending}
                className={`w-full rounded-md py-3 font-medium text-white transition-all ${
                  sending
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:scale-[1.02]"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                aria-busy={sending}
              >
                {sending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Submit Enquiry"
                )}
              </button>
            </div>
          </form>

          {status && (
            <div
              className={`mt-4 p-4 rounded-md text-center text-sm font-medium border ${
                status.includes("❌") || status.includes("Error")
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center justify-center">
                {status.includes("✅") || status.includes("successfully") ? (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : status.includes("❌") ? (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
                {status}
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-400 text-center">
            <p>
              We respect your privacy — your data will only be used to contact
              you regarding this enquiry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
