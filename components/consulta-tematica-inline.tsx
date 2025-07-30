"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react"

interface ConsultaTematicaInlineProps {
  onConsulta: (prompt: string) => void
}

export function ConsultaTematicaInline({ onConsulta }: ConsultaTematicaInlineProps) {
  const [materia, setMateria] = useState("")
  const [tema, setTema] = useState("")
  const [grado, setGrado] = useState("")
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false)
  const [cargando, setCargando] = useState(false)

  const materias = [
    "Matemáticas",
    "Español",
    "Ciencias Naturales",
    "Ciencias Sociales",
    "Inglés",
    "Educación Física",
    "Educación Artística",
    "Tecnología e Informática",
    "Ética y Valores",
    "Religión",
    "Filosofía",
    "Física",
    "Química",
    "Biología",
    "Historia",
    "Geografía",
    "Literatura",
    "Geometría",
    "Estadística",
    "Cálculo",
  ]

  const grados = ["Preescolar", "1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°", "9°", "10°", "11°"]

  const generarPrompt = () => {
    return `Actúa como un experto en didáctica, pedagogía y en la disciplina de ${materia}, específicamente, el tema ${tema}. Tu tarea es generar un listado de los temas y conceptos que debe conocer un estudiante de ${grado} grado, en Colombia.`
  }

  const handleConsulta = async () => {
    if (!materia || !tema || !grado) return

    setCargando(true)
    const prompt = generarPrompt()

    try {
      onConsulta(prompt)

      // Limpiar formulario después de enviar
      setMateria("")
      setTema("")
      setGrado("")
      setMostrarVistaPrevia(false)
    } finally {
      setCargando(false)
    }
  }

  const formularioCompleto = materia && tema && grado

  return (
    <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-700">
          <BookOpen className="w-5 h-5" />
          Consultar Contenido Temático
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Materia</label>
            <Select value={materia} onValueChange={setMateria}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar materia" />
              </SelectTrigger>
              <SelectContent>
                {materias.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tema Específico</label>
            <Input
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej: Fracciones, Revolución Industrial..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Grado</label>
            <Select value={grado} onValueChange={setGrado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar grado" />
              </SelectTrigger>
              <SelectContent>
                {grados.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {formularioCompleto && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarVistaPrevia(!mostrarVistaPrevia)}
              className="flex items-center gap-2"
            >
              {mostrarVistaPrevia ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Ocultar vista previa
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Ver vista previa del prompt
                </>
              )}
            </Button>

            {mostrarVistaPrevia && (
              <div className="p-3 bg-gray-100 rounded-lg border text-sm text-gray-700">
                <strong>Prompt que se enviará:</strong>
                <p className="mt-1 italic">"{generarPrompt()}"</p>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleConsulta}
          disabled={!formularioCompleto || cargando}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {cargando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generando contenido temático...
            </>
          ) : (
            "Generar Contenido Temático"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
