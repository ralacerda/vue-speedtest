<script setup lang="ts">
import { ref } from "vue";

const url = "1000mb.bin";

const req = ref<XMLHttpRequest | null>();
const start = ref<Number | null>();
const progress = ref();
const result = ref();
const done = ref(false);
const avg = ref<{ download: any; upload: any }>({
  download: null,
  upload: null,
});
const binaryData = ref();
const decimals = ref(0);

function startTest() {
  testDownload();
}

function dec(num, deci) {
  const int = parseInt(num, 10);
  const flo = parseFloat((num % 1).toFixed(deci));
  const len = (String(flo).split(".")[1] || "").length;
  const diff = deci - len;
  let res = String(int + flo);

  if (!flo && diff) {
    res += ".";
    for (let i = 0; i < diff; i++) {
      res += "0";
    }
  }

  if (flo && diff > 0) {
    for (let i = 0; i < diff; i++) {
      res += "0";
    }
  }

  return res;
}

function testRunning(
  updown: "download" | "upload",
  progressEvent: ProgressEvent<EventTarget>
) {
  const now = Date.now();

  let percent = 0.0;
  let Bps = 0;
  avg.value[updown] = 0;
  let eta = 0;
  let total = progressEvent.total;
  let diff = 0;

  if (updown === "upload") {
    total = binaryData.value.size;
  }

  if (progressEvent.lengthComputable && total) {
    diff = (now - start.value) / 1000;
    Bps = progressEvent.loaded / diff;
    avg.value[updown] = (Bps / 1024 / 1024) * 8;
    percent = (progressEvent.loaded / total) * 100.0;
    eta = (total - progressEvent.loaded) / Bps;
  }

  if (updown === "upload") {
    percent = 100 - percent;
  }

  progress.value = percent + "%";
  result.value = dec(avg.value[updown], decimals) + " Mbit/s";
  // document.querySelector("#eta").innerHTML = dec(eta, decimals) + " sec";
}

function testDone() {
  binaryData.value = req.value?.response;
  req.value = null;
  progress.value = "0%";
}

function testDownload() {
  if (req.value) {
    req.value.abort();
  }

  req.value = new XMLHttpRequest();
  start.value = Date.now();

  req.value.onprogress = (requestProgress) => {
    // console.log(progress);
    // progress.value = requestProgress;
    testRunning("download", requestProgress);
  };

  req.value.onreadystatechange = () => {
    if (req.value?.readyState === 4) {
      console.log("Download is done");
      done.value = true;
      testDone();
    }
  };

  req.value.open("GET", url, true);
  req.value.responseType = "blob";
  req.value.send(null);
}
</script>

<template>
  <main>
    <button @click="startTest">Start speed test</button>
    <div>
      {{ result || "..." }}
    </div>
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
  width: v-bind(progress);
  background-color: #4caf50;
  text-align: center;
  line-height: 30px;
  color: white;
  font-weight: bold;
  transition: width 0.3s ease;
}
</style>
