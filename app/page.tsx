"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, BookOpen, Users, GraduationCap, Sparkles } from "lucide-react"
import { ApiStatus } from "@/components/api-status"
import { ErrorDisplay } from "@/components/error-display"
import { QuotaInfo } from "@/components/quota-info"
import { ConsultaTematicaInline } from "@/components/consulta-tematica-inline"

export default function ChatEducativo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, append } = useChat({
    onError: (error) => {
      console.error("Error en chat:", error)
    },
  })
  const [sugerenciaSeleccionada, setSugerenciaSeleccionada] = useState<string | null>(null)
  const [ultimaConsultaTematica, setUltimaConsultaTematica] = useState<string | null>(null)

  const enviarSugerencia = (sugerencia: string) => {
    setSugerenciaSeleccionada(sugerencia)
    setUltimaConsultaTematica(null)
    // Usar append para agregar el mensaje directamente
    append({
      role: "user",
      content: sugerencia,
    })
  }

  const manejarConsultaTematica = (prompt: string) => {
    setUltimaConsultaTematica(prompt)
    setSugerenciaSeleccionada(null)
    // Usar append para enviar el prompt, pero lo mostraremos de forma personalizada
    append({
      role: "user",
      content: prompt,
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    setUltimaConsultaTematica(null)
    setSugerenciaSeleccionada(null)
    handleSubmit(e)
  }

  // Función para determinar si un mensaje es una consulta temática
  const esConsultaTematicaMsg = (content: string) => {
    return content.includes("Actúa como un experto en didáctica, pedagogía y en la disciplina de")
  }

  // Función para mostrar el mensaje del usuario de forma personalizada
  const mostrarMensajeUsuario = (message: any) => {
    if (esConsultaTematicaMsg(message.content)) {
      return "📚 Consulta de contenido temático generada"
    }
    return message.content
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduChat AI - Colegio Moderno
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Tu asistente inteligente para contenidos educativos del Colegio Moderno
          </p>
        </div>

        <QuotaInfo />

        {/* Chat Container */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Consulta Educativa
            </CardTitle>
          </CardHeader>

          <ApiStatus />
          {error && (
            <ErrorDisplay
              error={error}
              onRetry={() => {
                reload()
              }}
            />
          )}

          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[500px] p-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <BookOpen className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">¡Bienvenido, Profesor!</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Estoy aquí para ayudarte con contenidos temáticos, metodologías de enseñanza y recursos
                      educativos. ¿En qué asignatura te gustaría que te asista hoy?
                    </p>
                  </div>

                  {/* Consulta Temática Integrada */}
                  <ConsultaTematicaInline onConsulta={manejarConsultaTematica} isLoading={isLoading} />
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <AvatarFallback className="text-white font-semibold">AI</AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.role === "user" ? mostrarMensajeUsuario(message) : message.content}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="bg-gradient-to-r from-green-500 to-blue-500">
                          <AvatarFallback className="text-white font-semibold">
                            <Users className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <Avatar className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <AvatarFallback className="text-white font-semibold">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {ultimaConsultaTematica ? "Generando contenido temático..." : "Pensando..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-gray-50/50 p-4">
              <form onSubmit={onSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Escribe tu consulta educativa aquí..."
                    className="pr-12 h-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                    disabled={isLoading}
                  />
                  {sugerenciaSeleccionada && (
                    <Badge variant="secondary" className="absolute -top-8 left-0 text-xs bg-blue-100 text-blue-700">
                      Sugerencia seleccionada
                    </Badge>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  💡 Especifica tu asignatura y nivel educativo para obtener mejores resultados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">Potenciado por Gemini AI • Colegio Moderno • Diseñado para educadores</p>
        </div>
      </div>
    </div>
  )
}
