"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sparkles, Eye, EyeOff, GraduationCap } from "lucide-react"

interface ConsultaTematicaInlineProps {
  onConsulta: (prompt: string) => void
  isLoading?: boolean
}

const materias = [
  "Matemáticas",
  "Español y Literatura",
  "Ciencias Naturales",
  "Ciencias Sociales",
  "Inglés",
  "Educación Física",
  "Educación Artística",
  "Tecnología e Informática",
  "Ética y Valores",
  "Religión",
  "Filosofía",
  "Química",
  "Física",
  "Biología",
  "Historia",
  "Geografía",
]

const grados = ["Preescolar", "1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°", "9°", "10°", "11°"]

export function ConsultaTematicaInline({ onConsulta, isLoading = false }: ConsultaTematicaInlineProps) {
  const [materia, setMateria] = useState("")
  const [tema, setTema] = useState("")
  const [grado, setGrado] = useState("")
  const [mostrarVista, setMostrarVista] = useState(false)

  const handleConsulta = () => {
    if (!materia || !tema || !grado) {
      alert("Por favor, completa todos los campos antes de hacer la consulta.")
      return
    }

    const prompt = `Actúa como un experto en didáctica, pedagogía y en la disciplina de ${materia}, específicamente, el tema ${tema}. Tu tarea es generar un listado de los temas y conceptos que debe conocer un estudiante de ${grado} grado, en Colombia.`

    console.log("Enviando consulta temática:", prompt) // Para debug
    onConsulta(prompt)

    // Limpiar el formulario después de enviar
    setMateria("")
    setTema("")
    setGrado("")
    setMostrarVista(false)
  }

  const isFormComplete = materia && tema && grado

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Título de la sección */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          Consultar Contenido Temático
        </h4>
        <p className="text-sm text-gray-500 text-center">
          Genera listados específicos de contenidos curriculares por materia y grado
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selector de Materia */}
          <div className="space-y-2">
            <Label htmlFor="materia-inline" className="text-sm font-medium text-gray-700">
              Materia
            </Label>
            <Select value={materia} onValueChange={setMateria}>
              <SelectTrigger id="materia-inline" className="bg-white">
                <SelectValue placeholder="Selecciona una materia" />
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

          {/* Input de Tema */}
          <div className="space-y-2">
            <Label htmlFor="tema-inline" className="text-sm font-medium text-gray-700">
              Tema Específico
            </Label>
            <Input
              id="tema-inline"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej: Fracciones, Revolución Industrial..."
              className="bg-white"
            />
          </div>

          {/* Selector de Grado */}
          <div className="space-y-2">
            <Label htmlFor="grado-inline" className="text-sm font-medium text-gray-700">
              Grado
            </Label>
            <Select value={grado} onValueChange={setGrado}>
              <SelectTrigger id="grado-inline" className="bg-white">
                <SelectValue placeholder="Selecciona el grado" />
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

        {/* Vista previa colapsable del prompt */}
        {isFormComplete && (
          <Collapsible open={mostrarVista} onOpenChange={setMostrarVista}>
            <div className="flex justify-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                  {mostrarVista ? (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Ocultar vista previa
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Ver vista previa del prompt
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="bg-white p-3 rounded-lg border border-green-200 mt-2">
                <p className="text-xs text-gray-600 mb-1">Vista previa de la consulta:</p>
                <p className="text-sm text-gray-800 italic">
                  "Actúa como un experto en didáctica, pedagogía y en la disciplina de{" "}
                  <span className="font-semibold text-green-700">{materia}</span>, específicamente, el tema{" "}
                  <span className="font-semibold text-green-700">{tema}</span>. Tu tarea es generar un listado de los
                  temas y conceptos que debe conocer un estudiante de{" "}
                  <span className="font-semibold text-green-700">{grado}</span> grado, en Colombia."
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Botón de consulta */}
        <div className="flex justify-center">
          <Button
            onClick={handleConsulta}
            disabled={!isFormComplete || isLoading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Contenido Temático
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            💡 Esta consulta generará un listado específico de contenidos curriculares para el grado seleccionado
          </p>
        </div>
      </div>
    </div>
  )
}
