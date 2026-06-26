import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Line2, lineRectangleIntersection, Rectangle, Segment2D } from "../../dist/index.module.js"

test("lineRectangleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    lineRectangleIntersection(new Line2(3), new Rectangle(1, 1), transform),
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
    transform
  )
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(fuzzyEqual(intersections.points[0].x, -2.331821362080701, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -1, 1e-10), true)
})

test("lineRectangleIntersection: returns two points when the line passes through the rectangle", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -1

  const intersections = lineRectangleIntersection(
    new Line2(3),
    new Rectangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.points[0].x, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(intersections.points[1] instanceof Segment2D, true)
  strictEqual(fuzzyEqual(intersections.points[1].start.x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].start.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].end.x, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].end.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, -1, 1e-10), true)
})
