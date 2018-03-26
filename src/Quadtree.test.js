import Quadtree from './Quadtree'

test('add', () => {
  const tree = new Quadtree(100, 100)
  tree.add({x: 10, y: 10})
  expect(tree.root.childrenData[0].x).toBe(10)
  expect(tree.root.childrenData[0].y).toBe(10)
})

test('visit', () => {
  const fn = jest.fn()
  const tree = new Quadtree(100, 100)
  tree.add([
    {x: 10, y: 10},
    {x: 60, y: 60},
    {x: 60, y: 10},
    {x: 10, y: 60},
  ])
  tree.visit(fn)
  expect(fn.mock.calls.length).toBe(1)
  expect(fn.mock.calls[0][0]).toBe(tree.root)
  tree.add([
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
