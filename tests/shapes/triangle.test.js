import test from "node:test"
import { deepStrictEqual, strictEqual } from "node:assert"
import { Vector2 } from "hisabati"
import { Triangle } from "../../dist/index.module.js"

test("Triangle stores dimensions and default baseRatio", () => {
  const triangle = new Triangle(2, 3)

  strictEqual(triangle.halfBase, 2)
  strictEqual(triangle.halfHeight, 3)
  strictEqual(triangle.baseRatio, 0)
})

test("Triangle.getPoints uses baseRatio for the apex", () => {
  const triangle = new Triangle(2, 3, 0.5)

  deepStrictEqual(triangle.getPoints(), [
    new Vector2(-2, -3),
    new Vector2(2, -3),
    new Vector2(1, 3),
  ])
})
