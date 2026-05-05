export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Merriweather: [700, 900],
      'JetBrains Mono': [400, 700]
    }
  }
})