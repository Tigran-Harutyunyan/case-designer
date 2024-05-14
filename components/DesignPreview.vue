<script setup lang="ts">
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { COLORS, MODELS } from "@/validators/option-validator";
import { ArrowRight, Check } from "lucide-vue-next";
import ConfettiExplosion from "vue-confetti-explosion";
import { useClerk } from "vue-clerk";
const { showError } = useNotifications();

const { configuration } = defineProps<{
  configuration: {
    color: string;
    model: string;
    finish: string;
    material: string;
    croppedImageUrl: string;
  };
  id: string;
}>();

const { color, model, finish, id, material, croppedImageUrl } = configuration;

const clerk = useClerk();

const isLoginModalOpen = ref(false);

let totalPrice = computed(() => {
  let price = BASE_PRICE;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  return price;
});

const tw = computed(() => {
  return COLORS.find((supportedColor) => supportedColor.value === color)?.tw;
});

const modelLabel = computed(() => {
  return MODELS.options.find(({ value }) => value === model)?.label;
});

const handleCheckout = async () => {
  if (clerk.user) {
    // create payment session

    try {
      const response = await $fetch("/api/checkout-session", {
        method: "post",
        body: {
          configId: id,
        },
      });
      if (response && typeof response === "object" && "url" in response) {
        window.location.href = response.url as string;
      }
    } catch (error) {
      showError({
        error,
      });
    }
  } else {
    // need to log in
    localStorage.setItem("configurationId", id);
    isLoginModalOpen.value = true;
  }
};
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
  >
    <ClientOnly>
      <div class="flex justify-center">
        <ConfettiExplosion :particleCount="200" :force="0.3" />
      </div>
    </ClientOnly>
  </div>

  <LoginModal :isOpen="isLoginModalOpen" @close="isLoginModalOpen = false" />

  <div
    class="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12"
  >
    <div class="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
      <Phone
        :class="cn(`bg-${tw}`, 'max-w-[150px] md:max-w-full')"
        :imgSrc="croppedImageUrl"
      />
    </div>

    <div class="mt-6 sm:col-span-9 md:row-end-1">
      <h3 class="text-3xl font-bold tracking-tight text-gray-900">
        Your {{ modelLabel }} Case
      </h3>
      <div class="mt-3 flex items-center gap-1.5 text-base">
        <Check class="h-4 w-4 text-green-500" />
        In stock and ready to ship
      </div>
    </div>

    <div class="sm:col-span-12 md:col-span-9 text-base">
      <div
        class="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10"
      >
        <div>
          <p class="font-medium text-zinc-950">Highlights</p>
          <ol class="mt-3 text-zinc-700 list-disc list-inside">
            <li>Wireless charging compatible</li>
            <li>TPU shock absorption</li>
            <li>Packaging made from recycled materials</li>
            <li>5 year print warranty</li>
          </ol>
        </div>
        <div>
          <p class="font-medium text-zinc-950">Materials</p>
          <ol class="mt-3 text-zinc-700 list-disc list-inside">
            <li>High-quality, durable material</li>
            <li>Scratch- and fingerprint resistant coating</li>
          </ol>
        </div>
      </div>

      <div class="mt-8">
        <div class="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
          <div class="flow-root text-sm">
            <div class="flex items-center justify-between py-1 mt-2">
              <p class="text-gray-600">Base price</p>
              <p class="font-medium text-gray-900">
                {{ formatPrice(BASE_PRICE / 100) }}
              </p>
            </div>

            <div
              v-if="finish === 'textured'"
              class="flex items-center justify-between py-1 mt-2"
            >
              <p class="text-gray-600">Textured finish</p>
              <p class="font-medium text-gray-900">
                {{ formatPrice(PRODUCT_PRICES.finish.textured / 100) }}
              </p>
            </div>

            <div
              v-if="material === 'polycarbonate'"
              class="flex items-center justify-between py-1 mt-2"
            >
              <p class="text-gray-600">Soft polycarbonate material</p>
              <p class="font-medium text-gray-900">
                {{ formatPrice(PRODUCT_PRICES.material.polycarbonate / 100) }}
              </p>
            </div>

            <div class="my-2 h-px bg-gray-200" />

            <div class="flex items-center justify-between py-2">
              <p class="font-semibold text-gray-900">Order total</p>
              <p class="font-semibold text-gray-900">
                {{ formatPrice(totalPrice / 100) }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end pb-12">
          <Button @click="handleCheckout()" class="px-4 sm:px-6 lg:px-8">
            Check out <ArrowRight class="h-4 w-4 ml-1.5 inline" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
