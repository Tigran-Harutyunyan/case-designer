<script setup lang="ts">
const containerRef = ref<HTMLDivElement | null>(null);
const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];

const columns = splitArray(PHONES, 3);
const column1 = columns[0];
const column2 = columns[1];
const column3 = splitArray(columns[2], 2);

const reviews = {
  1: [...column1, ...column3.flat(), ...column2],
  2: [...column2, ...column3[1]],
  3: column3.flat(),
};

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }

  return result;
}
</script>

<template>
  <div
    ref="containerRef"
    class="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
  >
    <ReviewColumn :reviews="reviews[1]" :msPerPixel="10" />
    <ReviewColumn
      :reviews="reviews[2]"
      class="hidden md:block"
      :msPerPixel="15"
    />
    <ReviewColumn
      :reviews="reviews[3]"
      class="hidden md:block"
      :msPerPixel="10"
    />
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100"
    />
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100"
    />
  </div>
</template>
