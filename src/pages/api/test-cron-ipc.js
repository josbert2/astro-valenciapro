export const prerender = false;

export async function GET({ request }) {
    // 1. URL de tu WordPress
    const wpUrl = process.env.WORDPRESS_URL || 'https://cms.valenciapro.cl'; 
    
    // 2. Endpoint con parámetros PARA SIMULACIÓN (simulate=1) y envío de correo (send_email=1)
    const endpoint = `${wpUrl}/wp-json/valencia/v1/calc-ipc-all?simulate=1&send_email=1`;

    try {
        console.log(`Ejecutando TEST Cron IPC: Conectando a ${endpoint}`);
        
        const response = await fetch(endpoint);
        const data = await response.json();

        return new Response(JSON.stringify({
            message: 'Test Cron IPC ejecutado (Simulación)',
            sent_to: data.sent_to || 'N/A',
            result: data
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error('Error en Test Cron IPC:', error);
        return new Response(JSON.stringify({
            error: 'Error al conectar con WP',
            details: error.message
        }), { status: 500 });
    }
}
