import test from "node:test"
import { strictEqual } from "node:assert"
import { Vector3 } from "hisabati"
import { BoundingBox3D } from "../../dist/index.module.js"

test("BoundingBox3D: constructor initializes min and max", () => {
  const bounds = new BoundingBox3D(1, 2, 3, 4, 5, 6)

  strictEqual(bounds.min.x, 1)
  strictEqual(bounds.min.y, 2)
  strictEqual(bounds.min.z, 3)
  strictEqual(bounds.max.x, 4)
  strictEqual(bounds.max.y, 5)
  strictEqual(bounds.max.z, 6)
})

test("BoundingBox3D: instance translate mutates and returns itself", () => {
  const bounds = new BoundingBox3D(1, 2, 3, 4, 5, 6)
  const translated = bounds.translate(new Vector3(7, 8, 9))

  strictEqual(translated, bounds)
  strictEqual(bounds.min.x, 8)
  strictEqual(bounds.min.y, 10)
  strictEqual(bounds.min.z, 12)
  strictEqual(bounds.max.x, 11)
  strictEqual(bounds.max.y, 13)
  strictEqual(bounds.max.z, 15)
})

test("BoundingBox3D: clone creates a deep copy", () => {
  const bounds = new BoundingBox3D(1, 2, 3, 4, 5, 6)
  const clone = bounds.clone()

  strictEqual(clone === bounds, false)
  strictEqual(clone.min === bounds.min, false)
  strictEqual(clone.max === bounds.max, false)
  strictEqual(clone.min.x, 1)
  strictEqual(clone.min.y, 2)
  strictEqual(clone.min.z, 3)
  strictEqual(clone.max.x, 4)
  strictEqual(clone.max.y, 5)
  strictEqual(clone.max.z, 6)
})

test("BoundingBox3D: instance copy overwrites the target", () => {
  const source = new BoundingBox3D(1, 2, 3, 4, 5, 6)
  const target = new BoundingBox3D()

  target.copy(source)

  strictEqual(target.min.x, 1)
  strictEqual(target.min.y, 2)
  strictEqual(target.min.z, 3)
  strictEqual(target.max.x, 4)
  strictEqual(target.max.y, 5)
  strictEqual(target.max.z, 6)
})

test("BoundingBox3D: static copy supports an explicit output", () => {
  const source = new BoundingBox3D(1, 2, 3, 4, 5, 6)
  const out = new BoundingBox3D()
  const result = BoundingBox3D.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.min.x, 1)
  strictEqual(out.min.y, 2)
  strictEqual(out.min.z, 3)
  strictEqual(out.max.x, 4)
  strictEqual(out.max.y, 5)
  strictEqual(out.max.z, 6)
})

test("BoundingBox3D: static translate supports an explicit output", () => {
  const source = new BoundingBox3D(1, 2, 3, 4, 5, 6)
  const out = new BoundingBox3D()
  const result = BoundingBox3D.translate(source, new Vector3(7, 8, 9), out)

  strictEqual(result, out)
  strictEqual(out.min.x, 8)
  strictEqual(out.min.y, 10)
  strictEqual(out.min.z, 12)
  strictEqual(out.max.x, 11)
  strictEqual(out.max.y, 13)
  strictEqual(out.max.z, 15)
})

test("BoundingBox3D: union spans both input boxes", () => {
  const left = new BoundingBox3D(1, 5, 2, 3, 7, 4)
  const right = new BoundingBox3D(-2, 4, -1, 6, 9, 8)
  const out = new BoundingBox3D()
  const result = BoundingBox3D.union(left, right, out)

  strictEqual(result, out)
  strictEqual(out.min.x, -2)
  strictEqual(out.min.y, 4)
  strictEqual(out.min.z, -1)
  strictEqual(out.max.x, 6)
  strictEqual(out.max.y, 9)
  strictEqual(out.max.z, 8)
})
