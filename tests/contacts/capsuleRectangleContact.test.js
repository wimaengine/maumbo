import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import {
  Capsule,
  Contact2D,
  Rectangle,
  capsuleRectangleContact
} from "../../dist/index.module.js"

test("capsuleRectangleContact: returns undefined when separated", () => {
  const capsule = new Capsule(1, 2)
  const rectangle = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(capsuleRectangleContact(capsule, rectangle, transform, invTransform), undefined)
})

test("capsuleRectangleContact: returns 2 contacts for side-face overlap", () => {
  const capsule = new Capsule(1, 2)
  const rectangle = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = capsuleRectangleContact(capsule, rectangle, transform, invTransform)

  ok(Array.isArray(contacts))
  strictEqual(contacts.length, 2)

  contacts.forEach((contact) => {
    ok(contact instanceof Contact2D)
    ok(contact.depth > 0)
    strictEqual(fuzzyEqual(contact.pointA.x, 1, 1e-6), true)
    strictEqual(fuzzyEqual(Math.abs(contact.normalA.x), 1, 1e-6), true)
    strictEqual(fuzzyEqual(contact.normalA.y, 0, 1e-6), true)

    const normalBInA = Affine2.transformWithoutTranslation(transform, contact.normalB.clone())
    strictEqual(fuzzyEqual(normalBInA.x, -contact.normalA.x, 1e-6), true)
    strictEqual(fuzzyEqual(normalBInA.y, -contact.normalA.y, 1e-6), true)

    const worldPointB = transform.transform(contact.pointB.clone())
    strictEqual(fuzzyEqual(worldPointB.x, 0.5, 1e-6), true)
    strictEqual(fuzzyEqual(Math.abs(contact.depth), 0.5, 1e-6), true)
  })
})
