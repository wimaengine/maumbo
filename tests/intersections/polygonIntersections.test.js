import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, Vector2 } from "hisabati"
import { ConvexPolygon, polygonIntersections } from "../../dist/index.module.js"

test("polygonIntersections: returns undefined when the polygons are disjoint", () => {
  const a = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const b = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(polygonIntersections(a, b, transform, Affine2.copy(transform).invert()), undefined)
})

test("polygonIntersections: returns undefined when one polygon contains the other", () => {
  const a = ConvexPolygon.fromPoints([
    new Vector2(-3, -3),
    new Vector2(3, -3),
    new Vector2(4, 1),
    new Vector2(0, 4),
    new Vector2(-4, 1)
  ])
  const b = ConvexPolygon.fromPoints([
    new Vector2(-0.5, -0.5),
    new Vector2(0.5, -0.5),
    new Vector2(0.75, 0.25),
    new Vector2(0, 0.75),
    new Vector2(-0.75, 0.25)
  ])
  const transform = Affine2.identity()

  strictEqual(polygonIntersections(a, b, transform, Affine2.copy(transform).invert()), undefined)
})

test("polygonIntersections: returns one point on a vertex touch", () => {
  const a = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const b = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -3

  const intersections = polygonIntersections(a, b, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
})

test("polygonIntersections: returns two points when the polygons cross", () => {
  const a = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const b = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -2.5
  transform.y = -1

  const intersections = polygonIntersections(a, b, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
})

test("polygonIntersections: returns more than two points when the polygons overlap on multiple edges", () => {
  const a = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const b = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 8))
  transform.x = -0.5
  transform.y = -0.5

  const intersections = polygonIntersections(a, b, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 4)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(intersections[3].points.length, 1)
})
