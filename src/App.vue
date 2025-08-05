<template>
  <div id="app">
    <div class="min-h-screen bg-background">
      <TheHeader />
      <main>
        <router-view />
      </main>
      <TheFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/shared/TheHeader.vue'
import TheFooter from '@/components/shared/TheFooter.vue'
</script>

<style></style>
