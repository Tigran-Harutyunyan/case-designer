<script setup lang="ts">
const { showError } = useNotifications();

const route = useRoute();
const id = route.query?.id;

if (!id || typeof id !== "string") {
  showError({
    title: "Missing data",
    description: "Configuration id not found",
  });
  navigateTo("/configure/upload");
}

const configuration = await $fetch(`/api/config?id=${id}`);
</script>

<template>
  <ConfigureLayout>
    <ClientOnly>
      <DesignPreview :configuration="configuration" :id="id" />
    </ClientOnly>
  </ConfigureLayout>
</template>
