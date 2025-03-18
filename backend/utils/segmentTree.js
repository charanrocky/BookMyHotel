export class SegmentTree {
  constructor(prices) {
    this.n = prices.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(prices, 0, this.n - 1, 0);
  }

  build(prices, start, end, node) {
    if (start > end) return;

    if (start === end) {
      this.tree[node] = prices[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);

    this.build(prices, start, mid, 2 * node + 1);
    this.build(prices, mid + 1, end, 2 * node + 2);

    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  update(index, value, start, end, node) {
    if (start === end) {
      this.tree[node] = value;
      return;
    }

    const mid = Math.floor((start + end) / 2);

    if (index <= mid) {
      this.update(index, value, start, mid, 2 * node + 1);
    } else {
      this.update(index, value, mid + 1, end, 2 * node + 2);
    }

    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  getSum(left, right, start, end, node) {
    if (left <= start && end <= right) return this.tree[node];
    if (end < left || right < start) return 0;

    const mid = Math.floor((start + end) / 2);

    return (
      this.getSum(left, right, start, mid, 2 * node + 1) +
      this.getSum(left, right, mid + 1, end, 2 * node + 2)
    );
  }
}
