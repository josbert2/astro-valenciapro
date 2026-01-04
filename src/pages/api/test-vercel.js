export const prerender = false;

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "¡Hola desde una Vercel Function en Astro!",
      time: new Date().toISOString(),
      success: true
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
