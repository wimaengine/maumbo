import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Capsule, capsuleIntersections } from "../../dist/index.module.js"

test("capsuleIntersections: returns undefined when the capsules are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleIntersections(new Capsule(1, 2), new Capsule(1, 2), transform),
    undefined
  )
})

test("capsuleIntersections: returns undefined when one capsule contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    capsuleIntersections(new Capsule(3, 4), new Capsule(0.5, 0.5), transform),
    undefined
  )
})

test("capsuleIntersections: returns two near-identical points on a tangent touch", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 6))
  transform.x = -3
  transform.y = -0.25

  const intersections = capsuleIntersections(
    new Capsule(1, 2),
    new Capsule(1, 2),
    transform
  )
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.points[0].x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, -1.982050765422029, 1e-8), true)
  strictEqual(fuzzyEqual(intersections.points[1].x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(intersections.points[1].y, -1.9820508497157263, 1e-8), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-8), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, 0, 1e-8), true)
})

test("capsuleIntersections: returns two points when the capsules cross", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -3
  transform.y = -3

  const intersections = capsuleIntersections(
    new Capsule(1, 2),
    new Capsule(1, 2),
    transform
  )
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[1].y, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, -1, 1e-10), true)
})

test("capsuleIntersections: returns more than two points when the capsules overlap deeply", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -2
  transform.y = -2

  const intersections = capsuleIntersections(
    new Capsule(1, 2),
    new Capsule(1, 2),
    transform
  )
  strictEqual(intersections.points.length > 10, true)
  strictEqual(intersections.normals.length, intersections.points.length)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[2].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[2].y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[intersections.normals.length - 1].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[intersections.normals.length - 1].y, 0, 1e-10), true)
})
