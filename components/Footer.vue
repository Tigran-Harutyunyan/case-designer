<template>
  <footer class="bg-white h-20 relative">
    <MaxWidthWrapper>
      <div class="border-t border-gray-200" />

      <div
        class="h-full flex flex-col md:flex-row md:justify-between justify-center items-center"
      >
        <div class="text-center md:text-left pb-2 md:pb-0">
          <p class="text-sm text-muted-foreground">
            &copy; {{ new Date().getFullYear() }} All rights reserved
          </p>
        </div>

        <div class="flex items-center justify-center">
          <div class="flex space-x-8">
            <NuxtLink
              to="#"
              class="text-sm text-muted-foreground hover:text-gray-600"
            >
              Terms
            </NuxtLink>
            <NuxtLink
              to="#"
              class="text-sm text-muted-foreground hover:text-gray-600"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="#"
              class="text-sm text-muted-foreground hover:text-gray-600"
            >
              Cookie Policy
            </NuxtLink>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  </footer>
</template>
