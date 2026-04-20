import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import {
  Circle,
  Line2,
  Rectangle,
  circleContact,
  circleRectangleContacts,
  getShape2Contacts,
  lineCircleContact
} from "../../dist/index.module.js"

test("getShape2Contacts: dispatches circle-circle to circleContact", () => {
  const a = new Circle(1)
  const b = new Circle(1)
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const direct = circleContact(a, b, transform, invTransform)
  const contacts = getShape2Contacts(a, b, Affine2.identity(), transform)

  strictEqual(contacts?.length, 1)
  strictEqual(fuzzyEqual(contacts[0].pointA.x, direct.pointA.x, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].pointA.y, direct.pointA.y, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].pointB.x, direct.pointB.x, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].pointB.y, direct.pointB.y, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].depth, direct.depth, 1e-12), true)
})

test("getShape2Contacts: flips rectangle-circle to circleRectangleContacts", () => {
  const rect = new Rectangle(1, 1)
  const circle = new Circle(1)

  const rectT = Affine2.identity()
  const circleT = Affine2.identity()
  circleT.x = 1.5

  const contacts = getShape2Contacts(rect, circle, rectT, circleT)
  strictEqual(Array.isArray(contacts), true)
  strictEqual(contacts.length > 0, true)

  const transform = Affine2.invert(circleT).multiply(rectT)
  const invTransform = Affine2.invert(transform)
  const direct = circleRectangleContacts(circle, rect, transform, invTransform)
  strictEqual(Array.isArray(direct), true)
  strictEqual(direct.length, contacts.length)

  for (let i = 0; i < direct.length; i++) {
    const flipped = direct[i].clone().flip()
    strictEqual(fuzzyEqual(contacts[i].pointA.x, flipped.pointA.x, 1e-8), true)
    strictEqual(fuzzyEqual(contacts[i].pointA.y, flipped.pointA.y, 1e-8), true)
    strictEqual(fuzzyEqual(contacts[i].pointB.x, flipped.pointB.x, 1e-8), true)
    strictEqual(fuzzyEqual(contacts[i].pointB.y, flipped.pointB.y, 1e-8), true)
    strictEqual(fuzzyEqual(contacts[i].depth, flipped.depth, 1e-8), true)
  }
})

test("getShape2Contacts: flips circle-line to lineCircleContact", () => {
  const circle = new Circle(1)
  const line = new Line2(5)

  const circleT = Affine2.identity()
  circleT.y = 0.5
  const lineT = Affine2.identity()

  const contacts = getShape2Contacts(circle, line, circleT, lineT)
  strictEqual(contacts?.length, 1)

  const transform = Affine2.invert(lineT).multiply(circleT)
  const invTransform = Affine2.invert(transform)
  const direct = lineCircleContact(line, circle, transform, invTransform)
  const flipped = direct.clone().flip()
  strictEqual(fuzzyEqual(contacts[0].pointA.x, flipped.pointA.x, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].pointA.y, flipped.pointA.y, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].pointB.x, flipped.pointB.x, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].pointB.y, flipped.pointB.y, 1e-12), true)
  strictEqual(fuzzyEqual(contacts[0].depth, flipped.depth, 1e-12), true)
})
