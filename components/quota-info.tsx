"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, Clock, Zap, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function QuotaInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4 bg-blue-50 border-blue-200">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-blue-100 transition-colors">
            <CardTitle className="text-sm flex items-center justify-between text-blue-700">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Información del Sistema - Gemini AI
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-blue-600" />
                <span>Límite: 15 consultas/minuto</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-blue-600" />
                <span>Modelo: Gemini 1.5 Flash 8B (optimizado)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-blue-600" />
                <span>Reintentos automáticos habilitados</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                Sistema anti-sobrecarga
              </Badge>
              <Badge variant="outline" className="text-xs">
                Delays inteligentes
              </Badge>
              <Badge variant="outline" className="text-xs">
                Modelo menos congestionado
              </Badge>
            </div>

            <p className="text-xs text-blue-600">
              ✅ Sistema optimizado para manejar alta demanda • 🔄 Reintentos automáticos con delays exponenciales
            </p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
