import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine3, Vector3 } from "hisabati"
import { BoundingSphere } from "../../dist/index.module.js"

test("BoundingSphere: constructor initializes position and radius", () => {
  const sphere = new BoundingSphere(1, 2, 3, 4)

  strictEqual(sphere.position.x, 1)
  strictEqual(sphere.position.y, 2)
  strictEqual(sphere.position.z, 3)
  strictEqual(sphere.radius, 4)
})

test("BoundingSphere: instance translate mutates in place", () => {
  const sphere = new BoundingSphere(1, 2, 3, 4)
  const result = sphere.translate(new Vector3(5, 6, 7))

  strictEqual(result, undefined)
  strictEqual(sphere.position.x, 6)
  strictEqual(sphere.position.y, 8)
  strictEqual(sphere.position.z, 10)
  strictEqual(sphere.radius, 4)
})

test("BoundingSphere: instance copy overwrites position and radius", () => {
  const source = new BoundingSphere(1, 2, 3, 4)
  const target = new BoundingSphere()
  const result = target.copy(source)

  strictEqual(result, undefined)
  strictEqual(target.position.x, 1)
  strictEqual(target.position.y, 2)
  strictEqual(target.position.z, 3)
  strictEqual(target.radius, 4)
})

test("BoundingSphere: static translate preserves radius", () => {
  const source = new BoundingSphere(1, 2, 3, 4)
  const out = new BoundingSphere()
  const result = BoundingSphere.translate(source, new Vector3(5, 6, 7), out)

  strictEqual(result, out)
  strictEqual(out.position.x, 6)
  strictEqual(out.position.y, 8)
  strictEqual(out.position.z, 10)
  strictEqual(out.radius, 4)
})

test("BoundingSphere: static copy supports an explicit output", () => {
  const source = new BoundingSphere(1, 2, 3, 4)
  const out = new BoundingSphere()
  const result = BoundingSphere.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.position.x, 1)
  strictEqual(out.position.y, 2)
  strictEqual(out.position.z, 3)
  strictEqual(out.radius, 4)
})

test("BoundingSphere: instance transform updates position and scales radius", () => {
  const sphere = new BoundingSphere(1, 2, 3, 4)
  const transform = new Affine3()
    .scale(new Vector3(2, 3, 5))
    .translate(new Vector3(7, 11, 13))
  const result = sphere.transform(transform)

  strictEqual(result, undefined)
  strictEqual(sphere.position.x, 9)
  strictEqual(sphere.position.y, 17)
  strictEqual(sphere.position.z, 28)
  strictEqual(sphere.radius, 20)
})

test("BoundingSphere: static transform supports an explicit output", () => {
  const source = new BoundingSphere(1, 2, 3, 4)
  const transform = new Affine3()
    .scale(new Vector3(2, 3, 5))
    .translate(new Vector3(7, 11, 13))
  const out = new BoundingSphere()
  const result = BoundingSphere.transform(source, transform, out)

  strictEqual(result, out)
  strictEqual(out.position.x, 9)
  strictEqual(out.position.y, 17)
  strictEqual(out.position.z, 28)
  strictEqual(out.radius, 20)
})
