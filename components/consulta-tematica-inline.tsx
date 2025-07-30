"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react"

interface ConsultaTematicaInlineProps {
  onConsulta: (prompt: string) => Promise<void>
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
    "Economía",
    "Política",
  ]

  const grados = ["Preescolar", "1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°", "9°", "10°", "11°"]

  const generarPrompt = () => {
    return `Actúa como un experto en didáctica, pedagogía y en la disciplina de ${materia}, específicamente, el tema ${tema}. Tu tarea es generar un listado de los temas y conceptos que debe conocer un estudiante de ${grado} grado, en Colombia.`
  }

  const handleConsulta = async () => {
    if (!materia || !tema || !grado) return

    setCargando(true)
    try {
      const prompt = generarPrompt()
      await onConsulta(prompt)

      // Limpiar formulario después de enviar
      setMateria("")
      setTema("")
      setGrado("")
      setMostrarVistaPrevia(false)
    } catch (error) {
      console.error("Error en consulta temática:", error)
    } finally {
      setCargando(false)
    }
  }

  const formularioCompleto = materia && tema && grado

  return (
    <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <BookOpen className="h-5 w-5" />
          Consultar Contenido Temático
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="materia" className="text-green-700">
              Materia
            </Label>
            <Select value={materia} onValueChange={setMateria}>
              <SelectTrigger className="border-green-300 focus:border-green-500">
                <SelectValue placeholder="Selecciona materia" />
              </SelectTrigger>
              <SelectContent>
                {materias.map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tema" className="text-green-700">
              Tema Específico
            </Label>
            <Input
              id="tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej: Fracciones, Revolución Industrial..."
              className="border-green-300 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grado" className="text-green-700">
              Grado
            </Label>
            <Select value={grado} onValueChange={setGrado}>
              <SelectTrigger className="border-green-300 focus:border-green-500">
                <SelectValue placeholder="Selecciona grado" />
              </SelectTrigger>
              <SelectContent>
                {grados.map((gr) => (
                  <SelectItem key={gr} value={gr}>
                    {gr}
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
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              {mostrarVistaPrevia ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Ocultar vista previa
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver vista previa del prompt
                </>
              )}
            </Button>

            {mostrarVistaPrevia && (
              <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium mb-1">Vista previa del prompt:</p>
                <p className="text-sm text-green-700 italic">"{generarPrompt()}"</p>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleConsulta}
          disabled={!formularioCompleto || cargando}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {cargando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando contenido temático...
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              Generar Contenido Temático
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
