// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import sitemap from '@astrojs/sitemap';
import robotsTxt from "astro-robots-txt";


import node from "@astrojs/node";


const { SITE_URL, APP_ENV } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  "",
);


export default defineConfig({
  site: SITE_URL || "https://valenciapro.cl",
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
          '0284i2z2w3.ufs.sh', // UploadThing para assets
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
    }),
    robotsTxt({
      policy:
        APP_ENV === "production"
          ? [{ userAgent: "*", allow: "/" }]
          : [{ userAgent: "*", disallow: "/" }],
    }),
  ],

  adapter: node({
    mode: "standalone",
  }),
});