import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import {
  Capsule,
  Circle,
  Intersection2D,
  capsuleCircleIntersection
} from "../../dist/index.module.js"

test("capsuleCircleIntersection: returns the capsule side crossing points", () => {
  const capsule = new Capsule(1, 2)
  const circle = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 1.5

  const intersection = capsuleCircleIntersection(capsule, circle, transform)
  strictEqual(intersection instanceof Intersection2D, true)
  strictEqual(intersection.points.length, 2)
  strictEqual(intersection.normals.length, 2)

  strictEqual(fuzzyEqual(intersection.points[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.points[0].y, -0.8660254037844386, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.points[1].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.points[1].y, 0.8660254037844386, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[1].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[1].y, 0, 1e-10), true)
})

test("capsuleCircleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleCircleIntersection(new Capsule(1, 2), new Circle(1), transform),
    undefined
  )
})

test("capsuleCircleIntersection: returns undefined when one shape contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    capsuleCircleIntersection(new Capsule(3, 4), new Circle(0.5), transform),
    undefined
  )
})

test("capsuleCircleIntersection: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -2

  const intersection = capsuleCircleIntersection(
    new Capsule(1, 2),
    new Circle(1),
    transform
  )
  strictEqual(intersection instanceof Intersection2D, true)
  strictEqual(intersection.points.length, 1)
  strictEqual(intersection.normals.length, 1)
  strictEqual(fuzzyEqual(intersection.points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[0].y, 0, 1e-10), true)
})

test("capsuleCircleIntersection: returns more than two points when the circle crosses the capsule caps and side", () => {
  const transform = Affine2.identity()
  transform.y = -2

  const intersection = capsuleCircleIntersection(
    new Capsule(1, 2),
    new Circle(1),
    transform
  )
  strictEqual(intersection instanceof Intersection2D, true)
  strictEqual(intersection.points.length > 10, true)
  strictEqual(intersection.normals.length, intersection.points.length)
  strictEqual(fuzzyEqual(intersection.points[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.points[1].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.points[1].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[1].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[1].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[3].x, -0.9807852804032304, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[3].y, -0.19509032201612841, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[intersection.normals.length - 1].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersection.normals[intersection.normals.length - 1].y, 0, 1e-10), true)
})
