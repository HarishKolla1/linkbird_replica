// store/sessionStore.ts
import { create } from "zustand";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface SessionState {
  user: User | null;
  setUser: (user: User) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  reset: () => set({ user: null }),
}));
