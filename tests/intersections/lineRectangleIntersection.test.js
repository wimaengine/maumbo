import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Line2, lineRectangleIntersection, Rectangle } from "../../dist/index.module.js"

test("lineRectangleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    lineRectangleIntersection(new Line2(3), new Rectangle(1, 1), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("lineRectangleIntersection: returns one point on a corner tangent", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 8))
  transform.x = -3
  transform.y = -1

  const intersections = lineRectangleIntersection(
    new Line2(3),
    new Rectangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -2.331821362080701, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -1, 1e-10), true)
})

test("lineRectangleIntersection: returns two points when the line passes through the rectangle", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -1

  const intersections = lineRectangleIntersection(
    new Line2(3),
    new Rectangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 2)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[1].x, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, -1, 1e-10), true)
})
