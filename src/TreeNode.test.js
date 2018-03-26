import TreeNode from './TreeNode'

test('which dimension', () => {
  const node = new TreeNode([0, 0], 100, 100, 0)
  expect(node.whichDimension(60, 60)).toBe(1)
  expect(node.whichDimension(60, 20)).toBe(2)
  expect(node.whichDimension(10, 60)).toBe(4)
  expect(node.whichDimension(10, 10)).toBe(3)
  expect(node.whichDimension(50, 0)).toBe(0)
})

test('init children', () => {
  const node = new TreeNode([0, 0], 100, 100, 0)
  node.initChildren()
  expect(node.children.length).toBe(4)
  expect(node.children[0].bottom_left).toEqual([50, 50])
  expect(node.children[1].bottom_left).toEqual([50, 0])
  expect(node.children[2].bottom_left).toEqual([0, 0])
  expect(node.children[3].bottom_left).toEqual([0, 50])
  expect(node.children[0].depth).toBe(1)
})

test('add', () => {
  const node = new TreeNode([0, 0], 100, 100, 0)
  const p = { x: 10, y: 10 }
  node.add(p)
  node.add({x: 60, y: 60})
  node.add({x: 10, y: 60})
  node.add({x: 60, y: 10})
  node.add({x: 10000, y: 0})
  expect(node.childrenData.length).toBe(4)
  expect(p.__belong).toBe(node)
  node.add({x: 10, y: 10})
  expect(node.childrenData.length).toBe(0)
  expect(node.children.length).toBe(4)
  expect(node.children[2].childrenData.length).toBe(2)
  expect(p.__belong).toBe(node.children[2])
})