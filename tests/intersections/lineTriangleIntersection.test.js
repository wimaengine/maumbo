import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Line2, lineTriangleIntersection, Triangle } from "../../dist/index.module.js"

test("lineTriangleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    lineTriangleIntersection(new Line2(3), new Triangle(1, 1), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("lineTriangleIntersection: returns one point on a vertex tangent", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -1

  const intersections = lineTriangleIntersection(
    new Line2(3),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -1, 1e-10), true)
})

test("lineTriangleIntersection: returns two points when the line crosses the triangle", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -3
  transform.y = -0.5

  const intersections = lineTriangleIntersection(
    new Line2(3),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.x, 1, 1e-10), true)
})
