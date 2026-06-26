import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import { Intersection2D } from "../../dist/index.module.js"

test("Intersection2D.transform: translates points without moving normals", () => {
  const intersection = new Intersection2D(
    [new Vector2(1, 2)],
    [new Vector2(0, -1)]
  )
  const transform = Affine2.identity()
  transform.x = 3
  transform.y = -4

  intersection.transform(transform)

  strictEqual(intersection.points[0].x, 4)
  strictEqual(intersection.points[0].y, -2)
  strictEqual(intersection.normals[0].x, 0)
  strictEqual(intersection.normals[0].y, -1)
})
