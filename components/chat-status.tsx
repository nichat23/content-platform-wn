"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

interface ChatStatusProps {
  isConnected: boolean
}

export function ChatStatus({ isConnected }: ChatStatusProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
        {isConnected ? (
          <>
            <CheckCircle className="h-3 w-3" />
            Gemini AI Conectado
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3" />
            Verificando conexión...
          </>
        )}
      </Badge>
    </div>
  )
}
