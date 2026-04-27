import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, Vector2, fuzzyEqual } from "hisabati"
import { Circle, circlePolygonIntersection, ConvexPolygon } from "../../dist/index.module.js"

test("circlePolygonIntersection: returns undefined when the shapes are disjoint", () => {
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

  strictEqual(circlePolygonIntersection(new Circle(1), polygon, transform, Affine2.copy(transform).invert()), undefined)
})

test("circlePolygonIntersection: returns undefined when the circle is fully contained", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-3, -3),
    new Vector2(3, -3),
    new Vector2(4, 1),
    new Vector2(0, 4),
    new Vector2(-4, 1)
  ])
  const transform = Affine2.identity()

  strictEqual(circlePolygonIntersection(new Circle(0.5), polygon, transform, Affine2.copy(transform).invert()), undefined)
})

test("circlePolygonIntersection: returns one point on a tangency", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -2.5
  transform.y = -0.5

  const intersections = circlePolygonIntersection(new Circle(1), polygon, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, 0, 1e-10), true)
})

test("circlePolygonIntersection: returns two points when the circle crosses the polygon", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 8))
  transform.x = -2
  transform.y = -1.5

  const intersections = circlePolygonIntersection(new Circle(1), polygon, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].normal.x, -0.7954, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -0.606, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, -0.8949, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, -0.4464, 1e-4), true)
})

test("circlePolygonIntersection: returns more than two points when the circle crosses multiple polygon edges", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const transform = Affine2.identity()
  transform.x = -0.5
  transform.y = -0.5

  const intersections = circlePolygonIntersection(new Circle(1), polygon, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 3)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
  strictEqual(intersections[2].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0.8, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -0.6, 1e-4), true)
  strictEqual(fuzzyEqual(intersections[1].normal.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[1].normal.y, 0, 1e-10), true)
})
