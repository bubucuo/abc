exports.diffArray = (c1, c2, { mountElement, patch, unmount, move }) => {
  function isSameVNodeType(n1, n2) {
    return n1.key === n2.key; //&& n1.type === n2.type;
  }

  let i = 0;
  const l2 = c2.length;
  let e1 = c1.length - 1;
  let e2 = l2 - 1;

  // debugger;
  //* 1.从左边查找，如果节点不能复用，则停止
  // (a b) c
  // (a b) d e
  while (i <= e1 && i <= e2) {
    const n1 = c1[i];
    const n2 = c2[i];
    if (isSameVNodeType(n1, n2)) {
      patch(n1.key);
    } else {
      break;
    }
    i++;
  }

  // * 2. 从右边查找，如果节点不能复用，则停止
  // a (b c)
  // d e (b c)
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1];
    const n2 = c2[e2];
    if (isSameVNodeType(n1, n2)) {
      patch(n1.key);
    } else {
      break;
    }
    e1--;
    e2--;
  }

  // * 3. 老节点没了
  // (a b)
  // (a b) c
  // i = 2, e1 = 1, e2 = 2
  // (a b)
  // c (a b)
  // i = 0, e1 = -1, e2 = 0

  if (i > e1) {
    if (i <= e2) {
      //* 新节点有,新增
      // const nextPos = e2 + 1;
      while (i <= e2) {
        const n2 = c2[i];
        mountElement(n2.key);
        i++;
      }
    }
  }

  // * 4. 新节点没了
  // (a b) c
  // (a b)
  // i = 2, e1 = 2, e2 = 1
  // a (b c)
  // (b c)
  // i = 0, e1 = 0, e2 = -1
  else if (i > e2) {
    while (i <= e1) {
      // * 老节点有 ，删除
      const n1 = c1[i];
      unmount(n1.key);
      i++;
    }
  }

  // * 5. 新老节点都有，但是顺序不稳定

  // [i ... e1 + 1]: a b [c d e] f g
  // [i ... e2 + 1]: a b [e d c h] f g
  // i = 2, e1 = 4, e2 = 5
  else {
    const s1 = i; // prev starting index
    const s2 = i; // next starting index
    // * 5.1 build key:index map for newChildren
    // * 把新节点做成key value的map图 (key: index)
    // 为什么做map图，因为想通过key快速获取到节点
    const keyToNewIndexMap = new Map();
    // 遍历新元素，做成map图，方便快速查找与删除
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      keyToNewIndexMap.set(nextChild.key, i);
    }

    console.log("keyToNewIndexMap**********", keyToNewIndexMap); //sy-log

    // * 5.2 loop through old children left to be patched and try to patch
    // * matching nodes & remove nodes that are no longer present
    // * 遍历剩下的可以复用的老节点，删除不再需要的老节点
    let j;
    // patched记录了复用老元素的个数
    let patched = 0;
    const toBePatched = e2 - s2 + 1;

    let moved = false;

    // 记录最大的新子节点的最大的index，查看节点是否需要移动
    let maxNewIndexSoFar = 0;

    //  用于标记最长的稳定序列，因为希望尽可能少的移动节点，保持dom的稳定性
    const newIndexToOldIndexMap = new Array(toBePatched);
    for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;

    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i]; // 老节点
      // 如果复用的老元素个数>=新元素的个数，那么老元素删除即可
      if (patched >= toBePatched) {
        // all new children have been patched so this can only be a removal
        unmount(prevChild.key);
        continue;
      }
      // keyToNewIndexMap是新节点的key value的map图，此时通过老节点的key去这个新节点的map里进行查找，
      // 如果找到了，那么证明有能复用的节点，返回新节点的下标newIndex，复用即可。找不到，则删除老节点。
      let newIndex = keyToNewIndexMap.get(prevChild.key);

      if (newIndex === undefined) {
        // prevChild是老节点，去新节点的map图中没有找到要复用它的节点，删除这个老节点即可
        unmount(prevChild.key);
      } else {
        // 否则，复用即可
        // 记录一个通过新节点index找老节点index的数组，等下移动节点的时候要用
        // ??? 下标是新节点index，因为要从0开始所以减去了s2，值是老节点下标+1
        newIndexToOldIndexMap[newIndex - s2] = i + 1;
        // maxNewIndexSoFar判断节点是否需要移动，maxNewIndexSoFar初始值是0，第一次复用的节点作为标记位置
        // 比如上次复用的节点的位置是1，第二次再进来，如果节点位置为8，则需要移动
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex;
        } else {
          // 节点相对位置发生变化
          moved = true;
        }
        patch(prevChild.key);
        patched++;
      }
    }

    console.log("newIndexToOldIndexMap", newIndexToOldIndexMap); //sy-log

    // * 5.3 move and mount
    // 如果有节点移动，那么此时计算出来最稳定的序列，确保对dom的操作影响到最小
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : [];
    j = increasingNewIndexSequence.length - 1;

    console.log("increasingNewIndexSequence", increasingNewIndexSequence); //sy-log
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i;
      const nextChild = c2[nextIndex];
      if (newIndexToOldIndexMap[i] === 0) {
        // 装在新元素
        mountElement(nextChild.key);
      } else if (moved) {
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
          move(nextChild.key);
        } else {
          j--;
        }
      }
    }
  }

  function getSequence(arr) {
    // return [2];
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = (u + v) >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }

    return result;
  }
};
