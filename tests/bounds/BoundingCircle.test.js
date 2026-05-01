import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import { BoundingCircle } from "../../dist/index.module.js"

test("BoundingCircle: constructor initializes position and radius", () => {
  const circle = new BoundingCircle(1, 2, 3)

  strictEqual(circle.position.x, 1)
  strictEqual(circle.position.y, 2)
  strictEqual(circle.radius, 3)
})

test("BoundingCircle: instance translate mutates in place", () => {
  const circle = new BoundingCircle(1, 2, 3)
  const result = circle.translate(4, 5)

  strictEqual(result, undefined)
  strictEqual(circle.position.x, 5)
  strictEqual(circle.position.y, 7)
  strictEqual(circle.radius, 3)
})

test("BoundingCircle: instance copy overwrites position and radius", () => {
  const source = new BoundingCircle(1, 2, 3)
  const target = new BoundingCircle()
  const result = target.copy(source)

  strictEqual(result, undefined)
  strictEqual(target.position.x, 1)
  strictEqual(target.position.y, 2)
  strictEqual(target.radius, 3)
})

test("BoundingCircle: static translate preserves radius", () => {
  const source = new BoundingCircle(1, 2, 3)
  const out = new BoundingCircle()
  const result = BoundingCircle.translate(source, 4, 5, out)

  strictEqual(result, out)
  strictEqual(out.position.x, 5)
  strictEqual(out.position.y, 7)
  strictEqual(out.radius, 3)
})

test("BoundingCircle: static copy supports an explicit output", () => {
  const source = new BoundingCircle(1, 2, 3)
  const out = new BoundingCircle()
  const result = BoundingCircle.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.position.x, 1)
  strictEqual(out.position.y, 2)
  strictEqual(out.radius, 3)
})

test("BoundingCircle: instance transform updates position and scales radius", () => {
  const circle = new BoundingCircle(1, 2, 3)
  const transform = new Affine2()
    .scale(new Vector2(2, 4))
    .translate(new Vector2(5, 6))
  const result = circle.transform(transform)

  strictEqual(result, undefined)
  strictEqual(circle.position.x, 7)
  strictEqual(circle.position.y, 14)
  strictEqual(circle.radius, 12)
})

test("BoundingCircle: static transform supports an explicit output", () => {
  const source = new BoundingCircle(1, 2, 3)
  const transform = new Affine2()
    .scale(new Vector2(2, 4))
    .translate(new Vector2(5, 6))
  const out = new BoundingCircle()
  const result = BoundingCircle.transform(source, transform, out)

  strictEqual(result, out)
  strictEqual(out.position.x, 7)
  strictEqual(out.position.y, 14)
  strictEqual(out.radius, 12)
})
