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
    transform
  )
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(intersections.points[0].x, 1)
  strictEqual(intersections.points[0].y, -1)
  strictEqual(intersections.points[1].x, 1)
  strictEqual(intersections.points[1].y, 1)
  strictEqual(intersections.normals[0].x, 1)
  strictEqual(intersections.normals[0].y, 0)
  strictEqual(intersections.normals[1].x, 1)
  strictEqual(intersections.normals[1].y, 0)
})

test("capsuleRectangleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleRectangleIntersection(new Capsule(1, 2), new Rectangle(1, 1), transform),
    undefined
  )
})

test("capsuleRectangleIntersection: returns undefined when one shape contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    capsuleRectangleIntersection(new Capsule(3, 4), new Rectangle(0.5, 0.5), transform),
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
    transform
  )
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(intersections.points[0].x, -1)
  strictEqual(intersections.points[0].y, -2)
  strictEqual(intersections.normals[0].x, -1)
  strictEqual(intersections.normals[0].y, 0)
})

test("capsuleRectangleIntersection: returns four points when the rectangle crosses the capsule", () => {
  const capsule = new Capsule(1, 2)
  const rectangle = new Rectangle(2, 1)
  const transform = Affine2.identity()

  const intersections = capsuleRectangleIntersection(capsule, rectangle, transform)
  strictEqual(intersections.points.length, 4)
  strictEqual(intersections.normals.length, 4)
  strictEqual(intersections.points[0].x, 1)
  strictEqual(intersections.points[0].y, -1)
  strictEqual(intersections.points[1].x, 1)
  strictEqual(intersections.points[1].y, 1)
  strictEqual(intersections.points[2].x, -1)
  strictEqual(intersections.points[2].y, -1)
  strictEqual(intersections.points[3].x, -1)
  strictEqual(intersections.points[3].y, 1)
  strictEqual(intersections.normals[0].x, 1)
  strictEqual(intersections.normals[0].y, 0)
  strictEqual(intersections.normals[1].x, 1)
  strictEqual(intersections.normals[1].y, 0)
  strictEqual(intersections.normals[2].x, -1)
  strictEqual(intersections.normals[2].y, 0)
  strictEqual(intersections.normals[3].x, -1)
  strictEqual(intersections.normals[3].y, 0)
})
