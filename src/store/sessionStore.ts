import { create } from "zustand"

type User = {
  name: string
  email: string
  avatar?: string
} | null

type SessionStore = {
  user: User
  setUser: (user: User) => void
  reset: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  reset: () => set({ user: null }),
}))