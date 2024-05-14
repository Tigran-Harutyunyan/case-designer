<script setup lang="ts">
import VueDraggableResizable from "vue-draggable-resizable";
import axios from "axios";
import { cn, formatPrice } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-vue-next";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from "@headlessui/vue";

import { BASE_PRICE } from "@/config/products";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const { configId, imageUrl, imageDimensions } =
  defineProps<DesignConfiguratorProps>();

const { showError } = useNotifications();

interface Ioptions {
  color: (typeof COLORS)[number];
  model: (typeof MODELS.options)[number];
  material: (typeof MATERIALS.options)[number];
  finish: (typeof FINISHES.options)[number];
}

const options = ref<Ioptions>({
  color: COLORS[0],
  model: MODELS.options[0],
  material: MATERIALS.options[0],
  finish: FINISHES.options[0],
});

const renderedDimension = ref({
  width: imageDimensions.width / 4,
  height: imageDimensions.height / 4,
});

const renderedPosition = ref({
  x: 150,
  y: 205,
});

const phoneCaseRef = ref(null);
const containerRef = ref(null);
const isPending = ref(false);

const draggableHeight = computed(() => {
  const devisor = imageDimensions.height < 2000 ? 4 : 8;
  return imageDimensions.height / devisor;
});

const draggableWidth = computed(() => {
  const devisor = imageDimensions.width < 2000 ? 4 : 8;
  return imageDimensions.width / devisor;
});

function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

async function saveConfig() {
  try {
    const {
      left: draggableLeft,
      top: draggableTop,
      height: draggableHeight,
      width: draggableWidth,
    } = document.querySelector(".draggable")!.getBoundingClientRect();

    const {
      left: caseLeft,
      top: caseTop,
      width,
      height,
    } = phoneCaseRef.value?.getBoundingClientRect();

    const { left: containerLeft, top: containerTop } =
      containerRef.value?.getBoundingClientRect();

    const leftOffset = caseLeft - containerLeft;
    const topOffset = caseTop - containerTop;

    renderedPosition.value.x = draggableLeft - containerLeft;
    renderedPosition.value.y = draggableTop - containerTop;

    renderedDimension.value.width = draggableWidth;
    renderedDimension.value.height = draggableHeight;

    const actualX = renderedPosition.value.x - leftOffset;
    const actualY = renderedPosition.value.y - topOffset;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const userImage = new Image();
    userImage.crossOrigin = "anonymous";
    userImage.src = imageUrl;
    await new Promise((resolve) => (userImage.onload = resolve));

    ctx?.drawImage(
      userImage,
      actualX,
      actualY,
      renderedDimension.value.width,
      renderedDimension.value.height
    );

    renderedPosition;

    const base64 = canvas.toDataURL();
    const base64Data = base64.split(",")[1];

    const blob = base64ToBlob(base64Data, "image/png");
    const file = new File([blob], "filename.png", { type: "image/png" });

    uploadToCloudinary(file);
  } catch (error: unknown) {
    showError({
      error,
    });
  }
}

const uploadToCloudinary = async (file: File) => {
  // Manually upload to cloudinary.
  // TODO: Move upload to server
  isPending.value = true;
  const CLOUD_API_KEY = useRuntimeConfig().public.cloudApiKey;
  const CLOUD_NAME = useRuntimeConfig().public.cloudName;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "uw-test");
  formData.append("api_key", CLOUD_API_KEY);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    const data = response.data;
    const fileURL = data.secure_url;

    saveToDatabase(fileURL);
  } catch (error: unknown) {
    showError({
      error,
    });
    isPending.value = false;
  }
};

const saveToDatabase = async (fileURL: string) => {
  isPending.value = true;
  try {
    const response = await $fetch("/api/upload", {
      method: "post",
      body: {
        configId: configId,
        url: fileURL,
        color: options.value.color.value,
        finish: options.value.finish.value,
        material: options.value.material.value,
        model: options.value.model.value,
      },
    });

    if (response && "configId" in response) {
      navigateTo(`/configure/preview?id=${response?.configId}`);
    }
  } catch (error: unknown) {
    showError({
      error,
    });
    isPending.value = false;
  }
};
</script>

