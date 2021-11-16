const searchInsert = (nums, target) => {
  let low = 0,
    high = nums.length - 1,
    mid;
  while (low <= high) {
    mid = (low + high) >> 1;
    if (target < nums[mid]) {
      high = mid - 1;
    } else if (target > nums[mid]) {
      left = mid + 1;
    } else {
      return mid;
    }
  }
};
