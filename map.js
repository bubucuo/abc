// index%len

function MyMap() {
  this.init();
}

// [next(head), _, _];
// l, l, l;
MyMap.prototype.init = function () {
  this.size = 0;
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
      // 更新
      target.next.value = value;
      return this;
    }
    target = target.next;
  }

  target.next = { key, value, next: null };

  this.size++;
  return this;
};

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

const map = new MyMap();

map
  .set("key2", "value2")
  .set(o, "对象")
  .set(o, "新对象")
  .set(function () {}, "哈哈哈");

console.log("map", map.size, map); //sy-log
