import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import {
  Capsule,
  Contact2D,
  Triangle,
  capsuleTriangleContact
} from "../../dist/index.module.js"

test("capsuleTriangleContact: returns contacts when overlapping a triangle", () => {
  const capsule = new Capsule(1, 2)
  const triangle = new Triangle(1.5, 1.5)
  const transform = Affine2.identity()
  transform.y = 2.2
  const invTransform = Affine2.copy(transform).invert()

  const contacts = capsuleTriangleContact(capsule, triangle, transform, invTransform)

  ok(Array.isArray(contacts))
  ok(contacts.length >= 1)

  contacts.forEach((contact) => {
    ok(contact instanceof Contact2D)
    ok(contact.depth > 0)
    const normalBInA = Affine2.transformWithoutTranslation(transform, contact.normalB.clone())
    strictEqual(fuzzyEqual(normalBInA.x, -contact.normalA.x, 1e-6), true)
    strictEqual(fuzzyEqual(normalBInA.y, -contact.normalA.y, 1e-6), true)
  })
})
