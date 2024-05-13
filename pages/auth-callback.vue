<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { useClerk } from "vue-clerk";

const configId = ref(null);
const clerk = useClerk();

onMounted(() => {
  const configurationId = localStorage.getItem("configurationId");
  if (configurationId) configId.value = configurationId;
  if (clerk.user) {
    if (configId.value) {
      localStorage.removeItem("configurationId");
      navigateTo(`/configure/preview?id=${configId.value}`);
    } else {
      navigateTo("/");
    }
  } else {
    navigateTo("/");
  }
});
</script>

<template>
  <div class="w-full mt-24 flex justify-center">
    <div class="flex flex-col items-center gap-2">
      <Loader2 class="h-8 w-8 animate-spin text-zinc-500" />
      <h3 class="font-semibold text-xl">Logging you in...</h3>
      <p>You will be redirected automatically.</p>
    </div>
  </div>
</template>
