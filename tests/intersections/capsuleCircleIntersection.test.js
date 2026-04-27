import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Capsule, capsuleCircleIntersection, Circle } from "../../dist/index.module.js"

test("capsuleCircleIntersection: returns the capsule side crossing points", () => {
  const capsule = new Capsule(1, 2)
  const circle = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 1.5

  const intersections = capsuleCircleIntersection(capsule, circle, transform, Affine2.copy(transform).invert())
  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -0.8660254037844386, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].y, 0.8660254037844386, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.y, 1, 1e-10), true)
})

test("capsuleCircleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleCircleIntersection(new Capsule(1, 2), new Circle(1), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleCircleIntersection: returns undefined when one shape contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    capsuleCircleIntersection(new Capsule(3, 4), new Circle(0.5), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleCircleIntersection: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -2

  const intersections = capsuleCircleIntersection(
    new Capsule(1, 2),
    new Circle(1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -1, 1e-10), true)
})

test("capsuleCircleIntersection: returns more than two points when the circle crosses the capsule caps and side", () => {
  const transform = Affine2.identity()
  transform.y = -2

  const intersections = capsuleCircleIntersection(
    new Capsule(1, 2),
    new Circle(1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 3)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length > 10, true)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].points[intersections[2].points.length - 1].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].points[intersections[2].points.length - 1].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].normal.y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].tangent.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].tangent.y, 0, 1e-10), true)
})
