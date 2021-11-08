// m个苹果， n个盘子
function apple(m, n) {
  if (m === 1 || n === 1) {
    return 1;
  }

  if (m < n) {
    return apple(m, m);
  }

  if (n === 2) {
    return Math.floor(m / 2) + 1;
  }

  if (n === 3) {
  }

  if (m == 2) {
    return 2;
  }

  let n2 = n;
  // 盘子太多也是空的
  if (m < n) {
    n2 = n;
  }

  return apple(m - 1, n) + apple();
}
