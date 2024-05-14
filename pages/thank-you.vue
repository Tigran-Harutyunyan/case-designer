<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
import { Loader2 } from "lucide-vue-next";
import { formatPrice } from "@/lib/utils";
const route = useRoute();
const orderId = route.query?.orderId;

const { showError } = useNotifications();
const data = ref();

onMounted(async () => {
  try {
    const response = await $fetch(`/api/payment-status?orderId=${orderId}`);

    if (!response) navigateTo("/");
    data.value = response;
  } catch (error: unknown) {
    showError({
      error,
    });
    navigateTo("/");
  }
});
</script>

<template>
  <div v-if="data === undefined" class="w-full mt-24 flex justify-center">
    <div class="flex flex-col items-center gap-2">
      <Loader2 class="h-8 w-8 animate-spin text-zinc-500" />
      <h3 class="font-semibold text-xl">Loading your order...</h3>
      <p>This won't take long.</p>
    </div>
  </div>
  <div v-if="data === false" class="w-full mt-24 flex justify-center">
    <div class="flex flex-col items-center gap-2">
      <Loader2 class="h-8 w-8 animate-spin text-zinc-500" />
      <h3 class="font-semibold text-xl">Verifying your payment...</h3>
      <p>This might take a moment.</p>
    </div>
  </div>

  <div v-if="data" class="bg-white">
    <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div class="max-w-xl">
        <p class="text-base font-medium text-primary">Thank you!</p>
        <h1 class="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Your case is on the way!
        </h1>
        <p class="mt-2 text-base text-zinc-500">
          We've received your order and are now processing it.
        </p>

        <div class="mt-12 text-sm font-medium">
          <p class="text-zinc-900">Order number</p>
          <p class="mt-2 text-zinc-500">{{ orderId }}</p>
        </div>
      </div>

      <div class="mt-10 border-t border-zinc-200">
        <div class="mt-10 flex flex-auto flex-col">
          <h4 class="font-semibold text-zinc-900">You made a great choice!</h4>
          <p class="mt-2 text-sm text-zinc-600">
            We at CaseCobra believe that a phone case doesn't only need to look
            good, but also last you for the years to come. We offer a 5-year
            print guarantee: If you case isn't of the highest quality, we'll
            replace it for free.
          </p>
        </div>
      </div>

      <div
        class="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl"
      >
        <PhonePreview
          :croppedImageUrl="data?.configuration.croppedImageUrl"
          :color="data?.configuration.color"
        />
      </div>

      <div>
        <div class="grid grid-cols-2 gap-x-6 py-10 text-sm">
          <div>
            <p class="font-medium text-gray-900">Shipping address</p>
            <div class="mt-2 text-zinc-700">
              <address class="not-italic">
                <span class="block">{{ data?.shippingAddress?.name }}</span>
                <span class="block">{{ data?.shippingAddress?.street }}</span>
                <span class="block">
                  {{ data?.shippingAddress?.postalCode }}
                  {{ data?.shippingAddress?.city }}
                </span>
              </address>
            </div>
          </div>
          <div>
            <p class="font-medium text-gray-900">Billing address</p>
            <div class="mt-2 text-zinc-700">
              <address class="not-italic">
                <span class="block">{{ data?.billingAddress?.name }}</span>
                <span class="block">{{ data?.billingAddress?.street }}</span>
                <span class="block">
                  {{ data?.billingAddress?.postalCode }}
                  {{ data?.billingAddress?.city }}
                </span>
              </address>
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm"
        >
          <div>
            <p class="font-medium text-zinc-900">Payment status</p>
            <p class="mt-2 text-zinc-700">Paid</p>
          </div>

          <div>
            <p class="font-medium text-zinc-900">Shipping Method</p>
            <p class="mt-2 text-zinc-700">DHL, takes up to 3 working days</p>
          </div>
        </div>
      </div>

      <div class="space-y-6 border-t border-zinc-200 pt-10 text-sm">
        <div class="flex justify-between">
          <p class="font-medium text-zinc-900">Subtotal</p>
          <p class="text-zinc-700">{{ formatPrice(data?.amount) }}</p>
        </div>
        <div class="flex justify-between">
          <p class="font-medium text-zinc-900">Shipping</p>
          <p class="text-zinc-700">{{ formatPrice(0) }}</p>
        </div>
        <div class="flex justify-between">
          <p class="font-medium text-zinc-900">Total</p>
          <p class="text-zinc-700">{{ formatPrice(data?.amount) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
