import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Vector2, fuzzyEqual } from "hisabati"
import { Ellipse } from "../../dist/index.module.js"

test("Ellipse stores radii", () => {
  const ellipse = new Ellipse(4, 2)

  strictEqual(ellipse.radiusX, 4)
  strictEqual(ellipse.radiusY, 2)
})

test("Ellipse.getVertices returns support points along the given axis", () => {
  const ellipse = new Ellipse(4, 2)
  const [v1, v2] = ellipse.getVertices(new Vector2(3, 0))

  ok(fuzzyEqual(v1.x, 4, 1e-12))
  ok(fuzzyEqual(v1.y, 0, 1e-12))
  ok(fuzzyEqual(v2.x, -4, 1e-12))
  ok(fuzzyEqual(v2.y, 0, 1e-12))
})

test("Ellipse.getPoints returns evenly spaced points on the perimeter", () => {
  const ellipse = new Ellipse(4, 2)
  const points = ellipse.getPoints(4)

  strictEqual(points.length, 4)
  ok(fuzzyEqual(points[0].x, 4, 1e-12))
  ok(fuzzyEqual(points[0].y, 0, 1e-12))
  ok(fuzzyEqual(points[1].x, 0, 1e-12))
  ok(fuzzyEqual(points[1].y, 2, 1e-12))
  ok(fuzzyEqual(points[2].x, -4, 1e-12))
  ok(fuzzyEqual(points[2].y, 0, 1e-12))
  ok(fuzzyEqual(points[3].x, 0, 1e-12))
  ok(fuzzyEqual(points[3].y, -2, 1e-12))
})

test("Ellipse.getSupportPoint2d returns the farthest point along a diagonal direction", () => {
  const ellipse = new Ellipse(4, 2)
  const support = ellipse.getSupportPoint2d(new Vector2(1, 1))

  ok(fuzzyEqual(support.x, 16 / Math.sqrt(20), 1e-12))
  ok(fuzzyEqual(support.y, 4 / Math.sqrt(20), 1e-12))
})

test("Ellipse.getFeature2d returns a point feature aligned with the query direction", () => {
  const ellipse = new Ellipse(4, 2)
  const feature = ellipse.getFeature2d(new Vector2(0, 3))

  strictEqual(feature.type, "point")
  ok(fuzzyEqual(feature.point.x, 0, 1e-12))
  ok(fuzzyEqual(feature.point.y, 2, 1e-12))
  ok(fuzzyEqual(feature.normal.x, 0, 1e-12))
  ok(fuzzyEqual(feature.normal.y, 1, 1e-12))
})

test("Ellipse bounds wrap the full shape", () => {
  const ellipse = new Ellipse(4, 2)
  const aabb = ellipse.aabb2d()
  const bound = ellipse.boundingCircle()

  ok(fuzzyEqual(aabb.min.x, -4, 1e-12))
  ok(fuzzyEqual(aabb.min.y, -2, 1e-12))
  ok(fuzzyEqual(aabb.max.x, 4, 1e-12))
  ok(fuzzyEqual(aabb.max.y, 2, 1e-12))
  ok(fuzzyEqual(bound.position.x, 0, 1e-12))
  ok(fuzzyEqual(bound.position.y, 0, 1e-12))
  ok(fuzzyEqual(bound.radius, 4, 1e-12))
})
