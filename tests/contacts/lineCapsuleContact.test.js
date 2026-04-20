import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Capsule, Contact2D, Line2, lineCapsuleContact } from "../../dist/index.module.js"

test("lineCapsuleContact: returns undefined when separated", () => {
  const line = new Line2(2)
  const cap = new Capsule(1, 2)
  const transform = Affine2.identity()
  transform.y = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(lineCapsuleContact(line, cap, transform, invTransform), undefined)
})

test("lineCapsuleContact: contacts capsule spine at center", () => {
  const line = new Line2(5)
  const cap = new Capsule(1, 2)
  const transform = Affine2.identity()
  const invTransform = Affine2.copy(transform).invert()

  const contact = lineCapsuleContact(line, cap, transform, invTransform)
  strictEqual(contact instanceof Contact2D, true)
  strictEqual(fuzzyEqual(contact.pointA.x, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointA.y, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointB.x, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointB.y, 1, 1e-12), true)
  strictEqual(fuzzyEqual(contact.depth, 1, 1e-12), true)
})
