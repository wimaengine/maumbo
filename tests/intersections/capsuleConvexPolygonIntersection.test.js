import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2, fuzzyEqual } from "hisabati"
import { Capsule, capsuleConvexPolygonIntersection, ConvexPolygon } from "../../dist/index.module.js"

test("capsuleConvexPolygonIntersection: returns undefined when the shapes are disjoint", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(
    capsuleConvexPolygonIntersection(new Capsule(1, 2), polygon, transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleConvexPolygonIntersection: returns undefined when one shape contains the other", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-0.5, -0.5),
    new Vector2(0.5, -0.5),
    new Vector2(0.75, 0.25),
    new Vector2(0, 0.75),
    new Vector2(-0.75, 0.25)
  ])
  const transform = Affine2.identity()

  strictEqual(
    capsuleConvexPolygonIntersection(new Capsule(3, 4), polygon, transform, Affine2.copy(transform).invert()),
    undefined
  )
})

test("capsuleConvexPolygonIntersection: returns one point on a tangency", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -2.5
  transform.y = -2.5

  const intersections = capsuleConvexPolygonIntersection(
    new Capsule(1, 2),
    polygon,
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -2, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -1, 1e-10), true)
})

test("capsuleConvexPolygonIntersection: returns two points when the polygon crosses the capsule", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -3

  const intersections = capsuleConvexPolygonIntersection(
    new Capsule(1, 2),
    polygon,
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -0.6, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -2.8, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -0.6, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -0.8, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0.8, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -0.6, 1e-10), true)
})

test("capsuleConvexPolygonIntersection: returns more than two points when the shapes overlap across multiple edges", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -0.5
  transform.y = -2.5

  const intersections = capsuleConvexPolygonIntersection(
    new Capsule(1, 2),
    polygon,
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(intersections.length, 3)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 0, 1e-10), true)
})
