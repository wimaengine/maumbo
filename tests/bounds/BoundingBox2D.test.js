import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, Vector2 } from "hisabati"
import { BoundingBox2D } from "../../dist/index.module.js"

test("BoundingBox2D: constructor initializes min and max", () => {
  const bounds = new BoundingBox2D(1, 2, 3, 4)

  strictEqual(bounds.min.x, 1)
  strictEqual(bounds.min.y, 2)
  strictEqual(bounds.max.x, 3)
  strictEqual(bounds.max.y, 4)
})

test("BoundingBox2D: instance translate mutates and returns itself", () => {
  const bounds = new BoundingBox2D(1, 2, 3, 4)
  const translated = bounds.translate(5, 6)

  strictEqual(translated, bounds)
  strictEqual(bounds.min.x, 6)
  strictEqual(bounds.min.y, 8)
  strictEqual(bounds.max.x, 8)
  strictEqual(bounds.max.y, 10)
})

test("BoundingBox2D: clone creates a deep copy", () => {
  const bounds = new BoundingBox2D(1, 2, 3, 4)
  const clone = bounds.clone()

  strictEqual(clone === bounds, false)
  strictEqual(clone.min === bounds.min, false)
  strictEqual(clone.max === bounds.max, false)
  strictEqual(clone.min.x, 1)
  strictEqual(clone.min.y, 2)
  strictEqual(clone.max.x, 3)
  strictEqual(clone.max.y, 4)
})

test("BoundingBox2D: instance copy overwrites the target", () => {
  const source = new BoundingBox2D(1, 2, 3, 4)
  const target = new BoundingBox2D()

  target.copy(source)

  strictEqual(target.min.x, 1)
  strictEqual(target.min.y, 2)
  strictEqual(target.max.x, 3)
  strictEqual(target.max.y, 4)
})

test("BoundingBox2D: static copy supports an explicit output", () => {
  const source = new BoundingBox2D(1, 2, 3, 4)
  const out = new BoundingBox2D()
  const result = BoundingBox2D.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.min.x, 1)
  strictEqual(out.min.y, 2)
  strictEqual(out.max.x, 3)
  strictEqual(out.max.y, 4)
})

test("BoundingBox2D: static translate supports an explicit output", () => {
  const source = new BoundingBox2D(1, 2, 3, 4)
  const out = new BoundingBox2D()
  const result = BoundingBox2D.translate(source, 5, 6, out)

  strictEqual(result, out)
  strictEqual(out.min.x, 6)
  strictEqual(out.min.y, 8)
  strictEqual(out.max.x, 8)
  strictEqual(out.max.y, 10)
})

test("BoundingBox2D: instance transform rebuilds extents from rotated corners", () => {
  const bounds = new BoundingBox2D(-2, -1, 2, 1)
  const transform = new Affine2()
    .rotate(Rotary.fromAngle(Math.PI * 0.5))
    .translate(new Vector2(5, 6))
  const result = bounds.transform(transform)

  strictEqual(result, undefined)
  strictEqual(bounds.min.x, 4)
  strictEqual(bounds.min.y, 4)
  strictEqual(bounds.max.x, 6)
  strictEqual(bounds.max.y, 8)
})

test("BoundingBox2D: static transform supports an explicit output", () => {
  const source = new BoundingBox2D(-2, -1, 2, 1)
  const transform = new Affine2()
    .rotate(Rotary.fromAngle(Math.PI * 0.5))
    .translate(new Vector2(5, 6))
  const out = new BoundingBox2D()
  const result = BoundingBox2D.transform(source, transform, out)

  strictEqual(result, out)
  strictEqual(out.min.x, 4)
  strictEqual(out.min.y, 4)
  strictEqual(out.max.x, 6)
  strictEqual(out.max.y, 8)
})

test("BoundingBox2D: union spans both input boxes", () => {
  const left = new BoundingBox2D(1, 5, 3, 7)
  const right = new BoundingBox2D(-2, 4, 6, 9)
  const out = new BoundingBox2D()
  const result = BoundingBox2D.union(left, right, out)

  strictEqual(result, out)
  strictEqual(out.min.x, -2)
  strictEqual(out.min.y, 4)
  strictEqual(out.max.x, 6)
  strictEqual(out.max.y, 9)
})
