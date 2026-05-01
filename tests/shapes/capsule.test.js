import test from "node:test"
import { strictEqual } from "node:assert"
import { Capsule } from "../../dist/index.module.js"

test("Capsule stores radius and halfHeight", () => {
  const capsule = new Capsule(1.5, 4)

  strictEqual(capsule.radius, 1.5)
  strictEqual(capsule.halfHeight, 4)
})

test("Capsule.aabb2d spans the segment and cap radius", () => {
  const capsule = new Capsule(1.5, 4)
  const aabb = capsule.aabb2d()

  strictEqual(aabb.min.x, -1.5)
  strictEqual(aabb.min.y, -5.5)
  strictEqual(aabb.max.x, 1.5)
  strictEqual(aabb.max.y, 5.5)
})
