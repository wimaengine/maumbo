import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2, fuzzyEqual } from "hisabati"
import {
  Contact2D,
  ConvexPolygon,
  Line2,
  lineConvexPolygonContact
} from "../../dist/index.module.js"

test("lineConvexPolygonContact: returns undefined when separated", () => {
  const line = new Line2(2)
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const transform = Affine2.identity()
  transform.y = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(lineConvexPolygonContact(line, poly, transform, invTransform), undefined)
})

test("lineConvexPolygonContact: intersects convex polygon", () => {
  const line = new Line2(5)
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const transform = Affine2.identity()
  const invTransform = Affine2.copy(transform).invert()

  const contact = lineConvexPolygonContact(line, poly, transform, invTransform)
  strictEqual(contact instanceof Contact2D, true)
  strictEqual(fuzzyEqual(contact.pointB.x, 1, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointB.y, 0, 1e-12), true)
})
