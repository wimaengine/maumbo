import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2 } from "hisabati"
import { Contact2D, Line2, Triangle, lineTriangleContact } from "../../dist/index.module.js"

test("lineTriangleContact: returns undefined when separated", () => {
  const line = new Line2(2)
  const tri = new Triangle(1, 1)
  const transform = Affine2.identity()
  transform.y = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(lineTriangleContact(line, tri, transform, invTransform), undefined)
})

test("lineTriangleContact: intersects triangle", () => {
  const line = new Line2(5)
  const tri = new Triangle(1, 1)
  const transform = Affine2.identity()
  const invTransform = Affine2.copy(transform).invert()

  const contact = lineTriangleContact(line, tri, transform, invTransform)
  ok(contact instanceof Contact2D)
  ok(Number.isFinite(contact.depth))
  ok(contact.depth >= 0)
  ok(Math.abs(contact.normalA.magnitude() - 1) <= 1e-6)
  ok(Math.abs(contact.normalB.magnitude() - 1) <= 1e-6)
  strictEqual(Math.abs(contact.pointB.y) < 1e-12, true)
})
