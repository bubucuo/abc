function ListNode(val) {
  this.val = val;
  this.next = null;
}

function mergeTwoLists(l1, l2) {
  let fakeHead = new ListNode(0);

  let current = fakeHead;

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

  return fakeHead.next;
}

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

let a1 = [1];
let a2 = [1];

let l1 = generateList(a1);
let l2 = generateList(a2);

const res = generateArray(mergeTwoLists(l1, l2));

console.log(res); //sy-log
