// ? 746. 使用最小花费爬楼梯 https://leetcode-cn.com/problems/min-cost-climbing-stairs/

// 数组的每个下标作为一个阶梯，第 i 个阶梯对应着一个非负数的体力花费值 cost[i]（下标从 0 开始）。
// 每当你爬上一个阶梯你都要花费对应的体力值，一旦支付了相应的体力值，你就可以选择向上爬一个阶梯或者爬两个阶梯。
// 请你找出达到楼层顶部的最低花费。在开始时，你可以选择从下标为 0 或 1 的元素作为初始阶梯。
// 输入：cost = [10, 15, 20]
// 输出：15
// 解释：最低花费是从 cost[1] 开始，然后走两步即可到阶梯顶，一共花费 15

/**
 * @param {number[]} cost
 * @return {number}
 */

// dp[i]代表到达阶梯i所需要最小体力花费值
// *时间复杂度O(n)
// *空间复杂度O(n)
// var minCostClimbingStairs = function (cost) {
//   const len = cost.length;
//   const dp = [0, 0];
//   for (let i = 2; i <= len; i++) {
//     dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
//   }

//   return dp[len];
// };

var minCostClimbingStairs = function (cost) {
  const len = cost.length;
  let prev = 0,
    current = 0,
    next;
  for (let i = 2; i <= len; i++) {
    next = Math.min(current + cost[i - 1], prev + cost[i - 2]);
    prev = current;
    current = next;
  }

  return current;
};
