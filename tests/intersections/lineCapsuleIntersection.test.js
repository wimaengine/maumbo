import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Capsule, lineCapsuleIntersection, Line2 } from "../../dist/index.module.js"

test("lineCapsuleIntersection: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 8))
  transform.x = -3
  transform.y = -3

  strictEqual(
    lineCapsuleIntersection(new Line2(3), new Capsule(1, 2), transform),
    undefined
  )
})

test("lineCapsuleIntersection: returns one point on a capsule tangent", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  const intersections = lineCapsuleIntersection(
    new Line2(3),
    new Capsule(1, 2),
    transform
  )
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(fuzzyEqual(intersections.points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -1, 1e-10), true)
})

test("lineCapsuleIntersection: returns two points when the line crosses the capsule", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 4))
  transform.x = -3
  transform.y = 1.5

  const intersections = lineCapsuleIntersection(
    new Line2(3),
    new Capsule(1, 2),
    transform
  )
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.points[0].x, -2.9142135623730954, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].x, -0.5894728890292331, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, -1, 1e-10), true)
})
