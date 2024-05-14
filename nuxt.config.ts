// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@vueuse/nuxt', '@nuxtjs/cloudinary', 'nuxt-headlessui', '@fixers/nuxt-stripe', 'nuxt-resend', '@vue-email/nuxt'],
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
      appUrl: process.env.APP_URL,
    },
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudApiKey: process.env.CLOUDINARY_API_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    stripeKey: process.env.STRIPE_API_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    resendApi: process.env.NUXT_RESEND_API_KEY,
  },
})