import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import { Circle, ConvexPolygon, circlePolygonContact } from "../../dist/index.module.js"

test("circlePolygonContact: returns undefined when separated", () => {
  const circle = new Circle(1)
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(circlePolygonContact(circle, poly, transform, invTransform), undefined)
})

test("circlePolygonContact: returns contacts when overlapping", () => {
  const circle = new Circle(1)
  const poly = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ])
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = circlePolygonContact(circle, poly, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
  contacts.forEach((contact) => ok(contact.depth >= -1e-9))
})
