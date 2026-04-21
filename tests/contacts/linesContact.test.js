import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2, fuzzyEqual } from "hisabati"
import { Contact2D, Line2, linesContact } from "../../dist/index.module.js"

test("linesContact: returns undefined when not coincident", () => {
  const a = new Line2(2)
  const b = new Line2(2)
  const transform = Affine2.identity()
  transform.y = 1
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(linesContact(a, b, transform, invTransform), undefined)
})

test("linesContact: returns contact when identical (identity transform)", () => {
  const a = new Line2(2)
  const b = new Line2(2)
  const transform = Affine2.identity()
  const invTransform = Affine2.copy(transform).invert()

  const contact = linesContact(a, b, transform, invTransform)
  strictEqual(contact instanceof Contact2D, true)
  strictEqual(contact.depth, 0)
  strictEqual(fuzzyEqual(contact.pointA.x, 2, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointA.y, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointB.x, 2, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointB.y, 0, 1e-12), true)
})
