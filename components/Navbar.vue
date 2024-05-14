<script setup lang="ts">
import { buttonVariants } from "./ui/button";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-vue-next";

import { useClerkProvide, SignOutButton } from "vue-clerk";
const { state } = useClerkProvide();

const isAdmin = await $fetch("/api/admin");
</script>

<template>
  <nav
    class="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all"
  >
    <MaxWidthWrapper>
      <div
        class="flex h-14 items-center justify-between border-b border-zinc-200"
      >
        <NuxtLink to="/" class="flex z-40 font-semibold">
          case<span class="text-green-600">cobra</span>
        </NuxtLink>

        <div class="h-full flex items-center space-x-4">
          <template v-if="state.user">
            <SignOutButton v-slot="{ handler }">
              <button
                class="cursor-pointer"
                :class="
                  buttonVariants({
                    size: 'sm',
                    variant: 'ghost',
                  })
                "
                @click="handler"
              >
                Sign out
              </button>
            </SignOutButton>

            <NuxtLink
              v-if="isAdmin"
              to="/dashboard"
              :class="
                buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })
              "
            >
              Dashboard ✨
            </NuxtLink>

            <NuxtLink
              to="/configure/upload"
              :class="
                buttonVariants({
                  size: 'sm',
                  class: 'hidden sm:flex items-center gap-1',
                })
              "
            >
              Create case
              <ArrowRight class="ml-1.5 h-5 w-5" />
            </NuxtLink>
          </template>

          <template v-else>
            <NuxtLink
              to="/sign-in"
              external
              :class="
                buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })
              "
            >
              Sign In
            </NuxtLink>

            <NuxtLink
              to="/sign-up"
              external
              :class="
                buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })
              "
            >
              Sign Up
            </NuxtLink>

            <div class="h-8 w-px bg-zinc-200 hidden sm:block" />

            <NuxtLink
              to="/configure/upload"
              :class="
                buttonVariants({
                  size: 'sm',
                  class: 'hidden sm:flex items-center gap-1',
                })
              "
            >
              Create case
              <ArrowRight class="ml-1.5 h-5 w-5" />
            </NuxtLink>
          </template>
        </div>
      </div>
    </MaxWidthWrapper>
  </nav>
</template>
