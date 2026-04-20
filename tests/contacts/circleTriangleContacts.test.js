import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Circle, Triangle, circleTriangleContacts } from "../../dist/index.module.js"

test("circleTriangleContacts: returns undefined when separated", () => {
  const circle = new Circle(1)
  const tri = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(circleTriangleContacts(circle, tri, transform, invTransform), undefined)
})

test("circleTriangleContacts: returns contacts when overlapping", () => {
  const circle = new Circle(1)
  const tri = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 0.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = circleTriangleContacts(circle, tri, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
  contacts.forEach((contact) => ok(contact.depth >= -1e-9))
})
