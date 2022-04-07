<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { ROOTS, MODES, API_DOMAIN } from "./constants/constants";

const root = ref(ROOTS[0]);
const modf = ref("");
const bemolle = ref("");

const chordShapes = ref(null);
const isLoading = ref(false);
const error = ref(null);

const getChordStyle = (fingerPos, stringIndex) => ({
  top: (fingerPos === "X" || fingerPos === "0") ? "-50px" : `calc(${(fingerPos - currentShapeOffset.value) * 80}px - 50px)`,
  left:  `calc(${stringIndex*40}px - 16px)`,
  animationDelay: `${stringIndex * 0.1}s`
})

const getChordShapes = async () => {
  isLoading.value = true;

  const url = `${API_DOMAIN}/${root.value}${bemolle.value}_${modf.value}`;
  await axios
    .get(url)
    .then((res) => {
      chordShapes.value = res.data;
    })
    .catch((e) => {
      error.value = e;
    });

  isLoading.value = false;
};

watch([root, modf, bemolle], () => {
  if (
    (bemolle.value === "%23" && (root.value === "B" || root.value === "E")) ||
    (bemolle.value === "b" && (root.value === "C" || root.value === "F"))
  ) {
    bemolle.value = "";
  }
  getChordShapes();
});

onMounted(() => getChordShapes());


const currentShape = computed(() => chordShapes.value[0]);
const currentShapeFingers = computed(() => currentShape.value?.strings.split(' '));
const currentShapeName = computed(() => currentShape.value?.chordName.replace(/,|\(|\)/g, ""));
const currentShapeOffset = computed(() => {
  let offset = 0;
  let highestFinger = 0;
  currentShapeFingers.value.forEach(finger => {
    if (finger !== "X" && finger > highestFinger && finger > 4) {
      highestFinger = finger;
      offset = finger - 4;
      console.log("offset is " + offset);
    }
    
  })

  return offset;
})


//todo : handle card unchecking, improve UI, add visuals, add ESLint
//todo : fix F#dim offset???
</script>

<template>
  <main>
    <h1>Guitar Chord Dictionary</h1>

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
      <template v-if="chordShapes?.length">
        <figure class="chordShape">
          <figcaption>
            {{ currentShapeName }}
          </figcaption>
          <div class="fretboard">
            <div class="xLine"  v-for="(Line, lineIndex) in 6">
             <div 
              class="fingerPos" 
              :style="getChordStyle(currentShapeFingers[lineIndex], lineIndex)" 
             >
                  {{currentShapeFingers[lineIndex]}}
              </div>
              <div class="fret" v-for="(fret, fretIndex) in 4" />
            </div>
          </div>
          
        </figure>
        
      </template>
      <p v-else>An error occured fetching chord data. Sorry !</p>
    </template>

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
  height: 40px;
  line-height: 40px;
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

.chord-visual {
  margin: 0 auto;
}

.fretboard {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  margin-top: 4rem;
  position: relative;
  max-width: 220px;
}

.xLine {
  border-top: 5px solid black;
  display: flex;
  flex-direction: column;

  &:last-child {
    border-top: 0;

    .fret {
      border: 0;
      background-color: transparent;
    }
  }
}

.fret {
  height: 80px;
  width: 40px;
  border: 1px solid black;
  //todo : mettre une texture
  background-color: rgb(0, 0, 0,0.2);
}

.fingerPos {
  top: 0;
  left: 0;
  position: absolute;
  background: black;
  color: white;
  border-radius: 50%;
  padding: 1rem;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  opacity: 0;
  transform: translateY(-30px);
  animation: fadeIn 0.15s 0s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
