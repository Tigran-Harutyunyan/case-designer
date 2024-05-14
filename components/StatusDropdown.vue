<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-vue-next";

const LABEL_MAP = {
  awaiting_shipment: "Awaiting Shipment",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
};

const { id, orderStatus } = defineProps<{
  id: string;
  orderStatus: string;
}>();

let localStatus = ref(orderStatus);

const changeStatus = async (status: string) => {
  const payload = {
    id: id,
    newStatus: status,
  };
  await $fetch("/api/order/status", {
    method: "POST",
    body: payload,
  });
  localStatus.value = status;
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="w-52 flex justify-between items-center">
        {{ LABEL_MAP[localStatus] }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="p-0">
      <DropdownMenuItem
        v-for="status in Object.keys(LABEL_MAP)"
        :key="status"
        @click="changeStatus(status)"
        :class="
          cn(
            'flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100',
            {
              'bg-zinc-100': localStatus === status,
            }
          )
        "
      >
        <Check
          :class="
            cn(
              'mr-2 h-4 w-4 text-primary',
              localStatus === status ? 'opacity-100' : 'opacity-0'
            )
          "
        />
        {{ LABEL_MAP[status] }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
