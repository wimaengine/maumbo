import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Line2, Segment2D, linesIntersection } from "../../dist/index.module.js"

test("linesIntersection: returns undefined when the segments are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(linesIntersection(new Line2(3), new Line2(3), transform), undefined)
})

test("linesIntersection: returns one point when the segments cross", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -3
  transform.y = -3

  const intersections = linesIntersection(new Line2(3), new Line2(3), transform)
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(fuzzyEqual(intersections.points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -1, 1e-10), true)
})

test("linesIntersection: returns the overlap endpoints when the segments are coincident", () => {
  const transform = Affine2.identity()

  const intersections = linesIntersection(new Line2(3), new Line2(3), transform)
  strictEqual(intersections.points.length, 1)
  strictEqual(intersections.normals.length, 1)
  strictEqual(intersections.points[0] instanceof Segment2D, true)
  strictEqual(fuzzyEqual(intersections.points[0].start.x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].start.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].end.x, 3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.points[0].end.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections.normals[0].y, -1, 1e-10), true)
})
