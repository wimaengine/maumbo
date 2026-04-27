import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary } from "hisabati"
import { Triangle, triangleIntersections } from "../../dist/index.module.js"

test("triangleIntersections: returns undefined when the triangles are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    triangleIntersections(new Triangle(1, 1), new Triangle(1, 1), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("triangleIntersections: returns undefined when one triangle contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    triangleIntersections(new Triangle(3, 3), new Triangle(0.5, 0.5), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("triangleIntersections: returns one point on a vertex touch", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -2
  transform.y = -2

  const intersections = triangleIntersections(
    new Triangle(1, 1),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
})

test("triangleIntersections: returns two points when the triangles cross", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 4))
  transform.x = -2
  transform.y = -1

  const intersections = triangleIntersections(
    new Triangle(1, 1),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
})

test("triangleIntersections: returns more than two points when the triangles overlap deeply", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -1.5

  const intersections = triangleIntersections(
    new Triangle(1, 1),
    new Triangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 3)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
})
