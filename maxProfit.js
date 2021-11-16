// ? 买卖股票的最佳时机 https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/

// 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
// 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
// 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
/**
 * @param {number[]} prices
 * @return {number}
 */

// todo 方法1： 暴力求解法
// * 时间复杂度：O(n^2)
// * 空间复杂度：O(1)
var maxProfit = function (prices) {
  let len = prices.length;
  if (len <= 1) {
    return 0;
  }
  let max = 0;
  //  第i天买入
  // 第j天卖出
  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      let currentProfit = prices[j] - prices[i];
      max = Math.max(max, currentProfit);
    }
  }

  return max;
};

// todo 优化 动态规划
// 找最小值
// * 时间复杂度：O(n)
// * 空间复杂度：O(1)
var maxProfit = function (prices) {
  let len = prices.length;
  if (len <= 1) {
    return 0;
  }
  let max = 0;
  let minPrice = prices[0];
  for (let i = 1; i < len; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else {
      max = Math.max(max, prices[i] - minPrice);
    }
  }

  return max;
};
