// function longestIncreasingSubsequence(arr) {
//   let p = arr.slice();
//   const result = [0];

//   let i, j, u, v, c;

//   const len = arr.length;

//   for (i = 0; i < len; i++) {
//     const arrI = arr[i];
//     if (arrI !== 0) {
//       j = result[result.length - 1];
//       if(arr[j]<arrI){

//       }
//     }
//   }
// }

function longestIncreasingSubsequence(array) {
  let result = [1];

  let len = array.length;

  for (let i = 1; i < len; i++) {
    result[i] = 1;
    for (let j = 0; j < i; j++) {
      if (array[i] > array[j]) {
        result[i] = Math.max(result[j] + 1, result[i]);
      }
    }
  }

  return Math.max.apply(null, result);
}

console.log(longestIncreasingSubsequence([0, 1, 0, 3, 2, 3])); //sy-log

1, 2, 1, 0, 1, 0, 3, 2, 3;
