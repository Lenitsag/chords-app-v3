<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { ROOT_NOTES, COLORS, API_DOMAIN } from "./constants/constants";

const currentRootNote = ref("");
const currentColor = ref("");
const currentAlteration = ref("");

const chordShapes = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Todo : mettre 80px dans une variable
const getChordStyle = (fingerPos, stringIndex) => ({
  top:
    fingerPos === "X" || fingerPos === "0"
      ? "-10px"
      : `calc(${(fingerPos - currentShapeOffset.value) * 80}px - 50px)`,
  left: `calc(${stringIndex * 40}px - 16px)`,
  animationDelay: `${stringIndex * 0.1}s`,
});

const handleClickRoot = (rootNote) => {
  currentAlteration.value = "";
  currentColor.value = "";

  if (currentRootNote.value && rootNote.label === currentRootNote.value.label) {
    currentRootNote.value = null;
    return;
  }
  currentRootNote.value = rootNote;
};

const handleClickAlteration = (alt) => {
  currentColor.value = "";
  if (currentAlteration.value.label === alt.label) {
    currentAlteration.value = "";
    return;
  }
  currentAlteration.value = alt;
};

const handleClickColor = (color) => {
  if (currentColor.value && color === currentColor.value) {
    currentColor.value = "";
    return;
  }
  currentColor.value = color;
};

const getChordShapes = async () => {
  // todo : move this in external api helper
  isLoading.value = true;

  const alteration = currentAlteration.value
    ? currentAlteration.value.value
    : "";

  if (!currentRootNote.value) return;

  const url = `${API_DOMAIN}/${currentRootNote.value.label}${alteration}_${currentColor.value}`;
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

watch([currentRootNote, currentColor, currentAlteration], (value) => {
  getChordShapes();
});

onMounted(() => {
  const randomInteger = Math.floor(Math.random() * 7) + 1;
  document.body.classList.add("bg-" + randomInteger);
  getChordShapes();
});

const currentShape = computed(() => chordShapes.value[0]);
const currentShapeFingers = computed(() =>
  currentShape.value?.strings.split(" ")
);
const currentShapeName = computed(() =>
  currentShape.value?.chordName.replace(/,|\(|\)/g, "")
);
const currentShapeOffset = computed(() => {
  let offset = 0;
  // Remove X from array to establish the highest finger position
  const numericalArray = currentShapeFingers.value.filter(
    (finger) => finger !== "X"
  );
  const highestFinger = Math.max(...numericalArray);
  if (highestFinger > 4) {
    offset = highestFinger - 4;
  }

  return offset;
});

//todo : add ESLint
//todo : move fretboard to component
//todo : use another API
</script>

<template>
  <main>
    <h1>Pick a root note</h1>

    <div class="chord-selector">
      <div class="root-selector">
        <div
          class="card"
          v-for="rootNote in ROOT_NOTES"
          :class="{ selected: currentRootNote?.label === rootNote.label }"
          @click="handleClickRoot(rootNote)"
        >
          {{ rootNote.label }}
        </div>
      </div>
      <div class="alteration-selector" v-if="currentRootNote">
        <div
          class="card"
          v-for="alt in currentRootNote.alt"
          :class="{ selected: currentAlteration.value === alt.value }"
          @click="handleClickAlteration(alt)"
        >
          {{ alt.label }}
        </div>
      </div>
      <div class="color-selector" v-if="currentRootNote">
        <div
          class="card"
          @click="handleClickColor(color)"
          :class="{ selected: currentColor === color }"
          v-for="color in COLORS"
        >
          {{ color }}
        </div>
      </div>
    </div>

    <template v-if="!isLoading">
      <template v-if="chordShapes?.length">
        <figure class="chordShape">
          <div class="fretboard">
            <div class="xLine" v-for="(Line, lineIndex) in 6">
              <div
                class="fingerPos"
                :style="
                  getChordStyle(currentShapeFingers[lineIndex], lineIndex)
                "
              >
                {{ currentShapeFingers[lineIndex] }}
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
  padding: 15px;
  max-width: 480px;
  width: calc(100% - 40px);
  height: 90vh;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
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
  color: #fff;
}
</style>

<style lang="scss" scoped>
h1 {
  padding: 10px 0;
}
.chord-selector {
  & > * {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin: 15px 0;

    .disabled {
      opacity: 0;
      pointer-events: none;
    }
  }
  .color-selector {
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
  &.selected {
    background-color: #333;
    color: #fff;
  }
  &:hover {
    transition: all 0.1s ease;
    transform: scale(1.2);
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
