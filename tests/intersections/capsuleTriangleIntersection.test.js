import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Capsule, capsuleTriangleIntersection, Triangle } from "../../dist/index.module.js"

test("capsuleTriangleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleTriangleIntersection(new Capsule(1, 2), new Triangle(1, 1), transform),
    undefined
  )
})

test("capsuleTriangleIntersection: returns undefined when one shape contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    capsuleTriangleIntersection(new Capsule(3, 4), new Triangle(0.5, 0.5), transform),
    undefined
  )
})

test("capsuleTriangleIntersection: returns one point on a tangency", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -2
  transform.y = -3

  const intersections = capsuleTriangleIntersection(
    new Capsule(1, 2),
    new Triangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(fuzzyEqual(intersections.points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-10), true)
})

test("capsuleTriangleIntersection: returns two points when the triangle crosses the capsule", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 4))
  transform.x = -2
  transform.y = -2.5

  const intersections = capsuleTriangleIntersection(
    new Capsule(1, 2),
    new Triangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -0.7487, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -0.6629, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, -0.9216, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, -0.388, 1e-4), true)
})

test("capsuleTriangleIntersection: returns more than two points when the shapes overlap across multiple edges", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -1
  transform.y = -2

  const intersections = capsuleTriangleIntersection(
    new Capsule(1, 2),
    new Triangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 3)
  strictEqual(intersections.normals.length, 3)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[2].x, -0.8, 1e-10), true)
})
