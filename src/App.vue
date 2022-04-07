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
  top: (fingerPos === "X" || fingerPos === "0") ? 
  "-10px" : 
  `calc(${(fingerPos - currentShapeOffset.value) * 80}px - 50px)`,
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

onMounted(() => {
  const randomInteger = Math.floor(Math.random() * 7) + 1;
  document.body.classList.add("bg-" + randomInteger);
  getChordShapes();
});


const currentShape = computed(() => chordShapes.value[0]);
const currentShapeFingers = computed(() => currentShape.value?.strings.split(' '));
const currentShapeName = computed(() => currentShape.value?.chordName.replace(/,|\(|\)/g, ""));
const currentShapeOffset = computed(() => {
  let offset = 0;
  // Remove X from array to establish the highest finger position
  const numericalArray = currentShapeFingers.value.filter(finger => finger !== "X");
  const highestFinger = Math.max(...numericalArray);
  if (highestFinger > 4) {      
    offset = highestFinger - 4;
  }

  return offset;
})


//todo : handle card unchecking,add ESLint
//todo : move fretboard to component
//todo : use another API 
</script>

<template>
  <main>
    <h1>Chose your weapon !</h1>

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
          <figcaption class="chordName">
            This chord is called <strong>{{ currentShapeName }}</strong>
          </figcaption>
        </figure>
        
      </template>
      <p v-else>An error occured fetching chord data. Sorry !</p>
    </template>
  </main>
</template>

<style lang="scss">
// This wil generate background classes
@for $i from 1 through 7 {
  .bg-#{$i} {
    background-image: url(assets/bg-#{$i}.jpg);
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  position: relative;
}
body {
  font-family: Helvetica, sans-serif;
  background: no-repeat center center fixed #333;
  background-size: cover;
  font-size: 16px;
  color: #333;
  text-align: center;
}
a {
  color: #fff;
}

main {
  font-family: "Monserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 5vh auto;
  padding : 15px;
  max-width: 480px;
  height: 90vh;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 4px 4px 25px 0px rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);

}
footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 0.8em;
  text-align: center;
  padding: 10px;
  color: #fff
}
</style>

<style lang="scss" scoped>
.chord-selector {
  & > * {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
    
    .disabled {
      opacity: 0;
      pointer-events: none;
    }
  }
  .modf-selector {
    flex-wrap: wrap;
    & > * {
      font-size: 1em;
      width: 60px;
      height: 60px;
      line-height: 60px;
      
    }
  }
}

.card {
  margin: 5px;
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 50%;
  border: 1px solid #333;
  font-size: 1.5em;
  transition: all 0.25s ease;
  cursor: pointer;
  &.selected, &:hover {
    background-color:#333;
    color: #fff;
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
  max-width: 200px;
}

.xLine {
  border-top: 5px solid #333;
  display: flex;
  flex-direction: column;
  &:last-child {
    border-top: 0;
    .fret {
      border: 0;
      border-left: 1px solid #333;
      
    }
  }
  &:first-child {
    .fret {
      border-left: 2px solid #333;
     
    }
  }
}

.fret {
  height: 80px;
  width: 40px;
  border: 1px solid #333;
  &:last-child {
    border-bottom: 2px solid #333;
  }
  //todo : mettre une texture
  // background-color:#ccc;
}

.fingerPos {
  top: 0;
  left: 0;
  position: absolute;
  background: #333;
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

.chordName {
  margin: 15px 0;
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
