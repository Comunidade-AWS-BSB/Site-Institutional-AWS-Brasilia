<template>
    <div class="border rounded-xl overflow-hidden">
        <div class="divide-y">
            <div v-for="i in rows" :key="i" class="grid grid-cols-12 gap-4 p-4">
                <Skeleton class="col-span-5 h-4" />
                <Skeleton class="col-span-2 h-4 hidden md:block" />
                <Skeleton class="col-span-2 h-4 hidden md:block" />
                <Skeleton class="col-span-2 h-4 hidden md:block" />
                <Skeleton class="col-span-1 h-8 ml-auto" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
defineProps<{ rows?: number }>()
</script>
