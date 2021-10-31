// const o = { a: "aaa", b: "bbb", 0: "ccc", 1: "ddd" };

function MyMap() {
  this.init();
}

// 数组+链表
// [{next:->}, _, _...], 8
MyMap.prototype.init = function () {
  this.size = 0;

  // 错误的示范
  // this.bucket = new Array(8).fill({ next: null });

  this.bucket = new Array(8);

  for (let i = 0; i < 8; i++) {
    this.bucket[i] = {};
    this.bucket[i].next = null;
  }
};

MyMap.prototype.hash = function (key) {
  let index = 0;

  // 根据key来决定index的大小
  if (typeof key === "string") {
    for (let i = 0; i < 10; i++) {
      index += isNaN(key.charCodeAt(key)) ? 0 : key.charCodeAt(key);
    }
  } else if (typeof key === "number") {
    index = index % this.bucket.length;
  } else if (typeof key === "object") {
    index = 0;
  } else if (typeof key === "undefined") {
    index = 1;
  } else if (typeof key === "null") {
    index = 2;
  }

  index = index % this.bucket.length;

  return index;
};

MyMap.prototype.set = function (key, value) {
  // 1. 决定把{key:value}存到哪个链表上，其实就是获取到对应的链表下标
  const i = this.hash(key);
  // 2.获取当前{key:value}要存放的链表
  let target = this.bucket[i];
  // 3. 决定把{key:value}存到链表尾部或者更新
  while (target.next) {
    if (target.next.key === key) {
      // 更新
      target.next.value = value;
      return this;
    }
    target = target.next;
  }

  // 新增
  target.next = { key, value, next: null };

  this.size++;
  return this;
};

MyMap.prototype.get = function (key) {
  // 1. 寻找{key:value}在到哪个链表上，其实就是获取到对应的链表下标
  const i = this.hash(key);
  // 2.获取当前{key:value}要存放的链表
  let target = this.bucket[i];
  // 3. 找到{key:value}存到链表哪个位置，找到了就返回value，找不到返回undefined
  while (target.next) {
    if (target.next.key === key) {
      return target.next.value;
    }
    target = target.next;
  }

  return undefined;
};

MyMap.prototype.has = function (key) {
  // 1. 寻找{key:value}在到哪个链表上，其实就是获取到对应的链表下标
  const i = this.hash(key);
  // 2.获取当前{key:value}要存放的链表
  let target = this.bucket[i];
  // 3. 找到{key:value}存到链表哪个位置，找到了就返回true，找不到返回false
  while (target.next) {
    if (target.next.key === key) {
      return true;
    }
    target = target.next;
  }

  return false;
};

MyMap.prototype.delete = function (key) {
  // 1. 寻找{key:value}在到哪个链表上，其实就是获取到对应的链表下标
  const i = this.hash(key);
  // 2.获取当前{key:value}要存放的链表
  let target = this.bucket[i];
  // 3. 找到{key:value}存到链表哪个位置，找到了就删除并且返回true，找不到返回false

  while (target.next) {
    if (target.next.key === key) {
      target.next = target.next.next;
      return true;
    }
    target = target.next;
  }

  return false;
};

MyMap.prototype.clear = function (key) {
  this.init();
};

const map = new MyMap();

const obj = {};
map
  .set("key", "value")
  .set("key", "value1")
  .set(0, "value0")
  .set(obj, "对象")
  .set(obj, "对象")
  .set(function () {}, "函数");

console.log("map get key", map.get("key1")); //sy-log

console.log("map has key", map.has("key")); //sy-log

console.log("map delete key", map.delete("key")); //sy-log

console.log("map has key", map.has("key")); //sy-log

console.log("map before clear", map.size, map); //sy-log

console.log("map clear", map.clear()); //sy-log

console.log("map after clear", map.size, map); //sy-log
