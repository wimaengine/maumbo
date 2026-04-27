import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import {
  Circle,
  Intersection2D,
  circleIntersection
} from "../../dist/index.module.js"

test("circleIntersection: returns undefined when circles are disjoint", () => {
  const a = new Circle(1)
  const b = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 3
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(circleIntersection(a, b, transform, invTransform), undefined)
})

test("circleIntersection: returns undefined when one circle contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    circleIntersection(new Circle(3), new Circle(0.5), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("circleIntersection: returns one point on an external tangency", () => {
  const transform = Affine2.identity()
  transform.x = -2

  const intersections = circleIntersection(
    new Circle(1),
    new Circle(1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -1, 1e-10), true)
})

test("circleIntersection: returns the two boundary crossing points", () => {
  const a = new Circle(5)
  const b = new Circle(5)
  const transform = Affine2.identity()
  transform.x = 6
  const invTransform = Affine2.copy(transform).invert()

  const intersections = circleIntersection(a, b, transform, invTransform)
  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 2)

  const ordered = [...intersections].sort((left, right) => {
    return left.points[0].y - right.points[0].y
  })

  strictEqual(ordered[0] instanceof Intersection2D, true)
  strictEqual(ordered[0].points.length, 1)
  strictEqual(ordered[1].points.length, 1)
  strictEqual(fuzzyEqual(ordered[0].points[0].x, 3, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[0].points[0].y, -4, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[1].points[0].x, 3, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[1].points[0].y, 4, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[0].normal.x, 0.6, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[0].normal.y, -0.8, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[0].tangent.x, 0.8, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[0].tangent.y, 0.6, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[1].normal.x, 0.6, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[1].normal.y, 0.8, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[1].tangent.x, -0.8, 1e-10), true)
  strictEqual(fuzzyEqual(ordered[1].tangent.y, 0.6, 1e-10), true)
})

test("circleIntersection: returns a polyline when the circles are coincident", () => {
  const circle = new Circle(1)
  const transform = Affine2.identity()
  const intersections = circleIntersection(circle, circle, transform, transform)

  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length > 20, true)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -0.9807852804032304, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -0.19509032201612836, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0.19509032201612836, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -0.9807852804032304, 1e-10), true)
})
