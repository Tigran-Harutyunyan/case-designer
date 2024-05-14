<script setup lang="ts">
import { Image, Loader2 } from "lucide-vue-next";
const { showError } = useNotifications();
const isUploading = ref(false);
const uploadTest = ref("uw-test");

interface SuccessResponse {
  value: {
    event: "success";
    info: {
      secure_url: string;
    };
  };
}

interface ErrorResponse {
  value: {
    event: "error";
    error: {
      message: string;
    };
  };
}

type Response = SuccessResponse | ErrorResponse;

const handleUpload = async (res: Response) => {
  if (res.value.event === "success") {
    isUploading.value = true;

    try {
      const response = await $fetch("/api/upload", {
        method: "post",
        body: {
          url: res.value?.info?.secure_url,
          configId: useRoute().query?.id,
        },
      });

      if (response && "configId" in response) {
        navigateTo(`/configure/design?id=${response?.configId}`);
      }
    } catch (error: unknown) {
      showError({
        error,
      });
      isUploading.value = false;
    }
  }
};
</script>

<template>
  <ConfigureLayout>
    <div
      class="relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center"
    >
      <div
        class="relative flex flex-1 flex-col items-center justify-center w-full cursor-pointer"
      >
        <ClientOnly>
          <div
            class="space-y-4 w-full flex flex-col justify-center items-center"
          >
            <CldUploadWidget
              v-slot="{ open }"
              :uploadPreset="uploadTest"
              :options="{
                maxFiles: 1,
                clientAllowedFormats: ['image'],
                resourceType: 'image',
              }"
              @upload="handleUpload"
              @onQueuesStart="isUploading = true"
            >
              <div
                @click="open"
                class="h-full w-full flex-1 flex flex-col items-center justify-center"
              >
                <Loader2
                  v-if="isUploading"
                  class="animate-spin h-6 w-6 text-zinc-500 mb-2"
                />
                <Image v-else class="h-6 w-6 text-zinc-500 mb-2" />

                <div
                  class="flex flex-col justify-center mb-2 text-sm text-zinc-700"
                >
                  <div v-if="isUploading" class="flex flex-col items-center">
                    <p>Uploading...</p>
                  </div>

                  <p v-else>
                    <input type="file" class="hidden" />
                    <span class="font-semibold">Click to upload</span>
                  </p>
                </div>

                <p v-if="!isUploading" class="text-xs text-zinc-500">
                  PNG, JPG, JPEG
                </p>
              </div>
            </CldUploadWidget>
          </div>
        </ClientOnly>
      </div>
    </div>
  </ConfigureLayout>
</template>
