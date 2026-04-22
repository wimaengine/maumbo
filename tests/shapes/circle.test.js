import test from "node:test"
import { deepStrictEqual, ok, strictEqual } from "node:assert"
import { Vector2, fuzzyEqual } from "hisabati"
import { Circle, Shape2 } from "../../dist/index.module.js"

test("Circle stores radius and extends Shape2", () => {
  const circle = new Circle(3)

  strictEqual(circle.radius, 3)
  strictEqual(circle instanceof Shape2, true)
})

test("Circle.getVertices returns support points along the given axis", () => {
  const circle = new Circle(2)
  const [v1, v2] = circle.getVertices(new Vector2(3, 0))

  deepStrictEqual(v1, new Vector2(2, 0))
  ok(fuzzyEqual(v2.x, -2, 1e-12))
  ok(fuzzyEqual(v2.y, 0, 1e-12))
})

test("Circle.getPoints returns evenly spaced points on the perimeter", () => {
  const circle = new Circle(2)
  const points = circle.getPoints(4)

  strictEqual(points.length, 4)
  ok(fuzzyEqual(points[0].x, 2))
  ok(fuzzyEqual(points[0].y, 0))
  ok(fuzzyEqual(points[1].x, 0, 1e-12))
  ok(fuzzyEqual(points[1].y, 2))
  ok(fuzzyEqual(points[2].x, -2))
  ok(fuzzyEqual(points[2].y, 0, 1e-12))
  ok(fuzzyEqual(points[3].x, 0, 1e-12))
  ok(fuzzyEqual(points[3].y, -2))
})
