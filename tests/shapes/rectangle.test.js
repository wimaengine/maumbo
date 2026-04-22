import test from "node:test"
import { deepStrictEqual, strictEqual } from "node:assert"
import { Vector2 } from "hisabati"
import { Rectangle, Shape2 } from "../../dist/index.module.js"

test("Rectangle stores half extents and extends Shape2", () => {
  const rect = new Rectangle(3, 4)

  strictEqual(rect.halfWidth, 3)
  strictEqual(rect.halfHeight, 4)
  strictEqual(rect instanceof Shape2, true)
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
