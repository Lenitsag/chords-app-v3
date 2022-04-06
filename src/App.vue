<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { ROOTS, MODES, API_DOMAIN } from "./constants/constants";

const root = ref(ROOTS[4]);
const modf = ref(MODES[0]);
const bemolle = ref("");

const chordData = ref(null);
const isLoading = ref(false);
const error = ref(null);

const getChord = async () => {
  isLoading.value = true;

  const url = `${API_DOMAIN}/${root.value}${bemolle.value}_${modf.value}`;
  await axios
    .get(url)
    .then((res) => {
      chordData.value = res.data;
    })
    .catch((e) => {
      error.value = e;
    });

  isLoading.value = false;
};

watch([root, modf, bemolle], () => {
  getChord();
});

onMounted(() => getChord());
</script>

<template>
  <main>
    <h1>Guitar Chord Dictionary</h1>
    <!-- <div class="chord-selector">
      <select v-model="root">
        <option v-for="root in ROOTS" :value="root">{{ root }}</option>
      </select>
      <select v-model="bemolle">
        <option value="" ></option>
        <option value="b" v-if="
          root !== 'C' && 
          root !== 'F'">♭</option>
        <option value="%23" v-if="
          root !== 'B' && 
          root !== 'E'">♯</option>
      </select>
      <select v-model="modf">
        <option v-for="mode in MODES" :value="mode">{{ mode ? mode  : "maj" }}</option>
      </select>
    </div> -->

    <div class="chord-selector">
      <div class="root-selector">
        <div
          class="card"
          @click="root = rootNote"
          :class="{ selected: rootNote === root }"
          v-for="rootNote in ROOTS"
        >
          {{ rootNote }}
        </div>
      </div>
      <div class="bemolle-selector">
        <div
          class="card"
          @click="bemolle = 'b'"
          :class="{
            disabled: root == 'C' || root == 'F',
            selected: bemolle === 'b',
          }"
        >
          ♭
        </div>
        <div
          class="card"
          @click="bemolle = '%23'"
          :class="{
            disabled: root === 'B' || root === 'E',
            selected: bemolle === '%23',
          }"
        >
          ♯
        </div>
      </div>
      <div class="modf-selector">
        <div
          class="card"
          @click="modf = mode"
          :class="{ selected: mode === modf }"
          v-for="mode in MODES"
        >
          {{ mode }}
        </div>
      </div>
    </div>

    <template v-if="!isLoading">
      <template v-if="chordData?.length">
        <h2>Here is your chord</h2>
        <p>{{ chordData[0].strings }}</p>
      </template>
      <p v-else>An error occured fetching chord data. Sorry !</p>
    </template>
    <p v-else>⌚</p>

    <footer>
      <p>
        Powered by
        <a
          href="https://api.uberchord.com/"
          target="_blank"
          rel="noopener noreferrer"
          >Uberchord API</a
        >
        and
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"
          >Vue.js</a
        >
      </p>
    </footer>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-size: 16px;
  font-family: Helvetica, sans-serif;
}
p {
  margin: 10px 0;
}
main {
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}
footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 0.8em;
}
</style>

<style lang="scss" scoped>
.chord-selector {
  .root-selector {
    display: flex;
    align-items: center;
    padding: 15px 0;
    & > * {
      flex: 1;
    }
  }
  .bemolle-selector {
    font-size: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    & > * {
      width: 15%;
      margin: 0 5px;
      border-radius: 8px;
      border: 1px solid #ccc;
    }
    .disabled {
      opacity: 0;
      pointer-events: none;
    }
  }
  .modf-selector {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    & > * {
      margin: 15px 0;
      width: 100px;
    }
  }
}

.card {
  margin: 0 5px;
  height: 45px;
  line-height: 45px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: #ccc 3px 3px 3px;
  font-size: 1.5em;
  transition: all 0.25s ease;
  cursor: pointer;
  &.selected {
    box-shadow: none;
  }
}
</style>
