function ListNode(val) {
  this.val = val;
  this.next = null;
}

var mergeTwoLists = function (l1, l2) {
  const listNode = new ListNode(0);
  let current = listNode;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  if (l1) {
    current.next = l1;
  }
  if (l2) {
    current.next = l2;
  }
  return listNode.next;
};

// 输入：1->2->4, 1->3->4
// 输出：1->1->2->3->4->4

function generateList(array) {
  let fakeHead = new ListNode(0);
  let current = fakeHead;
  for (let index = 0; index < array.length; index++) {
    current.next = { val: array[index], next: null };
    current = current.next;
  }
  return fakeHead.next;
}

function generateArray(list) {
  let res = [];
  while (list) {
    res.push(list.val);
    list = list.next;
  }

  return res;
}

const l1 = generateList([1, 2, 3]);
const l2 = generateList([2, 3, 4]);

const res = generateArray(mergeTwoLists(l1, l2));
console.log("res", res); //sy-log
