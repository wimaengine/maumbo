import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Circle, Rectangle, circleRectangleContacts } from "../../dist/index.module.js"

test("circleRectangleContacts: returns undefined when separated", () => {
  const circle = new Circle(1)
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(circleRectangleContacts(circle, rect, transform, invTransform), undefined)
})

test("circleRectangleContacts: returns contacts when overlapping", () => {
  const circle = new Circle(1)
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = circleRectangleContacts(circle, rect, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
  contacts.forEach((contact) => ok(contact.depth >= -1e-9))
})
