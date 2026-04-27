import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Circle, lineCircleIntersection, Line2 } from "../../dist/index.module.js"

test("lineCircleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(lineCircleIntersection(new Line2(3), new Circle(1), transform, Affine2.copy(transform).invert()), undefined)
})

test("lineCircleIntersection: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -1

  const intersections = lineCircleIntersection(new Line2(3), new Circle(1), transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[0].points[0].x, -3)
  strictEqual(intersections[0].points[0].y, 0)
  strictEqual(intersections[0].normal.x, 0)
  strictEqual(intersections[0].normal.y, -1)
  strictEqual(intersections[0].tangent.x, 1)
  strictEqual(intersections[0].tangent.y, 0)
})

test("lineCircleIntersection: returns the two line-circle boundary points", () => {
  const circle = new Circle(5)
  const line = new Line2(10)
  const transform = Affine2.identity()

  const intersections = lineCircleIntersection(line, circle, transform, Affine2.copy(transform).invert())
  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[0].points[0].x, -5)
  strictEqual(intersections[0].points[0].y, 0)
  strictEqual(intersections[1].points[0].x, 5)
  strictEqual(intersections[1].points[0].y, 0)
  strictEqual(intersections[0].normal.x, 0)
  strictEqual(intersections[0].normal.y, -1)
  strictEqual(intersections[0].tangent.x, 1)
  strictEqual(intersections[0].tangent.y, 0)
  strictEqual(intersections[1].normal.x, 0)
  strictEqual(intersections[1].normal.y, -1)
  strictEqual(intersections[1].tangent.x, 1)
  strictEqual(intersections[1].tangent.y, 0)
})
