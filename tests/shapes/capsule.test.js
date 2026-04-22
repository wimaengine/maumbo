import test from "node:test"
import { strictEqual } from "node:assert"
import { Capsule } from "../../dist/index.module.js"

test("Capsule stores radius and halfHeight", () => {
  const capsule = new Capsule(1.5, 4)

  strictEqual(capsule.radius, 1.5)
  strictEqual(capsule.halfHeight, 4)
})
