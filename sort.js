function insertionSort(array, compare) {
  let len = array.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      if (compare(array[i], array[j]) > 0) {
        let tem = array[i];
        array[i] = array[j];
        array[j] = tem;
      }
    }
  }
}

// 不稳定
function quickSort(array, compare) {
  function sort(array, left, right) {
    if (left >= right) {
      return;
    }

    let i = left,
      j = right;
    const base = array[j];
    while (i < j) {
      while (i < j && compare(array[i], base) <= 0) {
        i++;
      }
      array[j] = array[i];
      while (i < j && compare(array[j], base) >= 0) {
        j--;
      }
      array[i] = array[j];
    }
    array[j] = base;
    sort(array, left, j - 1);
    sort(array, j + 1, right);
  }

  sort(array, 0, array.length - 1);
}

function mergeSort(array, compare) {
  function merge(left, right) {
    const res = [];

    while (left.length > 0 && right.length > 0) {
      if (compare(left[0], right[0]) < 0) {
        res.push(left.shift());
      } else {
        res.push(right.shift());
      }
    }

    return res.concat(left).concat(right);
  }

  if (array.length === 1) {
    return array;
  }

  const length = array.length;
  const middle = length >>> 1;
  let left = array.slice(0, middle);
  let right = array.slice(middle);
  return merge(mergeSort(left, compare), mergeSort(right, compare));
}

// function arraycopy(s, spos, d, dpos, len) {
//   var a = s.slice(spos, spos + len);
//   while (len--) {
//     d[dpos + len] = a[len];
//   }
// }

// function binarySort(array, low, high, start, compare) {
//   if (start === low) {
//     start++;
//   }
//   while (start < high) {
//     const pivot = a[start];
//     let left = low,
//       right = start;
//     while (left < right) {
//       const mid = (left + right) >>> 1;
//       if (compare(pivot, a[mid]) < 0) {
//         right = mid;
//       } else {
//         left = mid + 1;
//       }
//     }

//     let n = start - left;
//     switch (n) {
//       case 2:
//         a[left + 2] = a[left + 1];
//         break;
//       case 1:
//         a[left + 1] = a[left];
//         break;

//       default:
//         arraycopy(array, left, array, left + 1, n);
//     }
//     a[left] = pivot;
//   }
// }

// function timSort(array, compare) {
//   function reverseRange(array, low, high) {
//     let from = low,
//       to = high;
//     let t;

//     while (from < to) {
//       t = a[from];
//       a[from] = a[to];
//       a[to] = t;
//       from++;
//       to--;
//     }
//   }
//   function countRunAndMakeAscending(array, low, high) {
//     let i = low + 1;
//     if (compare(a[low], a[i]) > 0) {
//       //降序，则继续往后找降序，直到不再是降序则停止

//       while (i < high && compare(a[i], a[i + 1]) > 0) {
//         i++;
//       }
//       // 翻转
//       reverseRange(a, low, i);
//     } else {
//       //升序,则继续往后找升序，直到不再是升序则停止
//       while (i < high && compare(a[i], a[i + 1]) <= 0) {
//         i++;
//       }
//     }

//     return i - low;
//   }

//   let stackSize = 0;
//   let low = 0,
//     high = array.lengh;
//   const MIN_MERGE = 32;
//   const MIN_GALLOP = 7;

//   // !1. 分区
//   let nRemaining = high - low;
//   if (nRemaining < 2) return; // Arrays of size 0 and 1 are always sorted
//   if (nRemaining < MIN_MERGE) {
//     // 如果数组很小，做个"mini-TimSort"就行了，就不再合并了
//     const initRunLen = countRunAndMakeAscending(array, low, high);
//     binarySort(array, low, high, low + initRunLen, compare);
//     return;
//   }
// }

