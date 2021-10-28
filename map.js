function MyMap() {
  this.init();
}

// 1 2 3
// hash 10
MyMap.prototype.init = function () {
  this.size = 0;
  this.head = null;
  this.tail = null;
  this.bucket = new Array(8);
  for (let i = 0; i < 8; i++) {
    this.bucket[i] = {};
    this.bucket[i].next = null;
  }

  // [{next: {key, value, next:{}}}, head1, head2 ]
  // head0(next)->node1->
};

// todo
MyMap.prototype.hash = function (key) {
  let i = 0;

  if (typeof key === "string") {
    for (let i = 0; i < 10; i++) {
      i += isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
    }
  } else if (typeof key === "object") {
    i = 0;
  } else if (typeof key === "number") {
    i = key % this.bucket.length;
  } else if (typeof key === "undefined") {
    i = 1;
  } else if (typeof key === "null") {
    i = 2;
  }
  return i % this.bucket.length;
};

// 插入元素
MyMap.prototype.set = function (key, value) {
  // 1. 首先拿到要插入的链表的下标
  const i = this.hash(key);
  let target = this.bucket[i];

  while (target.next) {
    if (target.next.key === key) {
      // 更新
      target.next.value = value;
      return this;
    }
    target = target.next;
  }
  target.next = { key, value, next: null };

  if (this.size === 0) {
    // 头结点 target.next
    this.head = this.tail = target.next;
  } else {
    // 1. 在上一次的尾结点后加入新元素target.next
    this.tail.next = target.next;
    // 2. 更新尾结点指向
    this.tail = target.next;
  }

  this.size++;

  return this;
};

// get方法读取key对应的键值，如果找不到key，返回undefined。
MyMap.prototype.get = function (key) {
  // 1. 首先找到要元素所在链表的下标
  const i = this.hash(key);
  let target = this.bucket[i];

  while (target.next) {
    if (target.next.key === key) {
      // 更新
      return target.next.value;
    }
    target = target.next;
  }

  // return undefined;
};

// has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
MyMap.prototype.has = function (key) {
  // 1. 首先找到要元素所在链表的下标
  const i = this.hash(key);
  let target = this.bucket[i];

  while (target.next) {
    if (target.next.key === key) {
      // 更新
      return true;
    }
    target = target.next;
  }

  return false;
};

// delete方法删除某个键，返回true。如果删除失败，返回false。
MyMap.prototype.delete = function (key) {
  // 链表删除，只需要改变指针指向

  const i = this.hash(key);
  let target = this.bucket[i];

  while (target.next) {
    if (target.next.key === key) {
      // 更新
      target.next = target.next.next;
      return true;
    }
    target = target.next;
  }

  return false;
};

// 按照set顺序记录下来
MyMap.prototype.entries = function () {
  return this.head;
};

// const obj = {
//   z: 10,
//   a: 0,
//   1: "xxx",
// };
// obj.x = 100;

// Object.keys(obj).forEach((key) => {
//   console.log("key", key); //sy-log
// });
// console.log("obj", obj); //sy-log

const map = new MyMap();

let o = {};

map
  .set(0, "x")
  .set("y", 1)
  // .set(0, "y")
  // .set(o, "xxx")
  .set(o, "xxx")
  .set(function () {}, "zz");

// // 0->x

// console.log("map", map.size, map); //sy-log

// console.log("map get y", map.get("yyy")); //sy-log

// console.log("map has y", map.has("y")); //sy-log
// console.log("map delete y", map.delete("y")); //sy-log
// console.log("map has y", map.has("y")); //sy-log
// console.log("map delete y", map.delete("y")); //sy-log

console.log("map map", map.entries()); //sy-log
