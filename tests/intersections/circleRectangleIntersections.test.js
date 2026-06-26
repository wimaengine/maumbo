import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Circle, circleRectangleIntersections, Rectangle } from "../../dist/index.module.js"

test("circleRectangleIntersections: returns undefined when the circle is fully contained", () => {
  const circle = new Circle(0.5)
  const rectangle = new Rectangle(2, 2)
  const transform = Affine2.identity()

  strictEqual(circleRectangleIntersections(circle, rectangle, transform), undefined)
})

test("circleRectangleIntersections: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    circleRectangleIntersections(new Circle(1), new Rectangle(1, 1), transform),
    undefined
  )
})

test("circleRectangleIntersections: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -1

  const intersections = circleRectangleIntersections(
    new Circle(1),
    new Rectangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(intersections.points[0].x, -1)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(intersections.normals[0].x, -1)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-10), true)
})

test("circleRectangleIntersections: returns four points when the circle is inscribed in the rectangle", () => {
  const circle = new Circle(5)
  const rectangle = new Rectangle(5, 5)
  const transform = Affine2.identity()

  const intersections = circleRectangleIntersections(circle, rectangle, transform)
  strictEqual(intersections.points.length, 4)
  strictEqual(intersections.normals.length, 4)
  strictEqual(fuzzyEqual(intersections.points[0].x, 0, 1e-10), true)
  strictEqual(intersections.points[0].y, -5)
  strictEqual(fuzzyEqual(intersections.points[1].x, 5, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[2].x, 0, 1e-10), true)
  strictEqual(intersections.points[2].y, 5)
  strictEqual(intersections.points[3].x, -5)
  strictEqual(fuzzyEqual(intersections.points[3].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0, 1e-10), true)
  strictEqual(intersections.normals[0].y, -1)
  strictEqual(intersections.normals[1].x, 1)
  strictEqual(fuzzyEqual(intersections.normals[1].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[2].x, 0, 1e-10), true)
  strictEqual(intersections.normals[2].y, 1)
  strictEqual(intersections.normals[3].x, -1)
  strictEqual(fuzzyEqual(intersections.normals[3].y, 0, 1e-10), true)
})