// // Array.prototype.timsort = function(comp){
function timSort(array, compare) {
  var global_a = this;
  var MIN_MERGE = 32;
  var MIN_GALLOP = 7;
  var runBase = [];
  var runLen = [];
  var stackSize = 0;
  // var compare = comp;

  sort(array, 0, array.length, compare);

  function sort(a, lo, hi, compare) {
    stackSize = 0;
    runBase = [];
    runLen = [];

    rangeCheck(a.length, lo, hi);
    var nRemaining = hi - lo;
    if (nRemaining < 2) return; // Arrays of size 0 and 1 are always sorted

    // If array is small, do a "mini-TimSort" with no merges
    if (nRemaining < MIN_MERGE) {
      var initRunLen = countRunAndMakeAscending(a, lo, hi, compare);
      binarySort(a, lo, hi, lo + initRunLen, compare);
      return;
    }

    /**
     * March over the array once, left to right, finding natural runs, extending short natural runs to minRun elements, and
     * merging runs to maintain stack invariant.
     */
    var ts = [];
    var minRun = minRunLength(nRemaining);
    do {
      // Identify next run
      var runLenVar = countRunAndMakeAscending(a, lo, hi, compare);

      // If run is short, extend to min(minRun, nRemaining)
      if (runLenVar < minRun) {
        var force = nRemaining <= minRun ? nRemaining : minRun;
        binarySort(a, lo, lo + force, lo + runLenVar, compare);
        runLenVar = force;
      }

      // Push run onto pending-run stack, and maybe merge
      pushRun(lo, runLenVar);
      mergeCollapse();

      // Advance to find next run
      lo += runLenVar;
      nRemaining -= runLenVar;
    } while (nRemaining != 0);

    // Merge all remaining runs to complete sort
    mergeForceCollapse();
  }

  /**
   * Sorts the specified portion of the specified array using a binary insertion sort. This is the best method for sorting small
   * numbers of elements. It requires O(n log n) compares, but O(n^2) data movement (worst case).
   *
   * If the initial part of the specified range is already sorted, this method can take advantage of it: the method assumes that
   * the elements from index {@code lo}, inclusive, to {@code start}, exclusive are already sorted.
   *
   * @param a the array in which a range is to be sorted
   * @param lo the index of the first element in the range to be sorted
   * @param hi the index after the last element in the range to be sorted
   * @param start the index of the first element in the range that is not already known to be sorted (@code lo <= start <= hi}
   * @param c comparator to used for the sort
   */
  function binarySort(a, lo, hi, start, compare) {
    if (start == lo) start++;
    for (; start < hi; start++) {
      var pivot = a[start];

      // Set left (and right) to the index where a[start] (pivot) belongs
      var left = lo;
      var right = start;
      /*
       * Invariants: pivot >= all in [lo, left). pivot < all in [right, start).
       */
      while (left < right) {
        var mid = (left + right) >>> 1;
        if (compare(pivot, a[mid]) < 0) right = mid;
        else left = mid + 1;
      }
      /*
       * The invariants still hold: pivot >= all in [lo, left) and pivot < all in [left, start), so pivot belongs at left. Note
       * that if there are elements equal to pivot, left points to the first slot after them -- that's why this sort is stable.
       * Slide elements over to make room to make room for pivot.
       */
      var n = start - left; // The number of elements to move
      // Switch is just an optimization for arraycopy in default case
      switch (n) {
        case 2:
          a[left + 2] = a[left + 1];
        case 1:
          a[left + 1] = a[left];
          break;
        default:
          arraycopy(a, left, a, left + 1, n);
      }
      a[left] = pivot;
    }
  }

  /**
   * Returns the length of the run beginning at the specified position in the specified array and reverses the run if it is
   * descending (ensuring that the run will always be ascending when the method returns).
   *
   * A run is the longest ascending sequence with:
   *
   * a[lo] <= a[lo + 1] <= a[lo + 2] <= ...
   *
   * or the longest descending sequence with:
   *
   * a[lo] > a[lo + 1] > a[lo + 2] > ...
   *
   * For its intended use in a stable mergesort, the strictness of the definition of "descending" is needed so that the call can
   * safely reverse a descending sequence without violating stability.
   *
   * @param a the array in which a run is to be counted and possibly reversed
   * @param lo index of the first element in the run
   * @param hi index after the last element that may be contained in the run. It is required that @code{lo < hi}.
   * @param c the comparator to used for the sort
   * @return the length of the run beginning at the specified position in the specified array
   */
  function countRunAndMakeAscending(a, lo, hi, compare) {
    var runHi = lo + 1;

    // Find end of run, and reverse range if descending
    if (compare(a[runHi++], a[lo]) < 0) {
      // Descending
      while (runHi < hi && compare(a[runHi], a[runHi - 1]) < 0) {
        runHi++;
      }
      reverseRange(a, lo, runHi);
    } else {
      // Ascending
      while (runHi < hi && compare(a[runHi], a[runHi - 1]) >= 0) {
        runHi++;
      }
    }

    return runHi - lo;
  }

  /**
   * Reverse the specified range of the specified array.
   *
   * @param a the array in which a range is to be reversed
   * @param lo the index of the first element in the range to be reversed
   * @param hi the index after the last element in the range to be reversed
   */
  function /*private static void*/ reverseRange(
    /*Object[]*/ a,
    /*int*/ lo,
    /*int*/ hi
  ) {
    hi--;
    while (lo < hi) {
      var t = a[lo];
      a[lo++] = a[hi];
      a[hi--] = t;
    }
  }

  /**
   * Returns the minimum acceptable run length for an array of the specified length. Natural runs shorter than this will be
   * extended with {@link #binarySort}.
   *
   * Roughly speaking, the computation is:
   *
   * If n < MIN_MERGE, return n (it's too small to bother with fancy stuff). Else if n is an exact power of 2, return
   * MIN_MERGE/2. Else return an int k, MIN_MERGE/2 <= k <= MIN_MERGE, such that n/k is close to, but strictly less than, an
   * exact power of 2.
   *
   * For the rationale, see listsort.txt.
   *
   * @param n the length of the array to be sorted
   * @return the length of the minimum run to be merged
   */
  function minRunLength(n) {
    var r = 0; // Becomes 1 if any 1 bits are shifted off

    return n + 1;
  }

  /**
   * Pushes the specified run onto the pending-run stack.
   *
   * @param runBase index of the first element in the run
   * @param runLen the number of elements in the run
   */
  function pushRun(runBaseArg, runLenArg) {
    runBase[stackSize] = runBaseArg;

    //this.runLen[stackSize] = runLen;
    //runLen.push(runLenArg);
    runLen[stackSize] = runLenArg;
    stackSize++;
  }

  /**
   * Examines the stack of runs waiting to be merged and merges adjacent runs until the stack invariants are reestablished:
   *
   * 1. runLen[i - 3] > runLen[i - 2] + runLen[i - 1] 2. runLen[i - 2] > runLen[i - 1]
   *
   * This method is called each time a new run is pushed onto the stack, so the invariants are guaranteed to hold for i <
   * stackSize upon entry to the method.
   */
  function mergeCollapse() {
    while (stackSize > 1) {
      var n = stackSize - 2;
      if (n > 0 && runLen[n - 1] <= runLen[n] + runLen[n + 1]) {
        if (runLen[n - 1] < runLen[n + 1]) n--;
        mergeAt(n);
      } else if (runLen[n] <= runLen[n + 1]) {
        mergeAt(n);
      } else {
        break; // Invariant is established
      }
    }
  }

  /**
   * Merges all runs on the stack until only one remains. This method is called once, to complete the sort.
   */
  function mergeForceCollapse() {
    while (stackSize > 1) {
      var n = stackSize - 2;
      if (n > 0 && runLen[n - 1] < runLen[n + 1]) n--;
      mergeAt(n);
    }
  }

  /**
   * Merges the two runs at stack indices i and i+1. Run i must be the penultimate or antepenultimate run on the stack. In other
   * words, i must be equal to stackSize-2 or stackSize-3.
   *
   * @param i stack index of the first of the two runs to merge
   */
  function mergeAt(i) {
    var base1 = runBase[i];
    var len1 = runLen[i];
    var base2 = runBase[i + 1];
    var len2 = runLen[i + 1];

    /*
     * Record the length of the combined runs; if i is the 3rd-last run now, also slide over the last run (which isn't involved
     * in this merge). The current run (i+1) goes away in any case.
     */
    //var stackSize = runLen.length;
    runLen[i] = len1 + len2;
    if (i == stackSize - 3) {
      runBase[i + 1] = runBase[i + 2];
      runLen[i + 1] = runLen[i + 2];
    }
    stackSize--;

    /*
     * Find where the first element of run2 goes in run1. Prior elements in run1 can be ignored (because they're already in
     * place).
     */

    var k = gallopRight(global_a[base2], global_a, base1, len1, 0, compare);
    base1 += k;
    len1 -= k;
    if (len1 == 0) return;

    /*
     * Find where the last element of run1 goes in run2. Subsequent elements in run2 can be ignored (because they're already in
     * place).
     */
    len2 = gallopLeft(
      global_a[base1 + len1 - 1],
      global_a,
      base2,
      len2,
      len2 - 1,
      compare
    );

    if (len2 == 0) return;

    // Merge remaining runs, using tmp array with min(len1, len2) elements
    if (len1 <= len2) mergeLo(base1, len1, base2, len2);
    else mergeHi(base1, len1, base2, len2);
  }

  /**
   * Locates the position at which to insert the specified key into the specified sorted range; if the range contains an element
   * equal to key, returns the index of the leftmost equal element.
   *
   * @param key the key whose insertion point to search for
   * @param a the array in which to search
   * @param base the index of the first element in the range
   * @param len the length of the range; must be > 0
   * @param hint the index at which to begin the search, 0 <= hint < n. The closer hint is to the result, the faster this method
   *           will run.
   * @param c the comparator used to order the range, and to search
   * @return the int k, 0 <= k <= n such that a[b + k - 1] < key <= a[b + k], pretending that a[b - 1] is minus infinity and a[b
   *         + n] is infinity. In other words, key belongs at index b + k; or in other words, the first k elements of a should
   *         precede key, and the last n - k should follow it.
   */
  function gallopLeft(key, a, base, len, hint, compare) {
    var lastOfs = 0;
    var ofs = 1;
    if (compare(key, a[base + hint]) > 0) {
      // Gallop right until a[base+hint+lastOfs] < key <= a[base+hint+ofs]
      var maxOfs = len - hint;
      while (ofs < maxOfs && compare(key, a[base + hint + ofs]) > 0) {
        lastOfs = ofs;
        ofs = (ofs << 1) + 1;
        if (ofs <= 0)
          // int overflow
          ofs = maxOfs;
      }
      if (ofs > maxOfs) ofs = maxOfs;

      // Make offsets relative to base
      lastOfs += hint;
      ofs += hint;
    } else {
      // key <= a[base + hint]
      // Gallop left until a[base+hint-ofs] < key <= a[base+hint-lastOfs]
      var maxOfs = hint + 1;
      while (ofs < maxOfs && compare(key, a[base + hint - ofs]) <= 0) {
        lastOfs = ofs;
        ofs = (ofs << 1) + 1;
        if (ofs <= 0)
          // int overflow
          ofs = maxOfs;
      }
      if (ofs > maxOfs) ofs = maxOfs;

      // Make offsets relative to base
      var tmp = lastOfs;
      lastOfs = hint - ofs;
      ofs = hint - tmp;
    }

    /*
     * Now a[base+lastOfs] < key <= a[base+ofs], so key belongs somewhere to the right of lastOfs but no farther right than ofs.
     * Do a binary search, with invariant a[base + lastOfs - 1] < key <= a[base + ofs].
     */
    lastOfs++;
    while (lastOfs < ofs) {
      var m = lastOfs + ((ofs - lastOfs) >>> 1);

      if (compare(key, a[base + m]) > 0) lastOfs = m + 1;
      // a[base + m] < key
      else ofs = m; // key <= a[base + m]
    }
    return ofs;
  }

  /**
   * Like gallopLeft, except that if the range contains an element equal to key, gallopRight returns the index after the
   * rightmost equal element.
   *
   * @param key the key whose insertion point to search for
   * @param a the array [] in which to search
   * @param base the index of the first element in the range
   * @param len the length of the range; must be > 0
   * @param hint the index at which to begin the search, 0 <= hint < n. The closer hint is to the result, the faster this method
   *           will run.
   * @param c the comparator used to order the range, and to search
   * @return the int k, 0 <= k <= n such that a[b + k - 1] <= key < a[b + k]
   */
  function gallopRight(key, a, base, len, hint, compare) {
    var ofs = 1;
    var lastOfs = 0;
    if (compare(key, a[base + hint]) < 0) {
      // Gallop left until a[b+hint - ofs] <= key < a[b+hint - lastOfs]
      var maxOfs = hint + 1;
      while (ofs < maxOfs && compare(key, a[base + hint - ofs]) < 0) {
        lastOfs = ofs;
        ofs = (ofs << 1) + 1;
        if (ofs <= 0)
          // int overflow
          ofs = maxOfs;
      }
      if (ofs > maxOfs) ofs = maxOfs;

      // Make offsets relative to b
      var tmp = lastOfs;
      lastOfs = hint - ofs;
      ofs = hint - tmp;
    } else {
      // a[b + hint] <= key
      // Gallop right until a[b+hint + lastOfs] <= key < a[b+hint + ofs]
      var maxOfs = len - hint;
      while (ofs < maxOfs && compare(key, a[base + hint + ofs]) >= 0) {
        lastOfs = ofs;
        ofs = (ofs << 1) + 1;
        if (ofs <= 0)
          // int overflow
          ofs = maxOfs;
      }
      if (ofs > maxOfs) ofs = maxOfs;

      // Make offsets relative to b
      lastOfs += hint;
      ofs += hint;
    }

    /*
     * Now a[b + lastOfs] <= key < a[b + ofs], so key belongs somewhere to the right of lastOfs but no farther right than ofs.
     * Do a binary search, with invariant a[b + lastOfs - 1] <= key < a[b + ofs].
     */
    lastOfs++;
    while (lastOfs < ofs) {
      var m = lastOfs + ((ofs - lastOfs) >>> 1);

      if (compare(key, a[base + m]) < 0) ofs = m;
      // key < a[b + m]
      else lastOfs = m + 1; // a[b + m] <= key
    }
    return ofs;
  }

  /**
   * Merges two adjacent runs in place, in a stable fashion. The first element of the first run must be greater than the first
   * element of the second run (a[base1] > a[base2]), and the last element of the first run (a[base1 + len1-1]) must be greater
   * than all elements of the second run.
   *
   * For performance, this method should be called only when len1 <= len2; its twin, mergeHi should be called if len1 >= len2.
   * (Either method may be called if len1 == len2.)
   *
   * @param base1 index of first element in first run to be merged
   * @param len1 length of first run to be merged (must be > 0)
   * @param base2 index of first element in second run to be merged (must be aBase + aLen)
   * @param len2 length of second run to be merged (must be > 0)
   */
  function mergeLo(base1, len1, base2, len2) {
    // Copy first run into temp array
    var a = global_a; // For performance
    var tmp = a.slice(base1, base1 + len1);

    var cursor1 = 0; // Indexes into tmp array
    var cursor2 = base2; // Indexes int a
    var dest = base1; // Indexes int a

    // Move first element of second run and deal with degenerate cases
    a[dest++] = a[cursor2++];
    if (--len2 == 0) {
      arraycopy(tmp, cursor1, a, dest, len1);
      return;
    }
    if (len1 == 1) {
      arraycopy(a, cursor2, a, dest, len2);
      a[dest + len2] = tmp[cursor1]; // Last elt of run 1 to end of merge
      return;
    }

    var c = compare; // Use local variable for performance

    var minGallop = MIN_GALLOP; // "    " "     " "
    outer: while (true) {
      var count1 = 0; // Number of times in a row that first run won
      var count2 = 0; // Number of times in a row that second run won

      /*
       * Do the straightforward thing until (if ever) one run starts winning consistently.
       */
      do {
        if (compare(a[cursor2], tmp[cursor1]) < 0) {
          a[dest++] = a[cursor2++];
          count2++;
          count1 = 0;
          if (--len2 == 0) break outer;
        } else {
          a[dest++] = tmp[cursor1++];
          count1++;
          count2 = 0;
          if (--len1 == 1) break outer;
        }
      } while ((count1 | count2) < minGallop);

      /*
       * One run is winning so consistently that galloping may be a huge win. So try that, and continue galloping until (if
       * ever) neither run appears to be winning consistently anymore.
       */
      do {
        count1 = gallopRight(a[cursor2], tmp, cursor1, len1, 0, c);
        if (count1 != 0) {
          arraycopy(tmp, cursor1, a, dest, count1);
          dest += count1;
          cursor1 += count1;
          len1 -= count1;
          if (len1 <= 1)
            // len1 == 1 || len1 == 0
            break outer;
        }
        a[dest++] = a[cursor2++];
        if (--len2 == 0) break outer;

        count2 = gallopLeft(tmp[cursor1], a, cursor2, len2, 0, c);
        if (count2 != 0) {
          arraycopy(a, cursor2, a, dest, count2);
          dest += count2;
          cursor2 += count2;
          len2 -= count2;
          if (len2 == 0) break outer;
        }
        a[dest++] = tmp[cursor1++];
        if (--len1 == 1) break outer;
        minGallop--;
      } while ((count1 >= MIN_GALLOP) | (count2 >= MIN_GALLOP));
      if (minGallop < 0) minGallop = 0;
      minGallop += 2; // Penalize for leaving gallop mode
    } // End of "outer" loop
    this.minGallop = minGallop < 1 ? 1 : minGallop; // Write back to field

    if (len1 == 1) {
      arraycopy(a, cursor2, a, dest, len2);
      a[dest + len2] = tmp[cursor1]; // Last elt of run 1 to end of merge
    } else if (len1 == 0) {
      throw new Error(
        "IllegalArgumentException. Comparison method violates its general contract!"
      );
    } else {
      arraycopy(tmp, cursor1, a, dest, len1);
    }
  }

  /**
   * Like mergeLo, except that this method should be called only if len1 >= len2; mergeLo should be called if len1 <= len2.
   * (Either method may be called if len1 == len2.)
   *
   * @param base1 index of first element in first run to be merged
   * @param len1 length of first run to be merged (must be > 0)
   * @param base2 index of first element in second run to be merged (must be aBase + aLen)
   * @param len2 length of second run to be merged (must be > 0)
   */
  function mergeHi(base1, len1, base2, len2) {
    // Copy second run into temp array
    var a = global_a; // For performance
    var tmp = a.slice(base2, base2 + len2);

    var cursor1 = base1 + len1 - 1; // Indexes into a
    var cursor2 = len2 - 1; // Indexes into tmp array
    var dest = base2 + len2 - 1; // Indexes into a

    // Move last element of first run and deal with degenerate cases
    a[dest--] = a[cursor1--];
    if (--len1 == 0) {
      arraycopy(tmp, 0, a, dest - (len2 - 1), len2);
      return;
    }
    if (len2 == 1) {
      dest -= len1;
      cursor1 -= len1;
      arraycopy(a, cursor1 + 1, a, dest + 1, len1);
      a[dest] = tmp[cursor2];
      return;
    }

    var c = compare; // Use local variable for performance

    var minGallop = MIN_GALLOP; // "    " "     " "
    outer: while (true) {
      var count1 = 0; // Number of times in a row that first run won
      var count2 = 0; // Number of times in a row that second run won

      /*
       * Do the straightforward thing until (if ever) one run appears to win consistently.
       */
      do {
        if (compare(tmp[cursor2], a[cursor1]) < 0) {
          a[dest--] = a[cursor1--];
          count1++;
          count2 = 0;
          if (--len1 == 0) break outer;
        } else {
          a[dest--] = tmp[cursor2--];
          count2++;
          count1 = 0;
          if (--len2 == 1) break outer;
        }
      } while ((count1 | count2) < minGallop);

      /*
       * One run is winning so consistently that galloping may be a huge win. So try that, and continue galloping until (if
       * ever) neither run appears to be winning consistently anymore.
       */
      do {
        count1 = len1 - gallopRight(tmp[cursor2], a, base1, len1, len1 - 1, c);
        if (count1 != 0) {
          dest -= count1;
          cursor1 -= count1;
          len1 -= count1;
          arraycopy(a, cursor1 + 1, a, dest + 1, count1);
          if (len1 == 0) break outer;
        }
        a[dest--] = tmp[cursor2--];
        if (--len2 == 1) break outer;

        count2 = len2 - gallopLeft(a[cursor1], tmp, 0, len2, len2 - 1, c);
        if (count2 != 0) {
          dest -= count2;
          cursor2 -= count2;
          len2 -= count2;
          arraycopy(tmp, cursor2 + 1, a, dest + 1, count2);
          if (len2 <= 1)
            // len2 == 1 || len2 == 0
            break outer;
        }
        a[dest--] = a[cursor1--];
        if (--len1 == 0) break outer;
        minGallop--;
      } while ((count1 >= MIN_GALLOP) | (count2 >= MIN_GALLOP));
      if (minGallop < 0) minGallop = 0;
      minGallop += 2; // Penalize for leaving gallop mode
    } // End of "outer" loop
    this.minGallop = minGallop < 1 ? 1 : minGallop; // Write back to field

    if (len2 == 1) {
      dest -= len1;
      cursor1 -= len1;
      arraycopy(a, cursor1 + 1, a, dest + 1, len1);
      a[dest] = tmp[cursor2]; // Move first elt of run2 to front of merge
    } else if (len2 == 0) {
      throw new Error(
        "IllegalArgumentException. Comparison method violates its general contract!"
      );
    } else {
      arraycopy(tmp, 0, a, dest - (len2 - 1), len2);
    }
  }

  /**
   * Checks that fromIndex and toIndex are in range, and throws an appropriate exception if they aren't.
   *
   * @param arrayLen the length of the array
   * @param fromIndex the index of the first element of the range
   * @param toIndex the index after the last element of the range
   * @throws IllegalArgumentException if fromIndex > toIndex
   * @throws ArrayIndexOutOfBoundsException if fromIndex < 0 or toIndex > arrayLen
   */
  function rangeCheck(arrayLen, fromIndex, toIndex) {
    if (fromIndex > toIndex)
      throw new Error(
        "IllegalArgument fromIndex(" +
          fromIndex +
          ") > toIndex(" +
          toIndex +
          ")"
      );
    if (fromIndex < 0) throw new Error("ArrayIndexOutOfBounds " + fromIndex);
    if (toIndex > arrayLen) throw new Error("ArrayIndexOutOfBounds " + toIndex);
  }
}

