"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

export default function SessionTestPage() {
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const res = await authClient.getSession()
      setSessionData(res)
    }
    fetchSession()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🔎 Session Test</h1>
      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto">
        {JSON.stringify(sessionData, null, 2)}
      </pre>
    </div>
  )
}