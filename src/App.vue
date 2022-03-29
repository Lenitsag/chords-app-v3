<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { ROOTS, MODES, API_DOMAIN } from './config/constants'

const root = ref(ROOTS[4])
const modf = ref(MODES[0])
const bemolle = ref("")

const data = ref(null)
const isLoading = ref(false)
const error = ref(null)


const getChord = async () => {
  isLoading.value = true;

  const url = `${API_DOMAIN}/${root.value}${bemolle.value}_${modf.value}`;
  await axios.get(url)
  .then((res)=> {
    data.value = res.data
  })
  .catch(e => {
    error.value = e
  })

  isLoading.value = false
}

watch([root, modf, bemolle], () => {
  getChord()
})

onMounted(() => getChord())

</script>

<template>
  <main>
    <h1>Chord dictionary</h1>
    <div class="container">
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
    </div>

    <div v-if="!isLoading && data && data.length"> 
      <p>{{ data[0].strings }}</p>
    </div>
    <div v-else-if="isLoading"> Loading ... </div>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
main {
  padding: 20px;
  margin: 0 auto;
  text-align: center;
}
.container {
  padding: 8px;
}
</style>
