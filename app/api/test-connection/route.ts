import { google } from "@ai-sdk/google"
import { generateText } from "ai"

// Función para esperar
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET() {
  const maxRetries = 2
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateText({
        model: google("gemini-1.5-flash-8b", {
          apiKey: "AIzaSyBQcTnzfhJRp2c7Q7UVgqm9b0wl5L4aMhk",
        }),
        prompt: "Responde solo con 'Conexión exitosa con Gemini AI para EduChat del Colegio Moderno'",
        maxTokens: 30,
        temperature: 0.1,
      })

      return Response.json({
        success: true,
        message: result.text,
        timestamp: new Date().toISOString(),
        model: "gemini-1.5-flash-8b",
        attempt: attempt,
      })
    } catch (error: any) {
      lastError = error
      console.error(`Error en test de conexión (intento ${attempt}):`, error)

      // Si es el último intento, no reintentar
      if (attempt === maxRetries) {
        break
      }

      // Esperar antes del siguiente intento
      if (error.message?.includes("overloaded") || error.message?.includes("busy")) {
        const delayMs = Math.pow(2, attempt) * 2000 + Math.random() * 1000
        console.log(`Esperando ${delayMs}ms antes del reintento`)
        await delay(delayMs)
      } else {
        await delay(1000 * attempt)
      }
    }
  }

  return Response.json(
    {
      success: false,
      error: "Error de conexión con Gemini AI",
      details: lastError instanceof Error ? lastError.message : "Error desconocido",
      timestamp: new Date().toISOString(),
      suggestion: lastError.message?.includes("overloaded")
        ? "El servicio está sobrecargado. Intenta nuevamente en unos minutos."
        : "Verifica tu API key y configuración.",
    },
    { status: 500 },
  )
}
