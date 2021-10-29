// index%len

function MyMap() {
  this.init();
}

// 数组、链表
// [next(head), _, _];
// l, l, l;
MyMap.prototype.init = function () {
  this.size = 0;

  // ! 错误的示范
  // this.bucket = new Array(8).fill({ next: null });

  this.bucket = new Array(8);

  for (let i = 0; i < 8; i++) {
    this.bucket[i] = {};
    this.bucket[i].next = null;
  }
};

MyMap.prototype.set = function (key, value) {
  // 1. 决定把{key:vlaue}放到哪个链表上
  const i = this.hash(key);
  // 2. 获取当前值对要存放的链表
  let target = this.bucket[i];
  // 3. 放到链表的哪个位置
  while (target.next) {
    if (target.next.key === key) {
      // 更新，在这儿就退出了
      target.next.value = value;
      return this;
    }
    target = target.next;
  }

  // 初始化
  target.next = { key, value, next: null };
  // 初始化完了， size要加1
  this.size++;
  return this;
};

MyMap.prototype.get = function (key) {
  // 1. 先找到{key:vlaue}在哪个链表上
  const i = this.hash(key);
  // 2. 获取当前值对存放的链表
  let target = this.bucket[i];
  // 3. 找到在链表的哪个位置上
  while (target.next) {
    if (target.next.key === key) {
      return target.next.value;
    }
    target = target.next;
  }
};

MyMap.prototype.has = function (key) {
  // 1. 先找到{key:vlaue}在哪个链表上
  const i = this.hash(key);
  // 2. 获取当前值对存放的链表
  let target = this.bucket[i];
  // 3. 找到在链表的哪个位置上
  while (target.next) {
    if (target.next.key === key) {
      return true;
    }
    target = target.next;
  }

  return false;
};

MyMap.prototype.delete = function (key) {
  // 1. 先找到{key:vlaue}在哪个链表上
  const i = this.hash(key);
  // 2. 获取当前值对存放的链表
  let target = this.bucket[i];
  // 3. 找到在链表的哪个位置上
  while (target.next) {
    if (target.next.key === key) {
      // 找到了，修改链表指向
      target.next = target.next.next;
      return true;
    }
    target = target.next;
  }

  return false;
};

MyMap.prototype.clear = function () {
  this.init();
};

// hash函数。不同的散列表，hash也不同。
MyMap.prototype.hash = function (key) {
  let index = 0;
  // 根据key的不同的数据类型，返回不同的index，其实就是决定放到bucket的哪个链表上
  if (typeof key === "object") {
    index = 0;
  } else if (typeof key === "number") {
    index = key % this.bucket.length;
  } else if (typeof key === "undefined") {
    index = 1;
  } else if (typeof key === "null") {
    index = 2;
  } else if (typeof key === "string") {
    for (let i = 0; i < 10; i++) {
      index += isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
    }
  }

  index = index % this.bucket.length;

  return index;
};

const o = {};

const fn = () => {
  console.log("fn"); //sy-log
};

const map = new Map();

map
  .set("key2", "value2")
  .set(o, "对象")
  .set(o, "新对象")
  .set(function () {}, "哈哈哈")
  .set(fn, "是fn呀")
  .set(1, "111");

console.log("map get o", map.get({})); //sy-log
console.log("map has fn0", map.has(fn)); //sy-log

// console.log("删除fn的结果", map.delete(fn)); //sy-log

console.log("map has fn1", map.has(fn)); //sy-log

// map.clear();

console.log("map", map.size, map); //sy-log

const obj = {
  key2: "value2",
  1: "111",
};

console.log("obj", obj); //sy-log
