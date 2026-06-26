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

  strictEqual(circlePolygonIntersection(new Circle(1), polygon, transform), undefined)
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

  strictEqual(circlePolygonIntersection(new Circle(0.5), polygon, transform), undefined)
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

  const intersections = circlePolygonIntersection(new Circle(1), polygon, transform)
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(fuzzyEqual(intersections.points[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, 0, 1e-10), true)
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

  const intersections = circlePolygonIntersection(new Circle(1), polygon, transform)
  strictEqual(intersections.points.length, 2)
  strictEqual(intersections.normals.length, 2)
  strictEqual(fuzzyEqual(intersections.normals[0].x, -0.7954, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -0.606, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, -0.8949, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, -0.4464, 1e-4), true)
})

test("circlePolygonIntersection: returns three points when the circle crosses multiple polygon edges", () => {
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

  const intersections = circlePolygonIntersection(new Circle(1), polygon, transform)
  strictEqual(intersections.points.length, 3)
  strictEqual(intersections.normals.length, 3)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0.8, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -0.6, 1e-4), true)
  strictEqual(fuzzyEqual(intersections.normals[1].x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[1].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[2].x, -0.3846153846153846, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[2].y, 0.9230769230769231, 1e-10), true)
})
