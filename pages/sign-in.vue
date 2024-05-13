<script setup lang="ts">
import { SignIn } from "vue-clerk";
useHead({
  title: "Sign-in",
});
definePageMeta({
  title: "Sign-in",
  layout: "auth",
});
</script>

<template>
  <div class="grid h-full place-items-center">
    <SignIn
      sign-up-url="/sign-up"
      afterSignInUrl="/auth-callback"
      :appearance="{
        variables: { colorPrimary: '#16a34a' },
      }"
    />
  </div>
</template>
