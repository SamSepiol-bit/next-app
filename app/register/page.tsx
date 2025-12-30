"use client";

import React, { useState } from "react";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    name_with_initials: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_id: "",
    whatsapp_number: "",
    password: "",
    password_confirmation: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validatePassword = (password: string) =>
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    const newErrors: Record<string, string> = {};

    if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, number & special character";
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const res = await fetch("https://jobsformycv.enricharcane.info/api/register/candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const contentType = res.headers.get("content-type");
      const data =
        contentType?.includes("application/json")
          ? await res.json()
          : await res.text();

      if (!res.ok) {
        throw new Error(
          typeof data === "string" ? data : data?.message || "Registration failed"
        );
      }

      setSuccess("Registration successful");
      console.log("API response:", data);

    } catch (err: any) {
      console.error("API Error:", err);
      setErrors({ api: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-4 p-6 border rounded-xl shadow"
    >
      <h2 className="text-xl font-semibold text-center">
        Registration Form
      </h2>

      {errors.api && <p className="text-red-600">{errors.api}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <input name="name_with_initials" placeholder="Name with initials"
        value={form.name_with_initials} onChange={handleChange}
        className="w-full border p-2 rounded" />

      <input name="first_name" placeholder="First name"
        value={form.first_name} onChange={handleChange}
        className="w-full border p-2 rounded" />

      <input name="last_name" placeholder="Last name"
        value={form.last_name} onChange={handleChange}
        className="w-full border p-2 rounded" />

      <input type="email" name="email" placeholder="Email"
        value={form.email} onChange={handleChange}
        className="w-full border p-2 rounded" />

      <input name="phone" placeholder="Phone"
        value={form.phone} onChange={handleChange}
        className="w-full border p-2 rounded" />

      <input name="country_id" placeholder="Country ID"
        value={form.country_id} onChange={handleChange}
        className="w-full border p-2 rounded" />

      <input name="whatsapp_number" placeholder="WhatsApp Number"
        value={form.whatsapp_number} onChange={handleChange}
        className="w-full border p-2 rounded" />

      <input type="password" name="password" placeholder="Password"
        value={form.password} onChange={handleChange}
        className="w-full border p-2 rounded" />
      {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

      <input type="password" name="password_confirmation" placeholder="Confirm Password"
        value={form.password_confirmation} onChange={handleChange}
        className="w-full border p-2 rounded" />
      {errors.password_confirmation && (
        <p className="text-red-600 text-sm">{errors.password_confirmation}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-70"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
