"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Info, Zap, Clock, AlertTriangle } from "lucide-react"
import { ApiStatus } from "@/components/api-status"

export function QuotaInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/50">
      <CardHeader
        className="pb-3 cursor-pointer hover:bg-blue-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between text-blue-800">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sistema Gemini AI
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          <ApiStatus />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Modelo</p>
                <p className="text-xs text-blue-600">Gemini 1.5 Flash 8B</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Límite</p>
                <p className="text-xs text-blue-600">15 consultas/minuto</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Uso</p>
                <Badge variant="outline" className="text-xs">
                  Responsable
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-xs text-blue-600 bg-blue-100 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Consejos de uso:</p>
            <ul className="space-y-1">
              <li>• Usa consultas temáticas para contenido curricular específico</li>
              <li>• Haz preguntas claras y específicas para mejores resultados</li>
              <li>• El sistema maneja automáticamente reintentos en caso de sobrecarga</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
