import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Triangle, triangleContacts } from "../../dist/index.module.js"

test("triangleContacts: returns undefined when separated", () => {
  const a = new Triangle(1, 1)
  const b = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(triangleContacts(a, b, transform, invTransform), undefined)
})

test("triangleContacts: returns contacts when overlapping", () => {
  const a = new Triangle(1, 1)
  const b = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 0.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = triangleContacts(a, b, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
})
