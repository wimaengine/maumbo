import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2, fuzzyEqual, Rotary } from "hisabati"
import { ConvexPolygon, polygonTriangleIntersections, Triangle } from "../../dist/index.module.js"

test("polygonTriangleIntersections: returns the polygon-triangle overlap points", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const triangle = new Triangle(2, 2)
  const transform = Affine2.identity()
  transform.x = 0.25
  transform.y = 0.25

  const intersections = polygonTriangleIntersections(
    polygon,
    triangle,
    transform,
    Affine2.copy(transform).invert()
  )
  strictEqual(Array.isArray(intersections), true)
  strictEqual(intersections.length, 4)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(intersections[3].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, 1.35, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0.04999999999999982, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, 0.9375, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].y, 0.875, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].points[0].x, -0.1875, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].points[0].y, 1.375, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].points[0].x, -1.15, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].points[0].y, -0.5499999999999998, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0.9486832980505138, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, 0.9486832980505138, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, 0.5547001962252291, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 0.8320502943378437, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.x, -0.8320502943378437, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.y, 0.5547001962252291, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].normal.x, -0.5547001962252291, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].normal.y, 0.8320502943378437, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].tangent.x, -0.8320502943378437, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[2].tangent.y, -0.5547001962252291, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].normal.x, -0.9486832980505138, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].normal.y, -0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].tangent.x, 0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[3].tangent.y, -0.9486832980505138, 1e-10), true)
})

test("polygonTriangleIntersections: returns undefined when the shapes are disjoint", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const triangle = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(polygonTriangleIntersections(polygon, triangle, transform, Affine2.copy(transform).invert()), undefined)
})

test("polygonTriangleIntersections: returns undefined when one shape contains the other", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-3, -3),
    new Vector2(3, -3),
    new Vector2(4, 1),
    new Vector2(0, 4),
    new Vector2(-4, 1)
  ])
  const triangle = new Triangle(0.5, 0.5)
  const transform = Affine2.identity()

  strictEqual(polygonTriangleIntersections(polygon, triangle, transform, Affine2.copy(transform).invert()), undefined)
})

test("polygonTriangleIntersections: returns one point on a vertex touch", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const triangle = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -2.5
  transform.y = -0.5

  const intersections = polygonTriangleIntersections(polygon, triangle, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1.5, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0.5, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -0.5547001962252291, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0.8320502943378437, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, -0.8320502943378437, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -0.5547001962252291, 1e-10), true)
})

test("polygonTriangleIntersections: returns two points when the triangle crosses the polygon", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const triangle = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 4))
  transform.x = -2.5
  transform.y = -0.5

  const intersections = polygonTriangleIntersections(polygon, triangle, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1.1464466094067263, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, -0.5606601717798212, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].x, -1.176776695296637, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].points[0].y, -0.4696699141100893, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -0.9486832980505138, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, -0.9486832980505138, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, -0.9486832980505138, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, -0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.x, 0.31622776601683794, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].tangent.y, -0.9486832980505138, 1e-10), true)
})
