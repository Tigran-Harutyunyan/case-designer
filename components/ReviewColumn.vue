<script setup lang="ts">
interface Props {
  reviews: string[];
  msPerPixel?: number;
  reviewClassName?: string;
}
const { reviews, reviewClassName, msPerPixel = 0 } = defineProps<Props>();

const columnRef = ref<HTMLDivElement | null>(null);
const columnHeight = ref(0);
const duration = computed(() => {
  return `${columnHeight.value * msPerPixel}ms`;
});

let resizeObserver;

onMounted(() => {
  if (!columnRef.value) return;

  resizeObserver = new window.ResizeObserver(() => {
    columnHeight.value = columnRef.value?.offsetHeight ?? 0;
  });

  resizeObserver.observe(columnRef.value);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});
</script>

<template>
  <div
    ref="columnRef"
    class="animate-marquee space-y-8 py-4"
    :style="{ '--marquee-duration': duration }"
  >
    <Review
      v-for="(imgSrc, reviewIndex) in reviews.concat(reviews)"
      :key="reviewIndex"
      :class="reviewClassName?.(reviewIndex % reviews.length)"
      :imgSrc="imgSrc"
    />
  </div>
</template>
