<script setup lang="ts">
import { cn } from "@/lib/utils";
const route = useRoute();

const steps = [
  {
    name: "Step 1: Add image",
    description: "Choose an image for your case",
    url: "/upload",
    route: "configure-upload",
  },
  {
    name: "Step 2: Customize design",
    description: "Make the case yours",
    url: "/design",
    route: "configure-design",
  },
  {
    name: "Step 3: Summary",
    description: "Review your final design",
    url: "/preview",
    route: "configure-preview",
  },
];

const computedSteps = computed(() => {
  return steps.map((item, i) => {
    const isCurrent = route.name === item.route;
    const isCompleted = steps
      .slice(i + 1)
      .some((step) => route.name === step.route);
    return {
      ...item,
      isCurrent,
      isCompleted,
    };
  });
});
</script>

<template>
  <ol
    class="rounded-md bg-white lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
  >
    <li
      v-for="(step, i) in computedSteps"
      :key="step.name"
      class="relative overflow-hidden lg:flex-1"
    >
      <div>
        <span
          :class="
            cn(
              'absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full',
              {
                'bg-zinc-700': step.isCurrent,
                'bg-primary': step.isCompleted,
              }
            )
          "
          aria-hidden="true"
        />

        <span
          :class="
            cn(
              i !== 0 ? 'lg:pl-9' : '',
              'flex items-center px-6 py-4 text-sm font-medium'
            )
          "
        >
          <span class="flex-shrink-0">
            <img
              :src="`/snake-${i + 1}.png`"
              :class="
                cn(
                  'flex h-20 w-20 object-contain items-center justify-center',
                  {
                    'border-none': step.isCompleted,
                    'border-zinc-700': step.isCurrent,
                  }
                )
              "
            />
          </span>

          <span class="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
            <span
              :class="
                cn('text-sm font-semibold text-zinc-700', {
                  'text-primary': step.isCompleted,
                  'text-zinc-700': step.isCurrent,
                })
              "
            >
              {{ step.name }}
            </span>
            <span class="text-sm text-zinc-500">
              {{ step.description }}
            </span>
          </span>
        </span>

        <div v-if="i !== 0" class="absolute inset-0 hidden w-3 lg:block">
          <svg
            class="h-full w-full text-gray-300"
            viewBox="0 0 12 82"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0.5 0V31L10.5 41L0.5 51V82"
              stroke="currentcolor"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </li>
  </ol>
</template>
