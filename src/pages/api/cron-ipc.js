export const prerender = false;

export async function GET({ request }) {
    // Verificar autorización (Opcional pero recomendado: configurar CRON_SECRET en Vercel)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new Response('Unauthorized', { status: 401 });
    }

    // URL de tu WordPress (Asegúrate de tener esta variable de entorno en Vercel)
    // Si no está definida, intenta usar la pública o hardcodeada de producción
    const wpUrl = process.env.WORDPRESS_URL || 'https://cms.valenciapro.cl'; 
    const endpoint = `${wpUrl}/wp-json/valencia/v1/calc-ipc-all?send_email=1`;

    try {
        console.log(`Ejecutando Cron IPC: Conectando a ${endpoint}`);
        
        const response = await fetch(endpoint);
        const data = await response.json();

        return new Response(JSON.stringify({
            message: 'Cron IPC ejecutado',
            wp_response: data
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error('Error en Cron IPC:', error);
        return new Response(JSON.stringify({
            error: 'Error al conectar con WP',
            details: error.message
        }), { status: 500 });
    }
}
