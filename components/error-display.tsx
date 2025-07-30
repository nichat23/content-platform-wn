"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, ExternalLink, Key, Clock } from "lucide-react"

interface ErrorDisplayProps {
  error: any
  onRetry?: () => void
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const isQuotaError = error?.message?.includes("quota") || error?.message?.includes("exceeded")
  const isAuthError = error?.message?.includes("API key") || error?.message?.includes("authentication")
  const isOverloadedError = error?.message?.includes("overloaded") || error?.message?.includes("busy")

  return (
    <Alert variant="destructive" className="mx-4 mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {isQuotaError && "Límite de Cuota Excedido"}
        {isAuthError && (
          <>
            <Key className="h-4 w-4" />
            Error de Autenticación
          </>
        )}
        {isOverloadedError && (
          <>
            <Clock className="h-4 w-4" />
            Servicio Sobrecargado
          </>
        )}
        {!isQuotaError && !isAuthError && !isOverloadedError && "Error de Conexión"}
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          {isQuotaError && "Se ha alcanzado el límite de uso de la API de Gemini."}
          {isAuthError && "Hay un problema con la autenticación de la API key."}
          {isOverloadedError && "Los servidores de Gemini están experimentando alta demanda. Esto es temporal."}
          {!isQuotaError &&
            !isAuthError &&
            !isOverloadedError &&
            "Ha ocurrido un error al conectar con el servicio de IA."}
        </p>

        {isOverloadedError && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Recomendaciones:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 mt-1">
              <li>Espera 30-60 segundos antes de reintentar</li>
              <li>Los servidores suelen estar menos ocupados en horarios no pico</li>
              <li>El sistema reintentará automáticamente con delays inteligentes</li>
            </ul>
          </div>
        )}

        {isQuotaError && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Límite gratuito alcanzado (15 consultas por minuto)</li>
            <li>Necesidad de configurar facturación en Google Cloud</li>
            <li>Demasiadas consultas en poco tiempo</li>
          </ul>
        )}

        {isAuthError && (
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>API key inválida o expirada</li>
            <li>Restricciones de IP o dominio</li>
            <li>Servicio no habilitado en Google Cloud Console</li>
          </ul>
        )}

        <div className="flex gap-2 flex-wrap">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-3 w-3 mr-1" />
              {isOverloadedError ? "Reintentar (30s)" : "Reintentar"}
            </Button>
          )}

          {(isQuotaError || isAuthError) && (
            <Button variant="outline" size="sm" asChild>
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Google Cloud Console
              </a>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
