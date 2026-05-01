import test from "node:test"
import { deepStrictEqual, strictEqual } from "node:assert"
import { Vector2 } from "hisabati"
import { Rectangle } from "../../dist/index.module.js"

test("Rectangle stores half extents", () => {
  const rect = new Rectangle(3, 4)

  strictEqual(rect.halfWidth, 3)
  strictEqual(rect.halfHeight, 4)
})

test("Rectangle.getPoints returns the four corners in winding order", () => {
  const rect = new Rectangle(2, 1)

  deepStrictEqual(rect.getPoints(), [
    new Vector2(-2, -1),
    new Vector2(2, -1),
    new Vector2(2, 1),
    new Vector2(-2, 1),
  ])
})
