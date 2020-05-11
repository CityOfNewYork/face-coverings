import styleFn from '../src/js/style'

test('style', () => {
  expect.assertions(3)

  const style = styleFn()

  expect(style.getImage().getFill().getColor()).toBe('rgba(128,61,141,.7)')
  expect(style.getImage().getStroke().getColor()).toBe('#803D8D')
  expect(style.getImage().getStroke().getWidth()).toBe(1)
})