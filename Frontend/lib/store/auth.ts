"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  userId?: number;
  name?: string;
  email?: string;
  role?: string;
  token?: string;
  image?:string;
  setAuth: (data: Partial<AuthState>) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(persist(
  (set) => ({
    userId: undefined,
    name: undefined,
    email: undefined,
    role: undefined,
    token: undefined,
    image:undefined,
    setAuth: (data) => set((s) => ({ ...s, ...data })),
    logout: () => set({ userId: undefined, name: undefined, email: undefined, role: undefined, token: undefined ,image: undefined}),
  }),
  { name: "auth-store" }
));
