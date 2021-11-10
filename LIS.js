function getSequence(arr) {
  // return [2];

  //   初始值是arr，p[i]记录第i个位置的索引
  const recordIndexOfI = arr.slice();
  const result = [0];
  const len = arr.length;

  let resultLastIndex;
  let resultLast;

  for (let i = 1; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      // result最后一个元素
      resultLastIndex = result.length - 1;
      resultLast = result[resultLastIndex];
      if (arr[resultLast] < arrI) {
        recordIndexOfI[i] = resultLast;
        result.push(i);
        continue;
      }
      let left = 0,
        right = resultLastIndex;
      while (left < right) {
        const mid = (left + right) >> 1;
        if (arr[result[mid]] < arrI) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }

      if (arrI < arr[result[left]]) {
        if (left > 0) {
          recordIndexOfI[i] = result[left - 1];
        }
        result[left] = i;
      }
    }
  }

  console.log("resss", result); //sy-log

  //  recordIndexOfI记录了正确的索引 result 进而找到最终正确的索引
  resultLastIndex = result.length - 1;
  resultLast = result[resultLastIndex];

  while (resultLastIndex >= 0) {
    result[resultLastIndex] = resultLast;
    resultLast = recordIndexOfI[resultLast];
    resultLastIndex--;
  }
  console.log("recordIndexOfI", recordIndexOfI); //sy-log

  return result;
}

let arr = [10, 9, 2, 5, 3, 7, 101, 18]; // 2 4 5 7
// arr = [5, 3, 4, 0]; //1 2
arr = [2, 1, 5, 3, 6, 4, 8, 9, 7]; // 1 3 5 6 7
//     0, 1, 2, 3, 4, 5, 6, 7, 8, 9
//    [2, 1, 1, 1, 3, 3, 5, 6, 5]

// 1 3 4 7 9
// 1 3 4 8 9
debugger;

const res = getSequence(arr);

console.log("res", res); //sy-log
// 2 3 7 101
// 2 4 5 6
// 0145
