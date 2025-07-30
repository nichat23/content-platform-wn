"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, RefreshCw, Clock } from "lucide-react"

export function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error" | "overloaded">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const checkConnection = async () => {
    setStatus("checking")
    setErrorDetails(null)

    try {
      const response = await fetch("/api/test-connection")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
        setErrorDetails(null)
        setRetryCount(0)
      } else {
        if (data.details?.includes("overloaded") || data.details?.includes("busy")) {
          setStatus("overloaded")
          setErrorDetails("Servicio temporalmente sobrecargado")
        } else {
          setStatus("error")
          setErrorDetails(data.details || "Error desconocido")
        }
        setRetryCount((prev) => prev + 1)
      }
      setLastCheck(new Date())
    } catch (error) {
      setStatus("error")
      setErrorDetails("Error de red o servidor")
      setRetryCount((prev) => prev + 1)
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "default"
      case "overloaded":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "checking":
        return "Verificando conexión..."
      case "connected":
        return "Gemini AI Conectado"
      case "overloaded":
        return "Servicio Sobrecargado"
      case "error":
        return "Error de conexión"
      default:
        return "Estado desconocido"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case "connected":
        return <CheckCircle className="h-3 w-3" />
      case "overloaded":
        return <Clock className="h-3 w-3" />
      case "error":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>

        {lastCheck && (
          <span className="text-xs text-gray-500">
            Última verificación: {lastCheck.toLocaleTimeString()}
            {retryCount > 0 && ` (${retryCount} reintentos)`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {errorDetails && status !== "connected" && (
          <span className="text-xs text-gray-600 max-w-xs truncate" title={errorDetails}>
            {errorDetails}
          </span>
        )}

        <Button variant="ghost" size="sm" onClick={checkConnection} disabled={status === "checking"}>
          <RefreshCw className={`h-3 w-3 ${status === "checking" ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  )
}
