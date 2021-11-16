// ? 剑指 Offer II 095. 最长公共子序列 https://leetcode-cn.com/problems/qJnOS7/

/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
// *时间复杂度O(mn)
// *空间复杂度O(mn)

var longestCommonSubsequence = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;
  let dp = [new Array(n + 1).fill(0)];
  for (let i = 1; i <= m; i++) {
    dp[i] = [0];
    const c1 = text1.charAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const c2 = text2.charAt(j - 1);
      if (c1 === c2) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
};