// // java System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
function arraycopy(s, spos, d, dpos, len) {
  var a = s.slice(spos, spos + len);
  while (len--) {
    d[dpos + len] = a[len];
  }
}

// function timSort(array, compare) {
//   const length = array.length;
//   if (length < 2) {
//     return;
//   }

//   let pendingRunsSize = 0;

//   let pendingRuns = [];

//   let remaining = length;

//   let low = 0;

//   // 计算run的长度
//   const minRunLength = ComputeMinRunLength(remaining);

//   while (remaining !== 0) {
//     let currentRunLength = CountAndMakeRun(low, low + remaining);
//     if (currentRunLength < minRunLength) {
//       const forcedRunLength = Math.min(minRunLength, remaining);
//       BinaryInsertionSort(low, low + currentRunLength, low + forcedRunLength);
//       currentRunLength = forcedRunLength;
//     }
//     // Push run onto pending-runs stack, and maybe merge.
//     PushRun(low, currentRunLength);
//     MergeCollapse();
//   }

//   function MergeCollapse() {
//     while (pendingRunsSize > 1) {
//       let n = pendingRunsSize - 2;
//       if (
//         !RunInvariantEstablished(pendingRuns, n + 1) ||
//         !RunInvariantEstablished(pendingRuns, n)
//       ) {
//         if (
//           GetPendingRunLength(pendingRuns, n - 1) <
//           GetPendingRunLength(pendingRuns, n + 1)
//         ) {
//           --n;
//         }
//       }
//     }
//   }

