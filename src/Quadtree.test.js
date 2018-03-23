import Quadtree from './Quadtree'

test('add', () => {
  const tree = new Quadtree(100, 100)
  tree.add({x: 10, y: 10})
  expect(tree.root.childrenData[0]).toEqual({x: 10, y: 10})
})

test('visit', () => {
  const tree = new Quadtree(100, 100)
  tree.add({x: 10, y: 10})
})