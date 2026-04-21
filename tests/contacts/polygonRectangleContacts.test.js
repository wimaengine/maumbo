import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import { ConvexPolygon, Rectangle, polygonRectangleContacts } from "../../dist/index.module.js"

test("polygonRectangleContacts: returns undefined when separated", () => {
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(polygonRectangleContacts(poly, rect, transform, invTransform), undefined)
})

test("polygonRectangleContacts: returns contacts when overlapping", () => {
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = polygonRectangleContacts(poly, rect, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
})
