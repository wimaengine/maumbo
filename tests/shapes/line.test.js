import test from "node:test"
import { strictEqual } from "node:assert"
import { Line2 } from "../../dist/index.module.js"

test("Line2 stores halfLength", () => {
  const line = new Line2(5)

  strictEqual(line.halfLength, 5)
})

test("Line2.aabb2d matches the horizontal segment extents", () => {
  const line = new Line2(5)
  const aabb = line.aabb2d()

  strictEqual(aabb.min.x, -5)
  strictEqual(aabb.min.y, 0)
  strictEqual(aabb.max.x, 5)
  strictEqual(aabb.max.y, 0)
})
