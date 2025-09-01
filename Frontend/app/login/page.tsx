"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/store/auth";
import { setAuthCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";

function decodeJwt(token?: string): any | undefined {
  try {
    if (!token) return undefined;
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch { return undefined; }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success,setSuccess] = useState<string| null>(null)
  const router = useRouter();
  const setAuth = useAuth((s) => s.setAuth);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const data = await api.login({ email, passwords });
      const user = data?.user || {};
      const token = data?.token as string | undefined;
      const decoded = decodeJwt(token);
      const userId = decoded?.id ? Number(decoded.id) : undefined;

      setAuth({ 
        userId, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        token 
      });

  setAuthCookie({ userId, token });
   setSuccess("Login successful");
  // perform a full navigation so the cookie is sent to the server and middleware can validate
  window.location.assign("/profile");
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 bg-slate-50">
      <div className="w-full max-w-md mx-auto rounded-2xl border p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form className="space-y-4" onSubmit={submit}>
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
          <Button type="submit" className="w-full">Login</Button>
      </form>
        <p className="mt-3 text-sm">New here? <a href="/register" className="inline-block"><Button variant="ghost">Create account</Button></a></p>
      </div>
  </div>
  );
}
