"use client"

import { useEffect, ReactNode } from "react"
import { authClient } from "@/lib/auth-client"
import { useSessionStore } from "@/store/sessionStore"

export function SessionProvider({ children }: { children: ReactNode }) {
  const setUser = useSessionStore((state) => state.setUser)
  const resetUser = useSessionStore((state) => state.reset)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await authClient.getSession()

        // ✅ BetterAuth wraps response in .data
        if ("data" in res && res.data && res.data.user) {
          const { user } = res.data
          setUser({
            name: user.name,
            email: user.email,
            avatar: user.image || "",
          })
        } else {
          resetUser()
        }
      } catch (err) {
        resetUser()
      }
    }

    fetchSession()
  }, [setUser, resetUser])

  return <>{children}</>
}