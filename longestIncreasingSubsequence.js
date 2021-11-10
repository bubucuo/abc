// old array   a b c d e f g
// new array a b e d c h f g

// mountElement挂在新元素
// patch复用老元素
// unmount卸载老元素
// move移动元素

exports.diffArray = (c1, c2, { mountElement, patch, unmount, move }) => {
  // * 1. 左边按序查找，如果节点不能复用，则停止
  function isSameVNodeType(n1, n2) {
    return n1.key === n2.key; //&& n1.type === n2.type;
  }

  // 从左边遍历的下标
  let i = 0;
  const l2 = c2.length;
  // 最后一个老元素节点下标
  let e1 = c1.length - 1;
  // 最后一个新元素元素节点下标
  let e2 = l2 - 1;

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

  // *2. 右边按序查找，如果节点不能复用，则停止
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

  // * 3老节点没了
  if (i > e1) {
    // 老节点没了
    if (i <= e2) {
      // 新节点还有
      while (i <= e2) {
        const n2 = c2[i];
        mountElement(n2.key);
        i++;
      }
    }
  }

  // * 4.新节点没了
  else if (i > e2) {
    // 老节点如果有的话，逐个删除
    while (i <= e1) {
      const n1 = c1[i];
      unmount(n1.key);
      i++;
    }
  } else {
    // * 5.新老节点都还有， 新增、删除、移动
    // ab cde fg
    // ab edch fg

    // cde
    // edch
    // 老元素遍历到的下标位置
    const s1 = i;
    // 新元素元素遍历到的下标位置
    const s2 = i;

    // * 5.1 把新元素做成key:value的Map图 （key: index）
    const keyToNewIndexMap = new Map();
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      keyToNewIndexMap.set(nextChild.key, i);
    }

    // 实时标记现在还剩下多少新元素需要patch
    let patched = 0;

    // 标记总共有剩下有多少新元素需要patch
    const toBePatched = e2 - s2 + 1;

    let moved = false;

    // 记录最大的新子节点的最大的index，查看节点是否需要移动
    let maxNewIndexSoFar = 0;

    //  用于标记最长的稳定序列，因为希望尽可能少的移动节点，保持dom的稳定性
    const newIndexToOldIndexMap = new Array(toBePatched);
    for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;

    // *5.2 遍历老元素
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      if (patched >= toBePatched) {
        // 复用老元素的个数已经够了
        unmount(prevChild.key);
        continue;
      }
      let newIndex = keyToNewIndexMap.get(prevChild.key);
      if (newIndex === undefined) {
        // 老节点没法复用
        unmount(prevChild.key);
      } else {
        // 下标是newIndex的相对s2的位置，值是老节点下标+1
        newIndexToOldIndexMap[newIndex - s2] = i + 1;
        // newIndex是新节点中的下标
        // ab cdefg
        // ab edchfg
        // max =4
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex;
        } else {
          moved = true;
        }
        patch(prevChild.key);
        patched++;
      }
    }

    // *5.2 遍历新节点 移动 新增
    console.log("newIndexToOldIndexMap", newIndexToOldIndexMap); //sy-log
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : [];
    let lastIndex = increasingNewIndexSequence.length - 1;
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i;
      const nextChild = c2[nextIndex];
      // 判断节点是移动还是新增
      if (newIndexToOldIndexMap[i] === 0) {
        // 挂载新节点
        mountElement(nextChild.key);
      } else if (moved) {
        // 移动节点
        if (lastIndex < 0 || i !== increasingNewIndexSequence[lastIndex]) {
          move(nextChild.key);
        } else {
          // 节点不需要移动
          lastIndex--;
        }
      }
    }
  }

  // 获取最长递增子序列的路径（index数组）

  // 5 3 4 0
  // 0 5

  // arr[i]>=0
  function getSequence(arr) {
    // return [2];

    //   初始值是arr，p[i]记录第i个位置的索引
    const recordIndexOfI = arr.slice();
    const result = [0];
    const len = arr.length;

    let resultLastIndex;
    let resultLast;

    for (let i = 1; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        // result最后一个元素
        resultLastIndex = result.length - 1;
        resultLast = result[resultLastIndex];
        if (arr[resultLast] < arrI) {
          recordIndexOfI[i] = resultLast;
          result.push(i);
          continue;
        }
        let left = 0,
          right = resultLastIndex;
        while (left < right) {
          const mid = (left + right) >> 1;
          if (arr[result[mid]] < arrI) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }

        if (arrI < arr[result[left]]) {
          if (left > 0) {
            recordIndexOfI[i] = result[left - 1];
          }
          result[left] = i;
        }
      }
    }

    //  recordIndexOfI记录了正确的索引 result 进而找到最终正确的索引
    resultLastIndex = result.length - 1;
    resultLast = result[resultLastIndex];

    while (resultLastIndex >= 0) {
      result[resultLastIndex] = resultLast;
      resultLast = recordIndexOfI[resultLast];
      resultLastIndex--;
    }

    return result;
  }
};
