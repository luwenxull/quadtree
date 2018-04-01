import Quadtree from './Quadtree'

test('set root node', () => {
  const tree = new Quadtree(100, 100)
  tree.setRootNode([{x: 10, y: 10}])
  expect(tree.root.center).toEqual([10, 10])
  tree.setRootNode([
    {x: 10, y: 10},
    {x: 60, y: 60},
    {x: 60, y: 10},
    {x: 10, y: 60},
  ])
  expect(tree.boundary).toEqual([[10, 10], [60, 60]])
})

test('add all', () => {
  const tree = new Quadtree()
  tree.addAll([
    {x: 10, y: 10},
    {x: 60, y: 60},
    {x: 60, y: 10},
    {x: 10, y: 60},
  ])
  expect(tree.root.childrenData.length).toBe(4)
})

test('visit', () => {
  const fn = jest.fn()
  const tree = new Quadtree(100, 100)
  tree.addAll([
    {x: 10, y: 10},
    {x: 60, y: 60},
    {x: 60, y: 10},
    {x: 10, y: 60},
  ])
  tree.visit(fn)
  expect(fn.mock.calls.length).toBe(1)
  expect(fn.mock.calls[0][0]).toBe(tree.root)
  tree.addAll([
    {x: 10, y: 10},
    {x: 60, y: 60},
    {x: 60, y: 10},
    {x: 10, y: 60},
  ])

  fn.mockClear()
  fn.mockReturnValue(false)
  tree.visit(fn)
  expect(fn.mock.calls.length).toBe(1)

  fn.mockClear()
  fn.mockReturnValue(true)
  tree.visit(fn)
  console.log(tree)
  expect(fn.mock.calls.length).toBe(5)

  const p = {
    x: 12, y: 12
  }
  let all = []
  const realFn = (node) => {
    if (node.isInArea(p.x, p.y)) {
      all = all.concat(node.getData())
      return true
    }
    return false
  }
  tree.visit(realFn)
  expect(all.length).toBe(2)
})

test('update', () => {
  const fn = jest.fn()
  const tree = new Quadtree(100, 100)
  const p = {x: 10, y: 10}
  const p2 = {x: 40, y: 60}
  tree.addAll([p, p2])
  p.x = 20
  tree.update(p)
  expect(tree.root.childrenData.length).toBe(2)
})
