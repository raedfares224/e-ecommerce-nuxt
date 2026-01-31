export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@vite-pwa/nuxt",
  ],
  css: [
    "@/assets/css/tailwind.css",
    "vue-sonner/style.css",
    "@/assets/css/page-transitions.css",
  ],
  // nitro: {
  //   preset: "static",
  // },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "",
      stripePublishableKey:
        process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    },
  },
  app: {
    head: {
      title: "E Nuxt Store",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#111827" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "mobile-web-app-capable", content: "yes" },
      ],
      link: [
        { rel: "manifest", href: "/manifest.webmanifest" },
        // { rel: "icon", type: "image/png", href: "/favicon.ico" },
        // { rel: "apple-touch-icon", href: "/favicon.ico" },
      ],
    },
    pageTransition: {
      name: "slide-v-gentle",
      appear: true,
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: false,
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
    },
    client: {
      installPrompt: true,
    },
  },
  devtools: { enabled: true },
});
