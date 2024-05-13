<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
}
const props = defineProps<Props>();

const { isOpen } = toRefs(props);

const isModalOpen = computed(() => {
  return isOpen.value;
});

const emit = defineEmits(["close"]);
</script>

<template>
  <Dialog v-model:open="isModalOpen" @update:open="emit('close')">
    <DialogContent class="absolute z-[9999999]">
      <DialogHeader>
        <div class="relative mx-auto w-24 h-24 mb-2">
          <img src="/snake-1.png" alt="snake image" class="object-contain" />
        </div>
        <DialogTitle
          class="text-3xl text-center font-bold tracking-tight text-gray-900 mt-6"
        >
          Log in to continue
        </DialogTitle>
        <DialogDescription class="text-base text-center py-2">
          <span class="font-medium text-zinc-900">
            Your configuration was saved! </span
          >Please login or create an account to complete your purchase.
        </DialogDescription>
      </DialogHeader>

      <div class="grid grid-cols-2 gap-6 divide-x divide-gray-200">
        <NuxtLink :class="buttonVariants({ variant: 'outline' })" to="/sign-in">
          Login
        </NuxtLink>
        <NuxtLink :class="buttonVariants({ variant: 'default' })" to="/sign-up">
          Sign up
        </NuxtLink>
      </div>
    </DialogContent>
  </Dialog>
</template>
