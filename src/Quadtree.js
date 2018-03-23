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
    this.root = new TreeNode([0, 0], width, height, 0)
  }

  /**
   * 添加数据
   * @param data
   */
  add(data) {
    [].concat(data).forEach(d => {
      this.root.add(d)
    })
  }

  /**
   * 遍历
   * @param callback
   */
  visit(callback) {
    this.root.visit(callback)
  }
}
