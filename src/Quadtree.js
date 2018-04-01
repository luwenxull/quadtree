import TreeNode from './TreeNode'

export default class Quadtree {
  /**
   *
   * @param width 宽
   * @param height 高
   * @param maxDepth 最大深度
   */
  constructor(width, height, maxDepth) {
    this.maxDepth = maxDepth
    this.boundary = [new Array(2), new Array(2)]
    // this.root = new TreeNode([0, 0], width, height, 0)
  }

  /**
   * 设置边界
   * @param datas
   */
  setRootNode(datas) {
    if (datas.length) {
      const first = datas[0]
      let minX = first.x, maxX = first.x, minY = first.y, maxY = first.y
      for (let i = 1, l = datas.length; i < l; i++) {
        minX = Math.min(minX, datas[i].x)
        maxX = Math.max(maxX, datas[i].x)
        minY = Math.min(minY, datas[i].y)
        maxY = Math.max(maxY, datas[i].y)
      }
      this.boundary = [[minX, minY], [maxX, maxY]]
      this.root = new TreeNode(this.boundary[0], this.boundary[1])
    }
  }

  /**
   * 添加数据
   * 这个方法会重置当前的root tree
   * @param datas
   * @return {Quadtree}
   */
  addAll(datas) {
    this.setRootNode(datas)
    for (let i = 0, l = datas.length; i < l; i++) {
      this.root.add(datas[i])
    }
    return this
  }

  add(data) {
    this.root.add(data)
  }

  /**
   * 遍历
   * @param callback
   */
  visit(callback) {
    this.root.visit(callback)
  }

  /**
   * 更新某个位置对应的点
   * @param point
   */
  update(point) {
    const node = point.__belong
    if (node) {
      node.remove(point)
    }
    this.add(point)
  }
}
