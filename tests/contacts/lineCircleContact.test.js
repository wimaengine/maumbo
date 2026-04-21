import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Circle, Contact2D, Line2, lineCircleContact } from "../../dist/index.module.js"

test("lineCircleContact: returns undefined when separated", () => {
  const line = new Line2(5)
  const circle = new Circle(1)
  const transform = Affine2.identity()
  transform.y = 2
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(lineCircleContact(line, circle, transform, invTransform), undefined)
})

test("lineCircleContact: hits horizontal segment at closest point", () => {
  const line = new Line2(5)
  const circle = new Circle(1)
  const transform = Affine2.identity()
  transform.y = 0.5
  const invTransform = Affine2.copy(transform).invert()

  const contact = lineCircleContact(line, circle, transform, invTransform)
  strictEqual(contact instanceof Contact2D, true)
  strictEqual(fuzzyEqual(contact.pointA.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.pointA.y, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.pointB.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.pointB.y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalA.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalA.y, 1, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalB.x, 0, 1e-10), true)
  strictEqual(fuzzyEqual(contact.normalB.y, -1, 1e-10), true)
  strictEqual(fuzzyEqual(contact.depth, 0.5, 1e-10), true)
})
