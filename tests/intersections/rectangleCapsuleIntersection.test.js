import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Capsule, capsuleRectangleIntersection, Rectangle } from "../../dist/index.module.js"

test("capsuleRectangleIntersection: returns the rectangle-side crossing points", () => {
  const rectangle = new Rectangle(1, 1)
  const capsule = new Capsule(1, 2)
  const transform = Affine2.identity()
  transform.x = 1.5

  const intersections = capsuleRectangleIntersection(
    capsule,
    rectangle,
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points[0].x, 1)
  strictEqual(intersections[0].points[0].y, -1)
  strictEqual(intersections[1].points[0].x, 1)
  strictEqual(intersections[1].points[0].y, 1)
  strictEqual(intersections[0].normal.x, 1)
  strictEqual(intersections[0].normal.y, 0)
  strictEqual(intersections[0].tangent.x, 0)
  strictEqual(intersections[0].tangent.y, 1)
  strictEqual(intersections[1].normal.x, 1)
  strictEqual(intersections[1].normal.y, 0)
  strictEqual(intersections[1].tangent.x, 0)
  strictEqual(intersections[1].tangent.y, 1)
})

test("capsuleRectangleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleRectangleIntersection(new Capsule(1, 2), new Rectangle(1, 1), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleRectangleIntersection: returns undefined when one shape contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    capsuleRectangleIntersection(new Capsule(3, 4), new Rectangle(0.5, 0.5), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleRectangleIntersection: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -3

  const intersections = capsuleRectangleIntersection(
    new Capsule(1, 2),
    new Rectangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[0].points[0].x, -1)
  strictEqual(intersections[0].points[0].y, -2)
  strictEqual(intersections[0].normal.x, -1)
  strictEqual(intersections[0].normal.y, 0)
  strictEqual(intersections[0].tangent.x, 0)
  strictEqual(intersections[0].tangent.y, -1)
})

test("capsuleRectangleIntersection: returns four points when the rectangle crosses the capsule", () => {
  const capsule = new Capsule(1, 2)
  const rectangle = new Rectangle(2, 1)
  const transform = Affine2.identity()

  const intersections = capsuleRectangleIntersection(capsule, rectangle, transform, Affine2.copy(transform).invert())
  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 4)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(intersections[3].points.length, 1)
  strictEqual(intersections[0].points[0].x, 1)
  strictEqual(intersections[0].points[0].y, -1)
  strictEqual(intersections[0].normal.x, 1)
  strictEqual(intersections[0].normal.y, 0)
  strictEqual(intersections[0].tangent.x, 0)
  strictEqual(intersections[0].tangent.y, 1)
  strictEqual(intersections[1].points[0].x, 1)
  strictEqual(intersections[1].points[0].y, 1)
  strictEqual(intersections[1].normal.x, 1)
  strictEqual(intersections[1].normal.y, 0)
  strictEqual(intersections[1].tangent.x, 0)
  strictEqual(intersections[1].tangent.y, 1)
  strictEqual(intersections[2].points[0].x, -1)
  strictEqual(intersections[2].points[0].y, -1)
  strictEqual(intersections[2].normal.x, -1)
  strictEqual(intersections[2].normal.y, 0)
  strictEqual(intersections[2].tangent.x, 0)
  strictEqual(intersections[2].tangent.y, -1)
  strictEqual(intersections[3].points[0].x, -1)
  strictEqual(intersections[3].points[0].y, 1)
  strictEqual(intersections[3].normal.x, -1)
  strictEqual(intersections[3].normal.y, 0)
  strictEqual(intersections[3].tangent.x, 0)
  strictEqual(intersections[3].tangent.y, -1)
})
