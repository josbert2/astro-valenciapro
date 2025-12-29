import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

let fontData: Buffer | undefined;
let fontDataBold: Buffer | undefined;
let logoImage: string | undefined;

try {
    const fontPath = path.join(process.cwd(), 'node_modules/@fontsource/lato/files/lato-latin-400-normal.woff');
    const fontPathBold = path.join(process.cwd(), 'node_modules/@fontsource/lato/files/lato-latin-700-normal.woff');
    const logoPath = path.join(process.cwd(), 'public/android-chrome-512x512.png');
    
    fontData = fs.readFileSync(fontPath);
    fontDataBold = fs.readFileSync(fontPathBold);
    
    const logoBuffer = fs.readFileSync(logoPath);
    logoImage = `data:image/png;base64,${logoBuffer.toString('base64')}`;
} catch (e) {
    console.error('Error loading assets:', e);
}

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const title = url.searchParams.get('title') || 'Propiedad';
    const address = url.searchParams.get('address') || 'Santiago, Chile';
    const price = url.searchParams.get('price') || 'Consultar';
    const beds = url.searchParams.get('beds') || '';
    const baths = url.searchParams.get('baths') || '';
    const size = url.searchParams.get('size') || '';
    const operation = url.searchParams.get('operation') || 'Venta';
    const imageUrl = url.searchParams.get('image') || '';

    const fonts = [];
    if (fontData) {
        fonts.push({ name: 'Lato', data: fontData, weight: 400 as const, style: 'normal' as const });
    }
    if (fontDataBold) {
        fonts.push({ name: 'Lato', data: fontDataBold, weight: 700 as const, style: 'normal' as const });
    }

    // Fetch and convert property image to base64 if provided
    let propertyImageBase64 = '';
    if (imageUrl) {
        try {
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
                const arrayBuffer = await imageResponse.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
                propertyImageBase64 = `data:${contentType};base64,${buffer.toString('base64')}`;
            }
        } catch (e) {
            console.error('Error fetching property image:', e);
        }
    }

    // Build specs array
    const specs = [];
    if (beds) specs.push({ icon: '🛏️', value: `${beds} Hab` });
    if (baths) specs.push({ icon: '🚿', value: `${baths} Baños` });
    if (size) specs.push({ icon: '📐', value: `${size} m²` });

    const svg = await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    background: '#1a1a1a',
                    fontFamily: 'Lato, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                },
                children: [
                    // Left column - Property Image (55%)
                    {
                        type: 'div',
                        props: {
                            style: {
                                width: '55%',
                                height: '100%',
                                display: 'flex',
                                position: 'relative',
                                overflow: 'hidden',
                            },
                            children: [
                                // Property image or gradient placeholder
                                propertyImageBase64 ? {
                                    type: 'img',
                                    props: {
                                        src: propertyImageBase64,
                                        style: {
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        },
                                    },
                                } : {
                                    type: 'div',
                                    props: {
                                        style: {
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        },
                                        children: {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    fontSize: '80px',
                                                    opacity: 0.3,
                                                },
                                                children: '🏠',
                                            },
                                        },
                                    },
                                },
                                // Gradient overlay
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(90deg, transparent 60%, #1a1a1a 100%)',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    // Right column - Content (40%)
                    {
                        type: 'div',
                        props: {
                            style: {
                                width: '45%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '50px 50px 50px 30px',
                                position: 'relative',
                            },
                            children: [
                                // Operation badge
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            background: operation.toLowerCase().includes('arriendo') ? '#bfb37b' : '#c07b59',
                                            color: '#fff',
                                            padding: '8px 20px',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            alignSelf: 'flex-start',
                                            marginBottom: '20px',
                                        },
                                        children: operation,
                                    },
                                },
                                // Title
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            fontSize: '38px',
                                            fontWeight: 'bold',
                                            color: '#ffffff',
                                            lineHeight: 1.2,
                                            marginBottom: '15px',
                                        },
                                        children: title.length > 40 ? title.substring(0, 40) + '...' : title,
                                    },
                                },
                                // Address
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '18px',
                                            color: '#999',
                                            marginBottom: '30px',
                                        },
                                        children: [
                                            { type: 'div', props: { style: { display: 'flex' }, children: '📍' } },
                                            { type: 'div', props: { style: { display: 'flex' }, children: address.length > 35 ? address.substring(0, 35) + '...' : address } },
                                        ],
                                    },
                                },
                                // Specs row
                                specs.length > 0 ? {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            gap: '20px',
                                            marginBottom: '30px',
                                        },
                                        children: specs.map(spec => ({
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '10px 16px',
                                                    borderRadius: '8px',
                                                },
                                                children: [
                                                    { type: 'div', props: { style: { fontSize: '18px', display: 'flex' }, children: spec.icon } },
                                                    { type: 'div', props: { style: { color: '#fff', fontSize: '16px', fontWeight: '600', display: 'flex' }, children: spec.value } },
                                                ],
                                            },
                                        })),
                                    },
                                } : null,
                                // Price
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            fontSize: '42px',
                                            fontWeight: 'bold',
                                            color: '#bfb37b',
                                            marginBottom: '30px',
                                        },
                                        children: price,
                                    },
                                },
                                // Logo and brand
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            marginTop: 'auto',
                                        },
                                        children: [
                                            logoImage ? {
                                                type: 'img',
                                                props: {
                                                    src: logoImage,
                                                    style: {
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '12px',
                                                    },
                                                },
                                            } : null,
                                            {
                                                type: 'div',
                                                props: {
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    },
                                                    children: [
                                                        {
                                                            type: 'div',
                                                            props: {
                                                                style: {
                                                                    color: '#fff',
                                                                    fontSize: '18px',
                                                                    fontWeight: 'bold',
                                                                },
                                                                children: 'Valencia Propiedades',
                                                            },
                                                        },
                                                        {
                                                            type: 'div',
                                                            props: {
                                                                style: {
                                                                    color: '#666',
                                                                    fontSize: '14px',
                                                                },
                                                                children: 'valenciapro.cl',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ].filter(Boolean),
                                    },
                                },
                            ].filter(Boolean),
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts,
        }
    );

    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1200 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(new Uint8Array(pngBuffer), {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
};
