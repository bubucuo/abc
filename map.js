function MyMap() {
  this.init();
}

MyMap.prototype.init = function () {
  this.bucket = new Array(8);

  for (let i = 0; i < 8; i++) {
    this.bucket[i] = {
      next: null,
    };
  }

  this.size = 0;

  // 记录所有节点
  this.head = null;
  this.tail = null;
};

// todo 返回下标
MyMap.prototype.hash = function (key) {
  let index = 0;
  if (typeof key === "string") {
    for (let i = 0; i < 10; i++) {
      index += isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
    }
  } else if (typeof key === "object") {
    index = 0;
  } else if (typeof key === "number") {
    index = key % this.bucket.length;
  } else if (typeof key === "undefined") {
    index = 1;
  } else if (typeof key === "boolean") {
    index = 2;
  }

  return index % this.bucket.length;
};

MyMap.prototype.get = function (key) {
  const i = this.hash(key);
  let target = this.bucket[i];

  while (target.next) {
    if (target.next.key === key) {
      return target.next.value;
    }
    target = target.next;
  }
};

// 第一次添加、update
MyMap.prototype.set = function (key, value) {
  const i = this.hash(key);

  let target = this.bucket[i];

  while (target.next) {
    if (target.next.key === key) {
      // update
      target.next.value = value;
      return this;
    }
    target = target.next;
  }
  // 证明节点是第一次添加的
  target.next = {key, value, next: null};

  // 记录顺序, set不修改原先的顺序
  if (this.size === 0) {
    this.head = this.tail = target.next;
  } else {
    this.tail.next = target.next;
    this.tail = this.tail.next;
  }

  this.size++;

  return this;
};

MyMap.prototype.has = function (key) {
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

// 删除 变动链表
MyMap.prototype.delete = function (key) {
  const i = this.hash(key);
  let target = this.bucket[i];

  while (target.next) {
    if (target.next.key === key) {
      target.next = target.next.next;
      this.size--;
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

console.log("map before clear", map.size, map, JSON.stringify(map.head)); //sy-log

console.log("map clear", map.clear()); //sy-log

console.log("map after clear", map.size, map); //sy-log
