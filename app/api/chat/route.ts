import { google } from "@ai-sdk/google"
import { streamText } from "ai"

// Permitir respuestas de streaming hasta 30 segundos
export const maxDuration = 30

// Función para esperar con delay exponencial
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(req: Request) {
  const maxRetries = 3
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { messages } = await req.json()

      // Usar modelo menos congestionado y con configuración optimizada
      const result = await streamText({
        model: google("gemini-1.5-flash-8b", {
          apiKey: "AIzaSyBQcTnzfhJRp2c7Q7UVgqm9b0wl5L4aMhk",
        }),
        system: `Eres un asistente educativo especializado en ayudar a profesores con contenidos temáticos de sus asignaturas. 
        
        Tu rol es:
        - Proporcionar información clara y estructurada sobre temas educativos
        - Sugerir actividades, recursos y metodologías de enseñanza
        - Adaptar el contenido según el nivel educativo (primaria, secundaria, bachillerato)
        - Ofrecer ejemplos prácticos y ejercicios
        - Mantener un tono profesional pero amigable
        - Estructurar las respuestas de manera didáctica
        - Proporcionar contenido en español adaptado al sistema educativo
        
        Siempre pregunta por el nivel educativo y la asignatura específica si no está claro en la consulta.
        Incluye ejemplos prácticos y sugerencias de actividades cuando sea apropiado.`,
        messages,
        maxTokens: 800, // Reducido para mejor rendimiento
        temperature: 0.7,
      })

      return result.toAIStreamResponse()
    } catch (error: any) {
      lastError = error
      console.error(`Error en API de chat (intento ${attempt}):`, error)

      // Si es el último intento, no reintentar
      if (attempt === maxRetries) {
        break
      }

      // Manejo específico de errores de sobrecarga
      if (error.message?.includes("overloaded") || error.message?.includes("busy")) {
        const delayMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000 // Delay exponencial con jitter
        console.log(`Modelo sobrecargado, esperando ${delayMs}ms antes del reintento ${attempt + 1}`)
        await delay(delayMs)
        continue
      }

      // Para otros errores, esperar menos tiempo
      await delay(1000 * attempt)
    }
  }

  // Manejo de errores después de todos los reintentos
  if (lastError.message?.includes("overloaded") || lastError.message?.includes("busy")) {
    return new Response(
      JSON.stringify({
        error: "model_overloaded",
        message: "El servicio de IA está temporalmente sobrecargado. Por favor, intenta nuevamente en unos momentos.",
        details: "Los servidores de Gemini están experimentando alta demanda.",
        retryAfter: 30,
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "30",
        },
      },
    )
  }

  if (lastError.message?.includes("quota") || lastError.message?.includes("exceeded")) {
    return new Response(
      JSON.stringify({
        error: "quota_exceeded",
        message:
          "Se ha excedido la cuota de la API de Gemini. Por favor, verifica tu plan y configuración de facturación.",
        details: "Visita https://ai.google.dev/gemini-api/docs/rate-limits para más información.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }

  if (lastError.message?.includes("API key") || lastError.message?.includes("authentication")) {
    return new Response(
      JSON.stringify({
        error: "auth_error",
        message: "Error de autenticación con la API de Gemini. Verifica tu API key.",
        details: lastError.message || "Error de autenticación",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }

  // Error genérico
  return new Response(
    JSON.stringify({
      error: "api_error",
      message: "Error en el servicio de IA después de varios intentos. Por favor, intenta nuevamente más tarde.",
      details: lastError.message || "Error desconocido",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}
