import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, fuzzyEqual } from "hisabati"
import { Line2, linesIntersection } from "../../dist/index.module.js"

test("linesIntersection: returns undefined when the segments are disjoint", () => {
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(linesIntersection(new Line2(3), new Line2(3), transform, Affine2.copy(transform).invert()), undefined)
})

test("linesIntersection: returns one point when the segments cross", () => {
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -3
  transform.y = -3

  const intersections = linesIntersection(new Line2(3), new Line2(3), transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[0].y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].tangent.y, 0, 1e-10), true)
})

test("linesIntersection: returns the overlap endpoints when the segments are coincident", () => {
  const transform = Affine2.identity()

  const intersections = linesIntersection(new Line2(3), new Line2(3), transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 2)
  strictEqual(fuzzyEqual(intersections[0].points[0].x, -3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].points[1].x, 3, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(intersections[0].normal.y, -1, 1e-10), true)
})
