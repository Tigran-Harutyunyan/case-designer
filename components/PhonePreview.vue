<script setup lang="ts">
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface Props {
  croppedImageUrl: string;
  color: string;
}

const { croppedImageUrl, color } = defineProps<Props>();

const refElement = ref(null);

const renderedDimensions = ref({
  height: 0,
  width: 0,
});

const caseBackgroundColor = computed(() => {
  let caseBackgroundColor = "bg-zinc-950";
  if (color === "blue") caseBackgroundColor = "bg-blue-950";
  if (color === "rose") caseBackgroundColor = "bg-rose-950";

  return caseBackgroundColor;
});

const handleResize = () => {
  if (!refElement.value) return;
  const { width, height } = refElement.value.getBoundingClientRect();
  renderedDimensions.value = { width, height };
};

onMounted(() => {
  handleResize();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <AspectRatio :ratio="3000 / 2001" class="relative">
    <div
      ref="refElement"
      class="absolute z-20 scale-[1.0352]"
      :style="{
        left:
          renderedDimensions.width / 2 -
          renderedDimensions.width / (1216 / 121),
        top: renderedDimensions.height / 6.22,
      }"
    >
      <img
        :width="renderedDimensions.width / (3000 / 637)"
        :class="
          cn(
            'phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]',
            caseBackgroundColor
          )
        "
        :src="croppedImageUrl"
      />
    </div>

    <div class="relative h-full w-full z-40">
      <img
        alt="phone"
        src="/clearphone.png"
        class="pointer-events-none h-full w-full antialiased rounded-md"
      />
    </div>
  </AspectRatio>
</template>

<style lang="scss" scoped></style>
