import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Circle, lineCircleIntersection, Line2 } from "../../dist/index.module.js"

test("lineCircleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(lineCircleIntersection(new Line2(3), new Circle(1), transform), undefined)
})

test("lineCircleIntersection: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -1

  const intersections = lineCircleIntersection(new Line2(3), new Circle(1), transform)
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(intersections.points[0].x, -3)
  strictEqual(intersections.points[0].y, 0)
  strictEqual(intersections.normals[0].x, 0)
  strictEqual(intersections.normals[0].y, -1)
})

test("lineCircleIntersection: returns the two line-circle boundary points", () => {
  const circle = new Circle(5)
  const line = new Line2(10)
  const transform = Affine2.identity()

  const intersections = lineCircleIntersection(line, circle, transform)
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(intersections.points[0].x, -5)
  strictEqual(intersections.points[0].y, 0)
  strictEqual(intersections.points[1].x, 5)
  strictEqual(intersections.points[1].y, 0)
  strictEqual(intersections.normals[0].x, 0)
  strictEqual(intersections.normals[0].y, -1)
  strictEqual(intersections.normals[1].x, 0)
  strictEqual(intersections.normals[1].y, -1)
})
