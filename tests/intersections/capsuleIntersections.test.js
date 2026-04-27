import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Capsule, capsuleIntersections } from "../../dist/index.module.js"

test("capsuleIntersections: returns undefined when the capsules are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleIntersections(new Capsule(1, 2), new Capsule(1, 2), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleIntersections: returns undefined when one capsule contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    capsuleIntersections(new Capsule(3, 4), new Capsule(0.5, 0.5), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleIntersections: returns one point on a tangent touch", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 6))
  transform.x = -3
  transform.y = -0.25

  const intersections = capsuleIntersections(
    new Capsule(1, 2),
    new Capsule(1, 2),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -1.9820508075688772, 1e-8), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-8), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0, 1e-8), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -1, 1e-8), true)
})

test("capsuleIntersections: returns two points when the capsules cross", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -3
  transform.y = -3

  const intersections = capsuleIntersections(
    new Capsule(1, 2),
    new Capsule(1, 2),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].y, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, -1, 1e-10), true)
})

test("capsuleIntersections: returns more than two points when the capsules overlap deeply", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -2
  transform.y = -2

  const intersections = capsuleIntersections(
    new Capsule(1, 2),
    new Capsule(1, 2),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 4)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(intersections[3].points.length, 9)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].normal.y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].normal.x, 0.7071067811865472, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].normal.y, -0.7071067811865478, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].tangent.x, 0.7071067811865478, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].tangent.y, 0.7071067811865472, 1e-10), true)
})
