import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Rectangle, rectangleIntersections } from "../../dist/index.module.js"

test("rectangleIntersections: returns undefined when the rectangles are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    rectangleIntersections(new Rectangle(1, 1), new Rectangle(1, 1), transform),
    undefined
  )
})

test("rectangleIntersections: returns undefined when one rectangle contains the other", () => {
  const transform = Affine2.identity()

  strictEqual(
    rectangleIntersections(new Rectangle(3, 3), new Rectangle(0.5, 0.5), transform),
    undefined
  )
})

test("rectangleIntersections: returns one point on a corner touch", () => {
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -2

  const intersections = rectangleIntersections(
    new Rectangle(1, 1),
    new Rectangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
})

test("rectangleIntersections: returns two points when the rectangles cross one side", () => {
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -1.5

  const intersections = rectangleIntersections(
    new Rectangle(1, 1),
    new Rectangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 3)
  strictEqual(intersections.normals.length, intersections.points.length)
})

test("rectangleIntersections: returns more than two points when the rectangles coincide", () => {
  const transform = Affine2.identity()

  const intersections = rectangleIntersections(
    new Rectangle(1, 1),
    new Rectangle(1, 1),
    transform
  )
  strictEqual(intersections.points.length, 8)
  strictEqual(intersections.normals.length, intersections.points.length)
})
