let sort = require("./sort.js");

let doggos = [
  {
    name: "Bandit",
    rating: 13,
  },
  {
    name: "Choco",
    rating: 14,
  },
  {
    name: "Abby",
    rating: 12,
  },
  {
    name: "Daisy",
    rating: 12,
  },

  {
    name: "Elmo",
    rating: 12,
  },

  {
    name: "Falco",
    rating: 13,
  },
  {
    name: "Ghost",
    rating: 14,
  },
];

const compare = (a, b) => a.rating - b.rating;

// sort.insertionSort(doggos, compare); //ad

// sort.quickSort(doggos, compare); //ad

doggos = sort.mergeSort(doggos, compare); //bf
// sort.timSort(doggos, compare);

console.log("sorted", doggos); //sy-log
