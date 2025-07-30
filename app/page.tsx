"use client"

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { QuotaInfo } from "@/components/quota-info"
import { ConsultaTematicaInline } from "@/components/consulta-tematica-inline"

// Función para detectar si un mensaje es una consulta temática
const esConsultaTematicaMsg = (content: string) => {
  return content.includes("Actúa como un experto en didáctica, pedagogía y en la disciplina de")
}

// Función para mostrar mensaje amigable en lugar del prompt técnico
const mostrarMensajeUsuario = (content: string) => {
  if (esConsultaTematicaMsg(content)) {
    return "📚 Consulta de contenido temático generada"
  }
  return content
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat()

  // Función para manejar consultas temáticas
  const manejarConsultaTematica = async (prompt: string) => {
    console.log("Enviando consulta temática:", prompt)

    // Usar append para agregar el mensaje al chat
    await append({
      role: "user",
      content: prompt,
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-600" />
            EduChat AI - Colegio Moderno
          </h1>
          <p className="text-gray-600 text-sm mt-1">Asistente educativo especializado para profesores</p>
        </div>
      </div>

      {/* Panel de información colapsable */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4">
        <QuotaInfo />
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-4">
        <Card className="h-full flex flex-col shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-blue-500 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">¡Bienvenido al Chat Educativo!</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Soy tu asistente especializado en contenidos educativos. Puedes hacerme preguntas sobre
                    metodologías, recursos didácticos, o usar la consulta temática estructurada.
                  </p>

                  {/* Consulta Temática Integrada */}
                  <ConsultaTematicaInline onConsulta={manejarConsultaTematica} />
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.role === "user" ? mostrarMensajeUsuario(message.content) : message.content}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Generando respuesta educativa...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe tu consulta educativa aquí..."
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
