"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { QuotaInfo } from "@/components/quota-info"
import { ConsultaTematicaInline } from "@/components/consulta-tematica-inline"

// Función para detectar si un mensaje es una consulta temática
const esConsultaTematicaMsg = (content: string) => {
  return content.includes("Actúa como un experto en didáctica, pedagogía y en la disciplina de")
}

// Función para mostrar un mensaje más amigable para consultas temáticas
const mostrarMensajeUsuario = (content: string) => {
  if (esConsultaTematicaMsg(content)) {
    return "📚 Consulta de contenido temático generada"
  }
  return content
}

export default function ChatEducativo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat()

  const manejarConsultaTematica = (prompt: string) => {
    console.log("Enviando consulta temática:", prompt)
    append({
      role: "user",
      content: prompt,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">EduChat AI - Colegio Moderno</h1>
          <p className="text-gray-600 text-lg">
            Asistente inteligente para consultas educativas y contenidos temáticos
          </p>
        </div>

        {/* Panel de información colapsable */}
        <QuotaInfo />

        {/* Chat Container */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Chat Educativo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-96 p-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">¡Bienvenido, Profesor!</h3>
                  <p className="text-gray-600 mb-6">
                    Estoy aquí para ayudarte con contenidos temáticos y consultas educativas.
                  </p>

                  {/* Consulta Temática Integrada */}
                  <ConsultaTematicaInline onConsulta={manejarConsultaTematica} />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.role === "user" ? mostrarMensajeUsuario(message.content) : message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generando respuesta educativa...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe tu consulta educativa aquí..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
