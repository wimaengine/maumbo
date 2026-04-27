import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Circle, circleRectangleIntersections, Rectangle } from "../../dist/index.module.js"

test("circleRectangleIntersections: returns undefined when the circle is fully contained", () => {
  const circle = new Circle(0.5)
  const rectangle = new Rectangle(2, 2)
  const transform = Affine2.identity()
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(circleRectangleIntersections(circle, rectangle, transform, invTransform), undefined)
})

test("circleRectangleIntersections: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    circleRectangleIntersections(new Circle(1), new Rectangle(1, 1), transform, Affine2.copy(transform).invert()),
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
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[0].points[0].x, -1)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(intersections[0].normal.x, -1)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0, 1e-10), true)
  strictEqual(intersections[0].tangent.y, -1)
})

test("circleRectangleIntersections: returns four points when the circle is inscribed in the rectangle", () => {
  const circle = new Circle(5)
  const rectangle = new Rectangle(5, 5)
  const transform = Affine2.identity()

  const intersections = circleRectangleIntersections(circle, rectangle, transform, Affine2.copy(transform).invert())
  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 4)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(intersections[3].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, 0, 1e-10), true)
  strictEqual(intersections[0].points[0].y, -5)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0, 1e-10), true)
  strictEqual(intersections[0].normal.y, -1)
  strictEqual(intersections[0].tangent.x, 1)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, 0, 1e-10), true)
  strictEqual(intersections[1].points[0].x, 5)
  strictEqual(fuzzyEqual(intersections[1].points[0].y, 0, 1e-10), true)
  strictEqual(intersections[1].normal.x, 1)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.x, 0, 1e-10), true)
  strictEqual(intersections[1].tangent.y, 1)
  strictEqual(fuzzyEqual(intersections[2].points[0].x, 0, 1e-10), true)
  strictEqual(intersections[2].points[0].y, 5)
  strictEqual(fuzzyEqual(intersections[2].normal.x, 0, 1e-10), true)
  strictEqual(intersections[2].normal.y, 1)
  strictEqual(intersections[2].tangent.x, -1)
  strictEqual(fuzzyEqual(intersections[2].tangent.y, 0, 1e-10), true)
  strictEqual(intersections[3].points[0].x, -5)
  strictEqual(fuzzyEqual(intersections[3].points[0].y, 0, 1e-10), true)
  strictEqual(intersections[3].normal.x, -1)
  strictEqual(fuzzyEqual(intersections[3].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].tangent.x, 0, 1e-10), true)
  strictEqual(intersections[3].tangent.y, -1)
})
