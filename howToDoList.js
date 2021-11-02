// Tes上怎么做链表题

function ListNode(val) {
  this.val = val;
  this.next = null;
}

// array->list
function generateList(array) {
  const fakeHead = new ListNode(0);
  let current = fakeHead;

  for (let i = 0; i < array.length; i++) {
    current.next = { val: array[i], next: null };
    current = current.next;
  }

  return fakeHead.next;
}

// list->array
function generateArray(list) {
  let res = [];

  while (list) {
    res.push(list.val);
    list = list.next;
  }

  return res;
}

let a1 = [1, 2, 3];
let a2 = [2, 3, 4];

let l1 = generateList(a1);
let l2 = generateList(a2);

console.log("l1", l1);
console.log("l2", l1);

a1 = generateArray(l1);
a2 = generateArray(l2);

console.log("a1", a1);
console.log("a2", a2);
