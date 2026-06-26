import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Circle, circleIntersection } from "../../dist/index.module.js"

test("circleIntersection: returns undefined when circles are disjoint", () => {
  const a = new Circle(1)
  const b = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 3

  strictEqual(circleIntersection(a, b, transform), undefined)
})

test("circleIntersection: returns undefined when one circle contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    circleIntersection(new Circle(3), new Circle(0.5), transform),
    undefined
  )
})

test("circleIntersection: returns one point on an external tangency", () => {
  const transform = Affine2.identity()
  transform.x = -2

  const intersections = circleIntersection(
    new Circle(1),
    new Circle(1),
    transform
  )
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(fuzzyEqual(intersections.points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-10), true)
})

test("circleIntersection: returns the two boundary crossing points", () => {
  const a = new Circle(5)
  const b = new Circle(5)
  const transform = Affine2.identity()
  transform.x = 6
  const intersections = circleIntersection(a, b, transform)
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.points[0].x, 3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 4, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].x, 3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].y, -4, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0.6, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0.8, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, 0.6, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, -0.8, 1e-10), true)
})

test("circleIntersection: returns a polyline when the circles are coincident", () => {
  const circle = new Circle(1)
  const transform = Affine2.identity()
  const intersections = circleIntersection(circle, circle, transform)

  strictEqual(intersections.points.length > 20, true)
  strictEqual(intersections.normals.length, intersections.points.length)
  strictEqual(fuzzyEqual(intersections.points[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, 0.9807852804032304, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, 0.19509032201612825, 1e-10), true)
})
