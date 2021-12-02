// ! 墙壁涂色 acm
// ? n块墙壁，红黄蓝三种颜色涂料，按照下面的规则，有多少种刷墙方案？ f(n)
// 相邻的墙壁颜色不同
// 墙壁环形，(第1块和第n块颜色不能相同)

// f(1) = 3
// f(2) = 3 * 2 = 6
// f(3) = 3 * 2 * 1 = 6

// 第1块和第n-1块颜色可以相同吗
// 不相同  第n块墙壁有1种刷墙方案 f(n) = f(n-1)
// 相同 第n块墙壁有2种刷墙方案 f(n) = 2 * f(n-2)
// f(n) = f(n-1) + 2* f(n-2)

// dfs
function colorWall_dfs(n) {
  if (n === 1) {
    return 3;
  }
  if (n === 2 || n == 3) {
    return 6;
  }
  return colorWall_dfs(n - 1) + colorWall_dfs(n - 2) * 2;
}

function colorWall_dp(n) {
  const dp = [0, 3, 6, 6];
  for (let i = 4; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2] * 2;
  }
  return dp[n];
}

const n = 5;
console.log("res", colorWall_dfs(n));
console.log("res", colorWall_dp(n));
