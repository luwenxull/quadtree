'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidNum(v) {
  return typeof v === 'number' && !(0, _isNan2.default)(v);
}

var TreeNode = function () {
  // TODO 显示最大depth
  /**
   *
   * @param bottom_left 左下角
   * @param width 长
   * @param height 宽
   * @param depth 深度
   */
  function TreeNode(bottom_left, width, height, depth) {
    (0, _classCallCheck3.default)(this, TreeNode);

    this.bottom_left = bottom_left;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.max = 4; // childrenData 最大程度
    // 节点未曾split时，暂存的子节点数据
    this.childrenData = [];
    this.children = null; // 子节点
    // 自身数据
    // 正好落在以自身中心点为原点的坐标轴上
    this.selfData = [];
    this.center = [this.bottom_left[0] + width / 2, this.bottom_left[1] + height / 2];
  }

  /**
   * 添加数据
   * @param point
   * @return {TreeNode}
   */


  (0, _createClass3.default)(TreeNode, [{
    key: 'add',
    value: function add(point) {
      if (isValidNum(point.x) && isValidNum(point.y)) {
        if (this.isInArea(point.x, point.y)) {
          var dimension = this.whichDimension(point.x, point.y);
          if (dimension === 0 /*添加给自己*/) {
              this.selfData.push((0, _assign2.default)(point, {
                __belong: this
              }));
            } else {
            if (this.children) {
              // 交给子节点处理
              this.children[dimension - 1].add(point);
            } else {
              // 暂时添加到自己的数据集
              this.childrenData.push((0, _assign2.default)(point, {
                __belong: this // 子节点的add方法会更新这个字段
              }));
              if (this.childrenData.length > this.max) {
                this.split();
              }
            }
          }
        }
      } else {
        throw new Error('x and y must be number!');
      }
      return this;
    }

    /**
     * 分割
     * childrenData长度大于4时
     */

  }, {
    key: 'split',
    value: function split() {
      var _this = this;

      this.initChildren();
      this.childrenData.forEach(function (data) {
        var dimension = _this.whichDimension(data.x, data.y);
        _this.children[dimension - 1].add(data);
      });
      this.childrenData = []; // 清空childrenData
    }

    /**
     * 初始化子节点
     */

  }, {
    key: 'initChildren',
    value: function initChildren() {
      var halfWidth = this.width / 2,
          halfHeight = this.height / 2;
      this.children = [new TreeNode(this.center, halfWidth, halfHeight, this.depth + 1), new TreeNode([this.center[0], this.bottom_left[1]], halfWidth, halfHeight, this.depth + 1), new TreeNode(this.bottom_left, halfWidth, halfHeight, this.depth + 1), new TreeNode([this.bottom_left[0], this.center[1]], halfWidth, halfHeight, this.depth + 1)];
    }

    /**
     * 判断属于哪个象限
     * @param x
     * @param y
     * @return {number}
     */

  }, {
    key: 'whichDimension',
    value: function whichDimension(x, y) {
      if (x > this.center[0]) {
        if (y > this.center[1]) {
          return 1;
        } else if (y < this.center[1]) {
          return 2;
        }
      } else if (x < this.center[0]) {
        if (y > this.center[1]) {
          return 4;
        } else if (y < this.center[1]) {
          return 3;
        }
      }
      return 0;
    }

    /**
     * 遍历子节点
     * @param callback
     */

  }, {
    key: 'visit',
    value: function visit(callback) {
      if (typeof callback !== 'function') {
        throw new Error('Visit callback must be a function');
      }
      var toBeContinue = callback(this);
      if (this.children && toBeContinue) {
        this.children.forEach(function (child) {
          child.visit(callback);
        });
      }
    }

    /**
     * 判断一个点是否落在该区域
     * @param x
     * @param y
     * @return {boolean}
     */

  }, {
    key: 'isInArea',
    value: function isInArea(x, y) {
      return x >= this.bottom_left[0] && x <= this.bottom_left[0] + this.width && y >= this.bottom_left[1] && y <= this.bottom_left[1] + this.height;
    }

    /**
     * 获取自身的数据集
     * 不包含子元素
     * @return {Array}
     */

  }, {
    key: 'getData',
    value: function getData() {
      return [].concat(this.selfData).concat(this.childrenData);
    }

    /**
     * 移除某个点
     * 基于引用
     * @param point
     */

  }, {
    key: 'remove',
    value: function remove(point) {
      var removeIndex = null;
      for (var i = 0; i < this.selfData.length; i++) {
        if (this.selfData[i] === point) {
          removeIndex = i;
          break;
        }
      }
      if (removeIndex !== null) {
        this.selfData.splice(removeIndex, 1);
      } else {
        for (var _i = 0; _i < this.childrenData.length; _i++) {
          if (this.childrenData[_i] === point) {
            removeIndex = _i;
            break;
          }
        }
        if (removeIndex !== null) {
          this.childrenData.splice(removeIndex, 1);
        }
      }
    }
  }]);
  return TreeNode;
}();

exports.default = TreeNode;