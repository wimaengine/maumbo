import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Contact2D, Line2, Rectangle, lineRectangleContact } from "../../dist/index.module.js"

test("lineRectangleContact: returns undefined when separated", () => {
  const line = new Line2(2)
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.y = 3
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(lineRectangleContact(line, rect, transform, invTransform), undefined)
})

test("lineRectangleContact: intersects AABB and reports entry contact", () => {
  const line = new Line2(5)
  const rect = new Rectangle(1, 1)
  const transform = Affine2.identity()
  const invTransform = Affine2.copy(transform).invert()

  const contact = lineRectangleContact(line, rect, transform, invTransform)
  strictEqual(contact instanceof Contact2D, true)
  strictEqual(fuzzyEqual(contact.pointA.x, 1, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointA.y, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointB.x, 1, 1e-12), true)
  strictEqual(fuzzyEqual(contact.pointB.y, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.normalB.x, 1, 1e-12), true)
  strictEqual(fuzzyEqual(contact.normalB.y, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.normalA.x, -1, 1e-12), true)
  strictEqual(fuzzyEqual(contact.normalA.y, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.depth, 2, 1e-12), true)
})
