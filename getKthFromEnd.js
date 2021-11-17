// ? 剑指 Offer 22. 链表中倒数第k个节点 https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/

// 顺序处理法
// * 时间复杂度O(n)
// * 空间复杂度O(1)
// var getKthFromEnd = function (head, k) {
//   let node = head;
//   let n = 0;

//   // 1. 获取链表长度n
//   while (node) {
//     node = node.next;
//     n++;
//   }

//   // 2. 从头结点去遍历返回第n-k个节点
//   node = head;
//   for (let i = 0; i < n - k; i++) {
//     node = node.next;
//   }
//   return node;
// };

// 快慢指针
// fast 指向链表第k+1个节点
// slow 指向链表的第1个节点
// fastIndex(n-1) - slowIndex(k-1) = k

// * 时间复杂度O(n)
// * 空间复杂度O(1)
var getKthFromEnd = function (head, k) {
  let fast = head;
  let slow = head;

  // 1. fast 指向链表第k+1个节点
  while (fast && k > 0) {
    // [fast, k] = [fast.next, k - 1];
    fast = fast.next;
    k--;
  }

  // fastIndex-slowIndex = k

  // 接下来同时移动fast和next，一次往后移动一个位置
  while (fast) {
    [fast, slow] = [fast.next, slow.next];
  }

  return slow;
};