<template>
  <div class="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
    <div
      ref="containerRef"
      class="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <div
        class="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831] mx-auto"
      >
        <AspectRatio
          :ratio="896 / 1831"
          class="pointer-events-none relative z-50 aspect-[896/1831] w-full"
        >
          <img
            ref="phoneCaseRef"
            fill
            alt="phone image"
            src="/phone-template.png"
            class="pointer-events-none z-50 select-none phone-case"
          />
        </AspectRatio>
        <div
          class="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]"
        />
        <div
          :class="
            cn(
              'absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]',
              `bg-${options.color.tw}`
            )
          "
        />
      </div>
      <vue-draggable-resizable
        :lock-aspect-ratio="true"
        :prevent-deactivation="true"
        :handles="['tl', 'tr', 'br', 'bl']"
        :h="draggableHeight"
        :w="draggableWidth"
      >
        <div class="relative">
          <img
            :src="imageUrl"
            fill
            alt="your image"
            class="pointer-events-none"
          />
        </div>
      </vue-draggable-resizable>
    </div>

    <div
      class="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white"
    >
      <ScrollArea class="relative flex-1 overflow-auto">
        <div
          aria-hidden="true"
          class="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
        />

        <div class="px-8 pb-12 pt-8">
          <h2 class="tracking-tight font-bold text-3xl">Customize your case</h2>

          <div class="w-full h-px bg-zinc-200 my-6" />

          <div class="relative mt-4 h-full flex flex-col justify-between">
            <div class="flex flex-col gap-6">
              <RadioGroup v-model="options.color">
                <Label>Color: {{ options.color.label }}</Label>
                <div class="mt-3 flex items-center space-x-3">
                  <RadioGroupOption
                    v-slot="{ checked, active }"
                    v-for="color in COLORS"
                    :key="color.label"
                    :value="color"
                  >
                    <li
                      :class="
                        cn(
                          'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                          {
                            [`border-${color.tw}`]: checked || active,
                          }
                        )
                      "
                    >
                      <span
                        :class="
                          cn(
                            `bg-${color.tw}`,
                            'h-8 w-8 rounded-full border border-black border-opacity-10'
                          )
                        "
                      />
                    </li>
                  </RadioGroupOption>
                </div>
              </RadioGroup>

              <div class="relative flex flex-col gap-3 w-full">
                <Label>Model</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="outline"
                      role="combobox"
                      class="w-full justify-between"
                    >
                      {{ options.model.label }}
                      <ChevronsUpDown
                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      v-for="model in MODELS.options"
                      :key="model.label"
                      :class="
                        cn(
                          'flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100',
                          {
                            'bg-zinc-100': model.label === options.model.label,
                          }
                        )
                      "
                      @click="options.model = model"
                    >
                      <Check
                        :class="
                          cn(
                            'mr-2 h-4 w-4',
                            model.label === options.model.label
                              ? 'opacity-100'
                              : 'opacity-0'
                          )
                        "
                      />
                      {{ model.label }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <RadioGroup
                v-for="{ name, options: selectableOptions } in [
                  MATERIALS,
                  FINISHES,
                ]"
                :key="name"
                v-model="options[name]"
                @onChange="(val) => (options[name] = val)"
              >
                <Label>
                  {{ name.slice(0, 1).toUpperCase() + name.slice(1) }}
                </Label>
                <div class="mt-3 space-y-4">
                  <RadioGroupOption
                    v-for="option in selectableOptions"
                    v-slot="{ active, checked }"
                    :key="option.value"
                    :value="option"
                  >
                    <li
                      :class="
                        cn(
                          'relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between',
                          {
                            'border-primary': checked || active,
                          }
                        )
                      "
                    >
                      <span class="flex items-center">
                        <span class="flex flex-col text-sm">
                          <RadioGroupLabel
                            class="font-medium text-gray-900"
                            as="span"
                          >
                            {{ option.label }}
                          </RadioGroupLabel>

                          <RadioGroupDescription
                            v-if="option.description"
                            as="span"
                            class="text-gray-500"
                          >
                            <span class="block sm:inline">
                              {{ option.description }}
                            </span>
                          </RadioGroupDescription>
                        </span>
                      </span>

                      <RadioGroupDescription
                        as="span"
                        class="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                      >
                        <span class="font-medium text-gray-900">
                          {{ formatPrice(option.price / 100) }}
                        </span>
                      </RadioGroupDescription>
                    </li>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div class="w-full px-8 h-16 bg-white">
        <div class="h-px w-full bg-zinc-200" />
        <div class="w-full h-full flex justify-end items-center">
          <div class="w-full flex gap-6 items-center">
            <p class="font-medium whitespace-nowrap">
              {{
                formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )
              }}
            </p>
            <Button
              :isLoading="isPending"
              :disabled="isPending"
              loadingText="Saving"
              @click="saveConfig()"
              size="sm"
              class="w-full"
            >
              Continue
              <ArrowRight class="h-4 w-4 ml-1.5 inline" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "vue-draggable-resizable/style.css";

.handle {
  @apply w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary;
  box-sizing: border-box;
  position: absolute;
  z-index: 10;
  background: #eee;
  border: 1px solid #333;
  display: block !important;
}

.draggable {
  border: 3px solid hsl(var(--primary));
  box-sizing: border-box;
}
</style>
