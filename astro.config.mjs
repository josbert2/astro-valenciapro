// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import sitemap from '@astrojs/sitemap';
import robotsTxt from "astro-robots-txt";
import vercel from "@astrojs/vercel";

const { SITE_URL, APP_ENV, WP_DOMAIN } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  "",
);

const siteUrl = SITE_URL || "https://valenciapro.cl";
const cmsUrl = WP_DOMAIN || "https://cms.valenciapro.cl";

// Fetch dynamic property slugs for sitemap
async function getPropertyUrls() {
  try {
    const response = await fetch(`${cmsUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          properties(first: 500) {
            nodes {
              slug
            }
          }
        }`
      })
    });
    const result = await response.json();
    const properties = result.data?.properties?.nodes || [];
    return properties.map((p) => `${siteUrl}/propiedad/${p.slug}/`);
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
    return [];
  }
}

const propertyUrls = await getPropertyUrls();

export default defineConfig({
  site: siteUrl,
  output: 'server',

  vite: {
      plugins: [tailwindcss()],
    },

  image: {
      
      domains: [
          'localhost',
          'valenciapro.cl',
          'www.valenciapro.cl',
          'valencia-pro-local.local',
          'docker-image-production-e295.up.railway.app',
          '0284i2z2w3.ufs.sh',
          'cms.valenciapro.cl',
      ],
      
      service: {
          entrypoint: 'astro/assets/services/sharp',
      },
    },

  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
      customPages: propertyUrls,
    }),
    robotsTxt({
      policy:
        APP_ENV === "production"
          ? [{ userAgent: "*", allow: "/" }]
          : [{ userAgent: "*", disallow: "/" }],
    }),
  ],

  adapter: vercel(),
});