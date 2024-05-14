<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice, formatDate } from "@/lib/utils";
import StatusDropdown from "@/components/StatusDropdown.vue";

const WEEKLY_GOAL = 500;
const MONTHLY_GOAL = 2500;

const isAdmin = await $fetch("/api/admin");

if (!isAdmin) navigateTo("/");

let orders = await $fetch("/api/orders/all");
const lastWeekSum = await $fetch("/api/orders/last-week-sum");
const lastMonthSum = await $fetch("/api/orders/last-month-sum");
</script>

<template>
  <div class="flex min-h-screen w-full bg-muted/40">
    <div class="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
      <div class="flex flex-col gap-16">
        <div class="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader class="pb-2">
              <CardDescription>Last Week</CardDescription>
              <CardTitle class="text-4xl">
                {{ formatPrice(lastWeekSum?._sum.amount ?? 0) }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-sm text-muted-foreground">
                of {{ formatPrice(WEEKLY_GOAL) }} goal
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                :model-value="
                  ((lastWeekSum?._sum.amount ?? 0) * 100) / WEEKLY_GOAL
                "
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader class="pb-2">
              <CardDescription>Last Month</CardDescription>
              <CardTitle class="text-4xl">
                {{ formatPrice(lastMonthSum?._sum.amount ?? 0) }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-sm text-muted-foreground">
                of {{ formatPrice(MONTHLY_GOAL) }} goal
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                :model-value="
                  ((lastMonthSum?._sum.amount ?? 0) * 100) / MONTHLY_GOAL
                "
              />
            </CardFooter>
          </Card>
        </div>

        <h1 class="text-4xl font-bold tracking-tight">Incoming orders</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead class="hidden sm:table-cell">Status</TableHead>
              <TableHead class="hidden sm:table-cell">
                Purchase date
              </TableHead>
              <TableHead class="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody v-if="orders">
            <TableRow v-for="order in orders" :key="order.id" class="bg-accent">
              <TableCell>
                <div class="font-medium">{{ order.shippingAddress?.name }}</div>
                <div class="hidden text-sm text-muted-foreground md:inline">
                  {{ order.user.email }}
                </div>
              </TableCell>
              <TableCell class="hidden sm:table-cell">
                <StatusDropdown :id="order.id" :orderStatus="order.status" />
              </TableCell>
              <TableCell class="hidden md:table-cell">
                {{ formatDate(order.createdAt) }}
              </TableCell>
              <TableCell class="text-right">
                {{ formatPrice(order.amount) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
