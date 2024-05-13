<script setup lang="ts">
import { SignUp } from "vue-clerk";
useHead({
  title: "Sign up",
});
definePageMeta({
  layout: "auth",
  title: "Sign-up",
});
</script>

<template>
  <div class="grid h-full place-items-center">
    <SignUp
      sign-in-url="/sign-in"
      afterSignUpUrl="/auth-callback"
      :appearance="{
        variables: { colorPrimary: '#16a34a' },
      }"
    />
  </div>
</template>
