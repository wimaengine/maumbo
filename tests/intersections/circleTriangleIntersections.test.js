import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Circle, circleTriangleIntersections, Triangle } from "../../dist/index.module.js"

test("circleTriangleIntersections: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    circleTriangleIntersections(new Circle(1), new Triangle(1, 1), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("circleTriangleIntersections: returns undefined when one shape contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    circleTriangleIntersections(new Circle(3), new Triangle(0.5, 0.5), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("circleTriangleIntersections: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -2
  transform.y = -1

  const intersections = circleTriangleIntersections(
    new Circle(1),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
})

test("circleTriangleIntersections: returns two points when the circle crosses the triangle", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 4))
  transform.x = -2
  transform.y = -0.5

  const intersections = circleTriangleIntersections(
    new Circle(1),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -0.7487, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -0.6629, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, -0.9216, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, -0.388, 1e-4), true)
})

test("circleTriangleIntersections: returns more than two points when the circle crosses multiple triangle edges", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -1

  const intersections = circleTriangleIntersections(
    new Circle(1),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 4)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(intersections[3].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 1, 1e-10), true)
})