//   function GetPendingRunLength(pendingRuns, run) {
//     return pendingRuns[(run << 1) + 1];
//   }

//   function RunInvariantEstablished(pendingRuns) {
//     if (n < 2) {
//       return true;
//     }
//   }
//   function CountAndMakeRun(lowArg, high) {
//     let low = lowArg + 1;
//     if (low == high) return 1;

//     let runLength = 2;

//     const elementLow = array[low];
//     const elementLowPred = array[low - 1];
//     let order = compare(elementLow, elementLowPred);
//     // 是否是降序
//     const isDescending = order < 0 ? true : false;

//     let previousElement = elementLow;

//     for (let idx = low + 1; idx < high; ++idx) {
//       const currentElement = array[idx];
//       order = compare(currentElement, previousElement);
//       if (isDescending) {
//         // 降序
//         if (order >= 0) break;
//       } else {
//         if (order < 0) break;
//       }
//       previousElement = currentElement;
//       ++runLength;
//     }

//     if (isDescending) {
//       ReverseRange(array, lowArg, lowArg + runLength);
//     }
//     return runLength;
//   }

//   // 对于小数组的排序来说，二分插入排序是最优的方法。因为它很少比较，更多的是移动元素。
//   // On entry, must have low <= start <= high, and that [low, start) is
//   // already sorted. Pass start == low if you do not know!.
//   function BinaryInsertionSort(low, startArg, high) {
//     let start = low == startArg ? startArg + 1 : startArg;
//     for (; start < high; ++start) {
//       let left = low;
//       let right = start;
//       const pivot = array[right];
//       while (left < right) {
//         const mid = left + ((left - right) >> 1);
//         const order = compare(pivot, array[mid]);
//         if (order < 0) {
//           right = mid;
//         } else {
//           left = mid + 1;
//         }
//       }
//       for (let p = start; p > left; --p) {
//         array[p] = array[p - 1];
//       }
//       array[left] = pivot;
//     }
//   }

