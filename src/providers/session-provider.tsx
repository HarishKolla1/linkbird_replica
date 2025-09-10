"use client";

import { useEffect, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { useSessionStore } from "@/store/sessionStore";

type SessionData = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  session: {
    id: string;
    createdAt: string;
    expiresAt: string;
  };
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const setUser = useSessionStore((state) => state.setUser);
  const resetUser = useSessionStore((state) => state.reset);

  useEffect(() => {
    const fetchSession = async () => {
      const data = await authClient.getSession();

      // check if data is not an error and has 'user'
      if (data && "user" in data && data.user) {
        const user = data.user as { name: string; email: string; image?: string | null };
        setUser({
          name: user.name,
          email: user.email,
          avatar: user.image || "",
        });
      } else {
        resetUser();
      }
    };

    fetchSession();
  }, [setUser, resetUser]);

  return <>{children}</>;
}
