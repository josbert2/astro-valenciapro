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
    const tag = url.searchParams.get('tag') || 'valenciapro.cl';
    const title = url.searchParams.get('title') || 'Valencia Propiedades';
    const subtitle = url.searchParams.get('subtitle') || 'Corretaje Inmobiliario en Santiago';

    const fonts = [];
    if (fontData) {
        fonts.push({ name: 'Lato', data: fontData, weight: 400 as const, style: 'normal' as const });
    }
    if (fontDataBold) {
        fonts.push({ name: 'Lato', data: fontDataBold, weight: 700 as const, style: 'normal' as const });
    }

    const svg = await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f8f6f0 0%, #e8e4d9 50%, #d8d2c2 100%)',
                    fontFamily: 'Lato, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                },
                children: [
                    // Golden accent line top
                    {
                        type: 'div',
                        props: {
                            style: {
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                right: '0',
                                height: '6px',
                                background: 'linear-gradient(90deg, #BFB37B 0%, #D4C99A 50%, #BFB37B 100%)',
                            },
                        },
                    },
                    // Decorative circles
                    {
                        type: 'div',
                        props: {
                            style: {
                                position: 'absolute',
                                top: '-150px',
                                right: '-150px',
                                width: '500px',
                                height: '500px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(191,179,123,0.2) 0%, transparent 70%)',
                            },
                        },
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                position: 'absolute',
                                bottom: '-200px',
                                left: '-100px',
                                width: '600px',
                                height: '600px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(191,179,123,0.15) 0%, transparent 70%)',
                            },
                        },
                    },
                    // Logo image
                    logoImage ? {
                        type: 'img',
                        props: {
                            src: logoImage,
                            style: {
                                width: '90px',
                                height: '90px',
                                borderRadius: '20px',
                                marginBottom: '30px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                            },
                        },
                    } : {
                        type: 'div',
                        props: {
                            style: {
                                width: '90px',
                                height: '90px',
                                background: 'linear-gradient(135deg, #BFB37B 0%, #D4C99A 100%)',
                                borderRadius: '20px',
                                marginBottom: '30px',
                            },
                        },
                    },
                    // Tag pill
                    {
                        type: 'div',
                        props: {
                            style: {
                                background: 'rgba(191, 179, 123, 0.2)',
                                border: '1px solid rgba(191, 179, 123, 0.5)',
                                borderRadius: '30px',
                                padding: '10px 28px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#8a7f4a',
                                marginBottom: '25px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                            },
                            children: tag,
                        },
                    },
                    // Title
                    {
                        type: 'div',
                        props: {
                            style: {
                                fontSize: '56px',
                                fontWeight: 'bold',
                                color: '#2d2d2d',
                                textAlign: 'center',
                                lineHeight: 1.15,
                                maxWidth: '900px',
                                marginBottom: '20px',
                            },
                            children: title,
                        },
                    },
                    // Subtitle
                    {
                        type: 'div',
                        props: {
                            style: {
                                fontSize: '22px',
                                fontWeight: '400',
                                color: '#636363',
                                textAlign: 'center',
                                maxWidth: '700px',
                                lineHeight: 1.5,
                            },
                            children: subtitle,
                        },
                    },
                    // Bottom accent
                    {
                        type: 'div',
                        props: {
                            style: {
                                position: 'absolute',
                                bottom: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                            },
                            children: [
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            width: '50px',
                                            height: '2px',
                                            background: 'rgba(191, 179, 123, 0.6)',
                                        },
                                    },
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            fontSize: '14px',
                                            color: '#8a7f4a',
                                            letterSpacing: '2px',
                                            textTransform: 'uppercase',
                                        },
                                        children: 'Valencia Propiedades',
                                    },
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            width: '50px',
                                            height: '2px',
                                            background: 'rgba(191, 179, 123, 0.6)',
                                        },
                                    },
                                },
                            ],
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