//   function PushRun(base, length) {
//     const stackSize = pendingRunsSize;

//     SetPendingRunBase(pendingRuns, stackSize, base);
//     SetPendingRunLength(pendingRuns, stackSize, length);
//     pendingRunsSize = stackSize + 1;
//   }
// }

// function SetPendingRunBase(pendingRuns, run, value) {
//   pendingRuns[run << 1] = value;
// }

// function SetPendingRunLength(pendingRuns, run, value) {
//   pendingRuns[(run << 1) + 1] = value;
// }

// function ReverseRange(array, from, to) {
//   let low = from;
//   let high = to - 1;
//   while (low - high) {
//     const elementLow = array[low];
//     const elementHigh = array[high];
//     array[low++] = elementHigh;
//     array[high++] = elementLow;
//   }
// }

// // 计算最优的run长度
// // 1. n<64 返回64
// // 2. 如果n是2的幂 返回32
// // 3. 返回一个整数k，并且32 <= k <= 64
// function ComputeMinRunLength(nArg) {
//   let n = nArg;
//   let r = 0;
//   // 如果n>=64, 就右移一位（/2）
//   while (n >= 64) {
//     r = r | (n & 1);
//     console.log("rrrr", r); //sy-log
//     n = n >> 1;
//   }
//   const minRunLength = n + r;
//   return minRunLength;
// }

module.exports = { insertionSort, quickSort, mergeSort, timSort };
