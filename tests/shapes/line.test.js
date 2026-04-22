import test from "node:test"
import { strictEqual } from "node:assert"
import { Line2, Shape2 } from "../../dist/index.module.js"

test("Line2 stores halfLength and extends Shape2", () => {
  const line = new Line2(5)

  strictEqual(line.halfLength, 5)
  strictEqual(line instanceof Shape2, true)
})
