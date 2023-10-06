<script setup lang="ts">
import { ref, computed } from "vue";
import { testDownload } from "./networkTest";

const url = "1000mb.bin";
const progress = ref();
const average = ref();

async function startTest() {
  await testDownload(url, (requestAverage, requestProgress) => {
    progress.value = requestProgress;
    average.value = requestAverage;
  });
}

const progressPercentage = computed(() => {
  return progress.value ? progress.value?.toFixed() + "%" : "0%";
});
</script>

<template>
  <main>
    <button @click="startTest">Download Test</button>

    <div>Download Average {{ average?.toFixed() || "..." }}</div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  </main>
</template>

<style>
main > * + * {
  margin-top: 1.5rem;
}

.progress-bar-container {
  width: 80%;
  margin-inline: auto;
  background-color: #f3f3f3;
  border: 1px solid #ccc;
  height: 30px;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 100%;
  transform-origin: 0%;
  scale: v-bind(progressPercentage) 1;
  background-color: #4caf50;
  text-align: center;
  line-height: 30px;
  color: white;
  font-weight: bold;
}
</style>
