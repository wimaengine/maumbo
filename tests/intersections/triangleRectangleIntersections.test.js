import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary } from "hisabati"
import { Rectangle, Triangle, triangleRectangleIntersections } from "../../dist/index.module.js"

test("triangleRectangleIntersections: returns undefined when the shapes are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    triangleRectangleIntersections(new Triangle(1, 1), new Rectangle(1, 1), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("triangleRectangleIntersections: returns undefined when one shape contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    triangleRectangleIntersections(new Triangle(3, 3), new Rectangle(0.5, 0.5), transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("triangleRectangleIntersections: returns one point on a corner touch", () => {
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -2

  const intersections = triangleRectangleIntersections(
    new Triangle(1, 1),
    new Rectangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
})

test("triangleRectangleIntersections: returns two points when the triangle crosses the rectangle", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 8))
  transform.x = -2
  transform.y = -1

  const intersections = triangleRectangleIntersections(
    new Triangle(1, 1),
    new Rectangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
})

test("triangleRectangleIntersections: returns more than two points when the shapes overlap across multiple sides", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -1.5

  const intersections = triangleRectangleIntersections(
    new Triangle(1, 1),
    new Rectangle(1, 1),
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 3)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 2)
  strictEqual(intersections[2].points.length, 1)
})
