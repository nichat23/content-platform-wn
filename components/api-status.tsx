"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

type ConnectionStatus = "checking" | "connected" | "error" | "overloaded" | "quota_exceeded" | "auth_error"

export function ApiStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("checking")
  const [lastCheck, setLastCheck] = useState<string>("")
  const [details, setDetails] = useState<string>("")

  const checkConnection = async () => {
    setStatus("checking")
    try {
      const response = await fetch("/api/test-connection")
      const data = await response.json()

      if (response.ok && data.status === "connected") {
        setStatus("connected")
        setDetails("Conexión exitosa con Gemini AI")
      } else {
        setStatus(data.status || "error")
        setDetails(data.message || data.details || "Error desconocido")
      }

      setLastCheck(new Date().toLocaleTimeString("es-CO"))
    } catch (error) {
      setStatus("error")
      setDetails("Error de red al conectar con la API")
      setLastCheck(new Date().toLocaleTimeString("es-CO"))
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusInfo = () => {
    switch (status) {
      case "checking":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          badge: <Badge variant="secondary">Verificando...</Badge>,
          color: "text-gray-600",
        }
      case "connected":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          badge: (
            <Badge variant="default" className="bg-green-600">
              Conectado
            </Badge>
          ),
          color: "text-green-600",
        }
      case "overloaded":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          badge: <Badge variant="destructive">Sobrecargado</Badge>,
          color: "text-orange-600",
        }
      case "quota_exceeded":
        return {
          icon: <XCircle className="h-4 w-4" />,
          badge: <Badge variant="destructive">Cuota Excedida</Badge>,
          color: "text-red-600",
        }
      case "auth_error":
        return {
          icon: <XCircle className="h-4 w-4" />,
          badge: <Badge variant="destructive">Error de Auth</Badge>,
          color: "text-red-600",
        }
      default:
        return {
          icon: <XCircle className="h-4 w-4" />,
          badge: <Badge variant="destructive">Error</Badge>,
          color: "text-red-600",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 ${statusInfo.color}`}>
          {statusInfo.icon}
          <span className="text-sm font-medium">Estado de API:</span>
        </div>
        {statusInfo.badge}
      </div>

      <div className="flex items-center gap-2">
        {lastCheck && <span className="text-xs text-gray-500">Última verificación: {lastCheck}</span>}
        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          disabled={status === "checking"}
          className="h-8 bg-transparent"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${status === "checking" ? "animate-spin" : ""}`} />
          Verificar
        </Button>
      </div>
    </div>
  )
}
