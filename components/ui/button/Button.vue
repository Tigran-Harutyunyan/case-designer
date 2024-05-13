<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonVariants, buttonVariants } from ".";
import { cn } from "@/lib/utils";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  isLoading?: boolean;
  loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <template v-if="isLoading && loadingText">
      {{ loadingText }}
    </template>
    <slot v-else />
    <span class="ml-1.5 flex items-center gap-1" v-if="isLoading">
      <span
        class="animate-flashing w-1 h-1 bg-white rounded-full inline-block"
      />
      <span
        class="animate-flashing delay-100 w-1 h-1 bg-white rounded-full inline-block"
      />
      <span
        class="animate-flashing delay-200 w-1 h-1 bg-white rounded-full inline-block"
      />
    </span>
  </Primitive>
</template>
