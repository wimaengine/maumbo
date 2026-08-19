import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Vector2, fuzzyEqual } from "hisabati"
import { Contact2D } from "../../dist/index.module.js"

test("Contact2D.transform: rebuilds tangents from the transformed normals", () => {
  const contact = new Contact2D(
    new Vector2(1, 0),
    new Vector2(-1, 0),
    new Vector2(0, 1),
    new Vector2(0, -1),
    0.5
  )

  const transform = Affine2.identity()
  contact.transform(transform, transform)

  strictEqual(fuzzyEqual(Vector2.dot(contact.normalA, contact.tangentA), 0, 1e-12), true)
  strictEqual(fuzzyEqual(Vector2.dot(contact.normalB, contact.tangentB), 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.tangentA.x + contact.tangentB.x, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.tangentA.y + contact.tangentB.y, 0, 1e-12), true)
})

test("Contact2D.flip: keeps tangents aligned with the swapped normals", () => {
  const contact = new Contact2D(
    new Vector2(1, 0),
    new Vector2(-1, 0),
    new Vector2(0, 1),
    new Vector2(0, -1),
    0.5
  )

  contact.flip()

  strictEqual(fuzzyEqual(Vector2.dot(contact.normalA, contact.tangentA), 0, 1e-12), true)
  strictEqual(fuzzyEqual(Vector2.dot(contact.normalB, contact.tangentB), 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.tangentA.x + contact.tangentB.x, 0, 1e-12), true)
  strictEqual(fuzzyEqual(contact.tangentA.y + contact.tangentB.y, 0, 1e-12), true)
})
