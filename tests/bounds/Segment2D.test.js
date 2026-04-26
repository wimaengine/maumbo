import test from "node:test"
import { strictEqual } from "node:assert"
import { Segment2D } from "../../dist/index.module.js"

test("Segment2D: constructor preserves start and end ordering", () => {
  const segment = new Segment2D(1, 2, 3, 4)

  strictEqual(segment.start.x, 1)
  strictEqual(segment.start.y, 2)
  strictEqual(segment.end.x, 3)
  strictEqual(segment.end.y, 4)
})

test("Segment2D: instance translate mutates and returns itself", () => {
  const segment = new Segment2D(1, 2, 3, 4)
  const translated = segment.translate(5, 6)

  strictEqual(translated, segment)
  strictEqual(segment.start.x, 6)
  strictEqual(segment.start.y, 8)
  strictEqual(segment.end.x, 8)
  strictEqual(segment.end.y, 10)
})

test("Segment2D: clone creates a deep copy", () => {
  const segment = new Segment2D(1, 2, 3, 4)
  const clone = segment.clone()

  strictEqual(clone === segment, false)
  strictEqual(clone.start === segment.start, false)
  strictEqual(clone.end === segment.end, false)
  strictEqual(clone.start.x, 1)
  strictEqual(clone.start.y, 2)
  strictEqual(clone.end.x, 3)
  strictEqual(clone.end.y, 4)
})

test("Segment2D: instance copy overwrites the target", () => {
  const source = new Segment2D(1, 2, 3, 4)
  const target = new Segment2D()

  target.copy(source)

  strictEqual(target.start.x, 1)
  strictEqual(target.start.y, 2)
  strictEqual(target.end.x, 3)
  strictEqual(target.end.y, 4)
})

test("Segment2D: static copy supports an explicit output", () => {
  const source = new Segment2D(1, 2, 3, 4)
  const out = new Segment2D()
  const result = Segment2D.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.start.x, 1)
  strictEqual(out.start.y, 2)
  strictEqual(out.end.x, 3)
  strictEqual(out.end.y, 4)
})

test("Segment2D: static translate supports an explicit output", () => {
  const source = new Segment2D(1, 2, 3, 4)
  const out = new Segment2D()
  const result = Segment2D.translate(source, 5, 6, out)

  strictEqual(result, out)
  strictEqual(out.start.x, 6)
  strictEqual(out.start.y, 8)
  strictEqual(out.end.x, 8)
  strictEqual(out.end.y, 10)
})
