export const API_DOMAIN = "https://api.uberchord.com/v1/chords";
export const ROOTS = ["A", "B", "C", "D", "E", "F", "G"];
export const ALTERATIONS = {
  bemolle: {
    label: "♭",
    value: "b",
  },
  sharp: {
    label: "♯",
    value: "%23",
  },
};
export const ROOT_NOTES = [
  {
    label: "A",
    alt: [ALTERATIONS.bemolle, ALTERATIONS.sharp],
  },
  {
    label: "B",
    alt: [ALTERATIONS.bemolle],
  },
  {
    label: "C",
    alt: [ALTERATIONS.sharp],
  },
  {
    label: "D",
    alt: [ALTERATIONS.bemolle, ALTERATIONS.sharp],
  },
  {
    label: "E",
    alt: [ALTERATIONS.bemolle],
  },
  {
    label: "F",
    alt: [ALTERATIONS.sharp],
  },
  {
    label: "G",
    alt: [ALTERATIONS.bemolle, ALTERATIONS.sharp],
  },
];
export const COLORS = [
  "m",
  "aug",
  "dim",
  // "sus",
  "add9",
  "m6",
  "m7",
  // "m9",
  "maj7",
  // "maj9",
  "mmaj7",
  // "-5",
  "11",
  // "13",
  "5",
  "6",
  // "6add9",
  "7",
  "7b5",
  "m7b5",
  // "7maj5",
  // "7sus4",
  // "9"
];
