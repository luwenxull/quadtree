function isValidNum(v) {
  return typeof v === 'number' && !Number.isNaN(v)
}

export default class TreeNode {
  // TODO 显示最大depth
  /**
   *
   * @param bottom_left 左下角
   * @param top_right 右上角
   * @param depth 深度
   */
  constructor(bottom_left, top_right, depth) {
    this.setBaseSpaceData(bottom_left, top_right)
    this.depth = depth
    this.max = 4 // childrenData 最大程度
    // 节点未曾split时，暂存的子节点数据
    this.childrenData = []
    this.children = null // 子节点
    // 自身数据
    // 正好落在以自身中心点为原点的坐标轴上
    this.selfData = []
  }

  /**
   * 设置边界，中心，宽高
   * @param bottom_left
   * @param top_right
   */
  setBaseSpaceData(bottom_left, top_right) {
    this.bottom_left = bottom_left
    this.top_right = top_right
    this.center = [(bottom_left[0] + top_right[0]) / 2, (bottom_left[1] + top_right[1]) / 2]
    this.width = top_right[0] - bottom_left[0]
    this.height = top_right[1] - bottom_left[1]
  }

  /**
   * 添加数据
   * @param point
   * @return {TreeNode}
   */
  add(point) {
    if (isValidNum(point.x) && isValidNum(point.y)) {
      if (this.isInArea(point.x, point.y)) {
        const dimension = this.whichDimension(point.x, point.y)
        if (dimension === 0 /*添加给自己*/) {
          this.selfData.push(Object.assign(point, {
            __belong: this
          }))
        } else {
          if (this.children) {
            // 交给子节点处理
            this.children[dimension - 1].add(point)
          } else {
            // 暂时添加到自己的数据集
            this.childrenData.push(Object.assign(point, {
              __belong: this // 子节点的add方法会更新这个字段
            }))
            if (this.childrenData.length > this.max) {
              this.split()
            }
          }
        }
      }
    } else {
      throw new Error(`x and y must be number!`)
    }
    return this
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
    this.children = [
      new TreeNode(this.center, this.top_right, this.depth + 1),
      new TreeNode([this.center[0], this.bottom_left[1]], [this.top_right[0], this.center[1]], this.depth + 1),
      new TreeNode(this.bottom_left, this.center, this.depth + 1),
      new TreeNode([this.bottom_left[0], this.center[1]], [this.center[0], this.top_right[1]], this.depth + 1),
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
    if (typeof callback !== 'function') {
      throw new Error('Visit callback must be a function')
    }
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
   * 不包含子节点
   * @return {Array}
   */
  getData() {
    return [].concat(this.selfData).concat(this.childrenData)
  }

  /**
   * 获取所有是元素
   * 包括子节点的
   */
  getAllData() {
    let all = this.getData()
    this.visit(node => {
      all = all.concat(node.getData())
      return true
    })
  }
  
  /**
   * 移除某个点
   * 基于引用
   * @param point
   */
  remove(point) {
    let removeIndex = null
    for (let i = 0; i < this.selfData.length; i++) {
      if (this.selfData[i] === point) {
        removeIndex = i
        break
      }
    }
    if (removeIndex !== null) {
      this.selfData.splice(removeIndex, 1)
    } else {
      for (let i = 0; i < this.childrenData.length; i++) {
        if (this.childrenData[i] === point) {
          removeIndex = i
          break
        }
      }
      if (removeIndex !== null) {
        this.childrenData.splice(removeIndex, 1)
      }
    }
  }

  /**
   * 扩展
   * @param x
   * @param y
   */
  extent(x, y) {
    let [minX, minY] = this.bottom_left
    let [maxX, maxY] = this.top_right
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
    this.setBaseSpaceData([minX, minY], [maxX, maxY])
  }
}
