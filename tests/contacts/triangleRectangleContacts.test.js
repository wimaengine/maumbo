import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Rectangle, Triangle, triangleRectangleContacts } from "../../dist/index.module.js"

test("triangleRectangleContacts: returns undefined when separated", () => {
  const tri = new Triangle(1, 1)
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(triangleRectangleContacts(tri, rect, transform, invTransform), undefined)
})

test("triangleRectangleContacts: returns contacts when overlapping", () => {
  const tri = new Triangle(1, 1)
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 0.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = triangleRectangleContacts(tri, rect, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
})
