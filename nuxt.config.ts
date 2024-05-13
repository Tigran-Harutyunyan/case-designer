// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@vueuse/nuxt', '@nuxtjs/cloudinary', 'nuxt-headlessui'],
  build: {
    transpile: ['vue-clerk', '@clerk/clerk-js'],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudApiKey: process.env.CLOUDINARY_API_KEY,
    },
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudApiKey: process.env.CLOUDINARY_API_KEY,
  },

})