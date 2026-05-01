import test from "node:test"
import { deepStrictEqual, strictEqual } from "node:assert"
import { Vector2, fuzzyEqual } from "hisabati"
import { ConvexPolygon } from "../../dist/index.module.js"

test("ConvexPolygon stores points and normals", () => {
  const points = [
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ]
  const normals = [
    new Vector2(0, -1),
    new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(-1, 0),
  ]
  const polygon = new ConvexPolygon(points, normals)

  strictEqual(polygon.points, points)
  strictEqual(polygon.normals, normals)
  deepStrictEqual(polygon.getPoints(), points)
})

test("ConvexPolygon.fromPoints keeps the original points", () => {
  const points = [
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ]
  const polygon = ConvexPolygon.fromPoints(points)

  strictEqual(polygon.points.length, 4)
  deepStrictEqual(polygon.points, points)
})

test("ConvexPolygon.fromPoints computes the expected unique normals for a square", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])

  strictEqual(polygon.normals.length, 2)
  strictEqual(fuzzyEqual(polygon.normals[0].x, -1, 1e-12), true)
  strictEqual(fuzzyEqual(polygon.normals[0].y, 0, 1e-12), true)
  strictEqual(fuzzyEqual(polygon.normals[1].x, 0, 1e-12), true)
  strictEqual(fuzzyEqual(polygon.normals[1].y, -1, 1e-12), true)
})

test("ConvexPolygon.getPoints returns the original vertices", () => {
  const points = [
    new Vector2(0, 0),
    new Vector2(2, 0),
    new Vector2(1, 1),
  ]
  const polygon = ConvexPolygon.fromPoints(points)

  deepStrictEqual(polygon.getPoints(), points)
})
