"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      await api.register({ name, email, passwords });
      setSuccess("Registration successful. Please login.");
      setTimeout(() => router.push("/login"), 800);
    } catch (e: any) {
      setError(e.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 bg-slate-50">
      <div className="w-full max-w-md mx-auto rounded-2xl border p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
        <form className="space-y-4" onSubmit={submit}>
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={passwords} onChange={(e) => setPasswords(e.target.value)} required />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
  </div>
  );
}
