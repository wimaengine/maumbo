import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, Vector2, fuzzyEqual } from "hisabati"
import { Circle, Contact2D, circleContact } from "../../dist/index.module.js"

test("circleContact: returns undefined when separated", () => {
  const a = new Circle(1)
  const b = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 3
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(circleContact(a, b, transform, invTransform), undefined)
})

test("circleContact: returns expected contact for pure translation", () => {
  const a = new Circle(1)
  const b = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contact = circleContact(a, b, transform, invTransform)
  strictEqual(contact instanceof Contact2D, true)

  strictEqual(fuzzyEqual(contact.pointA.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(contact.pointA.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.pointB.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(contact.pointB.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalA.x, 1, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalA.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalB.x, -1, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalB.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.depth, 0.5, 1e-10), true)
})
