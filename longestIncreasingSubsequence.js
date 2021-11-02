// ? 最长严格递增子序列的长度。

// ! 方法1: 动态规划
function longestIncreasingSubsequence(nums) {
  let len = nums.length;
  if (len <= 1) {
    return len;
  }

  let dp = new Array(len).fill(1);
  let max = 1;
  for (let i = 1; i < len; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[j] + 1, dp[i]);
      }
    }
    max = Math.max(max, dp[i]);
  }

  return max;
}

function longestIncreasingSubsequence(nums) {
  let len = 1;
  let n = nums.length;
  if (n <= 1) {
    return n;
  }
  // 记录长度为i的最长递增子序列的最小值
  let d = [];
  d[1] = nums[0];

  for (let i = 1; i < n; i++) {
    if (nums[i] > d[len]) {
      d[++len] = nums[i];
      continue;
    }
    //二分查找，覆盖掉比它大的元素中最小的那个
    let start = 1,
      end = len,
      mid,
      pos = 0;

    while (start <= end) {
      mid = (start + end) >> 1;
      if (nums[i] > d[mid]) {
        //在右边
        pos = mid;
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    d[pos + 1] = nums[i];
  }

  return len;
}

let test = [10, 9, 2, 5, 3, 7, 101, 18]; //4
test = [0, 1, 0, 3, 2, 3]; //4

// test = [1, 2, 3, 4, 5, -1, -2, 0];
// test = [0, 8, 4, 12, 2];

test = [4, 10, 4, 3, 8, 9]; //3
let res = longestIncreasingSubsequence(test);

console.log("res------", res); //sy-log

// nums 0, 1, 0, 3, 2, 3
//  d      0  1
