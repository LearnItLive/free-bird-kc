// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import cloudflare from "@astrojs/cloudflare";

// Local utils from theme
import remarkParseContent from "./src/lib/utils/remarkParseContent.ts";
import { parseTomlToJson, reloadOnTomlChange } from "./src/lib/utils/tomlUtils.ts";
import { enabledLanguages } from "./src/lib/utils/i18nUtils.ts";

const config = parseTomlToJson();
let {
  seo: { sitemap: sitemapConfig },
  settings: {
    multilingual: { showDefaultLangInUrl, defaultLanguage },
  },
} = config;

export default defineConfig({
  site: config.site.baseUrl ? config.site.baseUrl : "https://example.com",
  trailingSlash: config.site.trailingSlash ? "always" : "never",
  i18n: {
    locales: enabledLanguages,
    defaultLocale: defaultLanguage,
    routing: {
      redirectToDefaultLocale: showDefaultLangInUrl ? false : true,
      prefixDefaultLocale: showDefaultLangInUrl,
    },
  },
  integrations: [react(), sitemapConfig.enable ? sitemap() : null, mdx()],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [remarkParseContent],
    shikiConfig: { theme: "light-plus", wrap: false },
    extendDefaultPlugins: true,
  },
  vite: {
    plugins: [tailwindcss(), reloadOnTomlChange()],
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
