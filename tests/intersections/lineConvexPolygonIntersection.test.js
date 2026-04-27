import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2, fuzzyEqual } from "hisabati"
import { lineConvexPolygonIntersection, Line2, ConvexPolygon } from "../../dist/index.module.js"

test("lineConvexPolygonIntersection: returns undefined when the shapes are disjoint", () => {
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

  strictEqual(lineConvexPolygonIntersection(new Line2(3), polygon, transform, Affine2.copy(transform).invert()), undefined)
})

test("lineConvexPolygonIntersection: returns one point on a polygon vertex tangent", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -1.5

  const intersections = lineConvexPolygonIntersection(new Line2(3), polygon, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -1, 1e-10), true)
})

test("lineConvexPolygonIntersection: returns two points when the line crosses the polygon", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -2
  transform.y = -1

  const intersections = lineConvexPolygonIntersection(new Line2(3), polygon, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1.25, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, -2.75, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.x, 1, 1e-10), true)
})
