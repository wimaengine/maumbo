import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import { ConvexPolygon, Triangle, polygonTriangleContacts } from "../../dist/index.module.js"

test("polygonTriangleContacts: returns undefined when separated", () => {
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const tri = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(polygonTriangleContacts(poly, tri, transform, invTransform), undefined)
})

test("polygonTriangleContacts: returns contacts when overlapping", () => {
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const tri = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 0.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = polygonTriangleContacts(poly, tri, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
})
