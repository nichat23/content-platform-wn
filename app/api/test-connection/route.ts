import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function GET() {
  const maxRetries = 3
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Intento ${attempt} de conexión con Gemini AI...`)

      // Usar API key directamente para pruebas
      const result = await generateText({
        model: google("gemini-1.5-flash-8b", {
          apiKey: "AIzaSyBQcTnzfhJRp2c7Q7UVgqm9b0wl5L4aMhk",
        }),
        prompt: "Responde solo con 'OK' si puedes leer este mensaje.",
        maxTokens: 10,
        temperature: 0,
      })

      console.log("Conexión exitosa con Gemini AI")
      return Response.json({
        status: "connected",
        message: "Conexión exitosa con Gemini AI",
        model: "gemini-1.5-flash-8b",
        response: result.text,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      lastError = error
      console.error(`Error en test de conexión (intento ${attempt}):`, error)

      if (attempt === maxRetries) {
        break
      }

      if (error.message?.includes("overloaded") || error.message?.includes("busy")) {
        const delayMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000
        console.log(`Modelo sobrecargado, esperando ${delayMs}ms antes del reintento ${attempt + 1}`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        continue
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  if (lastError.message?.includes("overloaded") || lastError.message?.includes("busy")) {
    return Response.json(
      {
        status: "overloaded",
        message: "El modelo está temporalmente sobrecargado",
        details: "Los servidores de Gemini están experimentando alta demanda.",
        retryAfter: 30,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }

  if (lastError.message?.includes("quota") || lastError.message?.includes("exceeded")) {
    return Response.json(
      {
        status: "quota_exceeded",
        message: "Cuota de API excedida",
        details: "Verifica tu plan y configuración de facturación en Google Cloud.",
        timestamp: new Date().toISOString(),
      },
      { status: 429 },
    )
  }

  if (lastError.message?.includes("API key") || lastError.message?.includes("authentication")) {
    return Response.json(
      {
        status: "auth_error",
        message: "Error de autenticación",
        details: "Verifica que la API key de Google Gemini esté configurada correctamente.",
        timestamp: new Date().toISOString(),
      },
      { status: 401 },
    )
  }

  return Response.json(
    {
      status: "error",
      message: "Error de conexión con Gemini AI",
      details: lastError.message || "Error desconocido",
      timestamp: new Date().toISOString(),
    },
    { status: 500 },
  )
}
