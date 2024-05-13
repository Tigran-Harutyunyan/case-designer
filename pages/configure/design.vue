<script setup lang="ts">
const { showError } = useNotifications();
const route = useRoute();
const id = route.query?.id;

const isLoading = ref(true);

if (!id || typeof id !== "string") {
  showError({
    title: "Missing data",
    description: "Configuration id not found",
  });
  navigateTo("/configure/upload");
}

const configuration = await $fetch(`/api/config?id=${id}`);

if (!configuration) {
  showError({
    title: "Something went wrong",
    description: "Configuration is not found",
  });
  navigateTo("/configure/upload");
}

isLoading.value = false;

const { imageUrl, width, height } = configuration;
</script>

<template>
  <ConfigureLayout>
    <ClientOnly>
      <DesignConfigurator
        v-if="configuration.id"
        :configId="configuration.id"
        :imageDimensions="{ width, height }"
        :imageUrl="imageUrl"
      />
    </ClientOnly>
  </ConfigureLayout>
</template>
