import isNumber from 'lodash/isNumber'

export default class TreeNode {
  // TODO 显示最大depth
  /**
   *
   * @param bottom_left 左下角
   * @param width 长
   * @param height 宽
   * @param depth 深度
   */
  constructor(bottom_left, width, height, depth) {
    this.bottom_left = bottom_left
    this.width = width
    this.height = height
    this.depth = depth
    this.max = 4 // childrenData 最大程度
    this.childrenData = []
    this.children = null // 子节点
    this.selfData = [] // 自身数据
    this.center = [this.bottom_left[0] + width / 2, this.bottom_left[1] + height / 2]
  }

  /**
   * 添加数据
   * @param point
   */
  add(point) {
    if (isNumber(point.x) && isNumber(point.y)) {
      if (this.isInArea(point.x, point.y)) {
        const dimension = this.whichDimension(point.x, point.y)
        if (dimension === 0 /*添加给自己*/) {
          this.selfData.push(point)
        } else {
          if (this.children) {
            // 交给子节点处理
            this.children[dimension - 1].add(point)
          } else {
            // 暂时添加到自己的数据集
            this.childrenData.push(point)
            if (this.childrenData.length > this.max) {
              this.split()
            }
          }
        }
      }
    } else {
      throw new Error(`x and y must be number!`)
    }
  }

  /**
   * 分割
   * childrenData长度大于4时
   */
  split() {
    this.initChildren()
    this.childrenData.forEach(data => {
      const dimension = this.whichDimension(data.x, data.y)
      this.children[dimension - 1].add(data)
    })
    this.childrenData = [] // 清空childrenData
  }

  /**
   * 初始化子节点
   */
  initChildren() {
    const halfWidth = this.width / 2,
      halfHeight = this.height / 2
    this.children = [
      new TreeNode(this.center, halfWidth, halfHeight, this.depth + 1),
      new TreeNode([this.center[0], this.bottom_left[1]], halfWidth, halfHeight, this.depth + 1),
      new TreeNode(this.bottom_left, halfWidth, halfHeight, this.depth + 1),
      new TreeNode([this.bottom_left[0], this.center[1]], halfWidth, halfHeight, this.depth + 1),
    ]
  }

  /**
   * 判断属于哪个象限
   * @param x
   * @param y
   * @return {number}
   */
  whichDimension(x, y) {
    if (x > this.center[0]) {
      if (y > this.center[1]) {
        return 1
      } else if (y < this.center[1]) {
        return 2
      }
    } else if (x < this.center[0]) {
      if (y > this.center[1]) {
        return 4
      } else if (y < this.center[1]) {
        return 3
      }
    }
    return 0
  }

  /**
   * 遍历子节点
   * @param callback
   */
  visit(callback) {
    const toBeContinue = callback(this)
    if (this.children && toBeContinue) {
      this.children.forEach(child => {
        child.visit(callback)
      })
    }
  }

  /**
   * 判断一个点是否落在该区域
   * @param x
   * @param y
   * @return {boolean}
   */
  isInArea(x, y) {
    return x >= this.bottom_left[0] && x <= this.bottom_left[0] + this.width
      && y >= this.bottom_left[1] && y <= this.bottom_left[1] + this.height
  }

  /**
   * 获取自身的数据集
   * 不包含子元素
   * @return {Array}
   */
  getData() {
    return this.selfData
  }
}
