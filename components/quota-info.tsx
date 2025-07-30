"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Info, Zap, Clock, AlertTriangle } from "lucide-react"
import { ApiStatus } from "@/components/api-status"

export function QuotaInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/50">
      <CardHeader
        className="pb-3 cursor-pointer hover:bg-blue-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between text-blue-800">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Sistema de IA Gemini
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          <ApiStatus />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium text-sm">Modelo</div>
                <div className="text-xs text-gray-600">Gemini 1.5 Flash</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Límite</div>
                <div className="text-xs text-gray-600">15 consultas/min</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <div>
                <div className="font-medium text-sm">Tokens</div>
                <div className="text-xs text-gray-600">800 por respuesta</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-white/50 p-3 rounded-lg">
            <strong>Recomendaciones:</strong> Para evitar límites de cuota, espera unos segundos entre consultas. Si
            experimentas errores de sobrecarga, el sistema reintentará automáticamente.
          </div>
        </CardContent>
      )}
    </Card>
  )
}
