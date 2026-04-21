import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import { ConvexPolygon, polygonContacts } from "../../dist/index.module.js"

test("polygonContacts: returns undefined when separated", () => {
  const a = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const b = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const transform = Affine2.identity()
  transform.x = 3
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(polygonContacts(a, b, transform, invTransform), undefined)
})

test("polygonContacts: returns contacts when overlapping", () => {
  const a = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const b = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = polygonContacts(a, b, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
})
