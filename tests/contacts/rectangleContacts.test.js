import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Rectangle, rectangleContacts } from "../../dist/index.module.js"

test("rectangleContacts: returns undefined when separated", () => {
  const a = new Rectangle(1, 1)
  const b = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 3
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(rectangleContacts(a, b, transform, invTransform), undefined)
})

test("rectangleContacts: returns 2 contacts for face-face overlap", () => {
  const a = new Rectangle(1, 1)
  const b = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = rectangleContacts(a, b, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
  strictEqual(contacts.length, 2)
  contacts.forEach((c) => {
    ok(Math.abs(c.normalA.y) < 1e-6)
    strictEqual(fuzzyEqual(Math.abs(c.normalA.x), 1, 1e-6), true)
    strictEqual(fuzzyEqual(c.depth, 0.5, 1e-6), true)
  })
})
