'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _TreeNode = require('./TreeNode');

var _TreeNode2 = _interopRequireDefault(_TreeNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Quadtree = function () {
  /**
   *
   * @param width 宽
   * @param height 高
   * @param maxDepth 最大深度
   */
  function Quadtree(width, height, maxDepth) {
    (0, _classCallCheck3.default)(this, Quadtree);

    this.maxDepth = maxDepth;
    this.root = new _TreeNode2.default([0, 0], width, height, 0);
  }

  /**
   * 添加数据
   * @param data
   * @return {Quadtree}
   */


  (0, _createClass3.default)(Quadtree, [{
    key: 'add',
    value: function add(data) {
      var _this = this;

      [].concat(data).forEach(function (d) {
        _this.root.add(d);
      });
      return this;
    }

    /**
     * 遍历
     * @param callback
     */

  }, {
    key: 'visit',
    value: function visit(callback) {
      this.root.visit(callback);
    }

    /**
     * 更新某个位置对应的点
     * @param point
     */

  }, {
    key: 'update',
    value: function update(point) {
      var node = point.__belong;
      if (node) {
        node.remove(point);
      }
      this.add(point);
    }
  }]);
  return Quadtree;
}();

exports.default = Quadtree;