// /**
//  * @param {number[]} nums
//  * @return {number}
//  */
// var lengthOfLIS = function (nums) {
//   const n = nums.length;
//   if (n <= 1) {
//     return n;
//   }
//   const dp = new Array(n).fill(1);
//   let max = 1;

//   for (let i = 1; i < n; i++) {
//     for (let j = i - 1; j >= 0; j--) {
//       if (nums[i] > nums[j]) {
//         // 严格递增，获取d[i]的最大值
//         dp[i] = Math.max(dp[i], dp[j] + 1);
//       }
//     }
//     max = Math.max(dp[i], max);
//   }

//   return max;
// };

/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  const n = nums.length;
  if (n <= 1) {
    return n;
  }
  const dp = [null, nums[0]];
  let max = 1;

  for (let i = 1; i < n; i++) {
    if (dp[max] < nums[i]) {
      dp[++max] = nums[i];
      continue;
    }
    // 二分查找dp
    let pos = 0;
    let left = 1,
      right = max,
      mid;
    while (left <= right) {
      mid = (left + right) >> 1;
      if (nums[i] > dp[mid]) {
        // 元素在右边
        left = mid + 1;
        pos = mid;
      } else {
        right = mid - 1;
      }
    }
    dp[pos + 1] = nums[i];
  }

  return max;
};
