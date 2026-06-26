import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Circle, circleRectangleIntersections, Rectangle } from "../../dist/index.module.js"

test("circleRectangleIntersections: returns the rectangle-side crossing points", () => {
  const rect = new Rectangle(1, 1)
  const circle = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 1.5

  const intersections = circleRectangleIntersections(
    circle,
    rect,
    transform
  )
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.points[0].x, 0.5, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0.8660254037844386, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].x, 0.5, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].y, -0.8660254037844386, 1e-10), true)
})
