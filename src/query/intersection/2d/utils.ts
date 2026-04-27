import { Affine2, TAU, Vector2 } from 'hisabati'
import { Intersection2D } from '../../../core'
import {
  Capsule,
  Circle,
  ConvexPolygon,
  Line2,
  Rectangle,
  Shape2,
  Triangle
} from '../../../shapes'

const EPSILON = 1e-8
const SAMPLE_POINTS_PER_PI = 16

type ShapeLike2D = Shape2 | Capsule

type SegmentPrimitive = {
  type: 'segment'
  start: Vector2
  end: Vector2
  normal: Vector2
}

type ArcPrimitive = {
  type: 'arc'
  center: Vector2
  radius: number
  startAngle: number
  endAngle: number
  full: boolean
}

type BoundaryPrimitive = SegmentPrimitive | ArcPrimitive

type AngleInterval = {
  start: number
  end: number
}

export function intersectShapes2d(
  shapeA: ShapeLike2D,
  shapeB: ShapeLike2D,
  transform: Affine2
): Intersection2D[] | undefined {
  const primitivesA = getBoundaryPrimitives(shapeA)
  const primitivesB = getBoundaryPrimitives(shapeB, transform)
  const intersections: Intersection2D[] = []

  for (const primitiveA of primitivesA) {
    for (const primitiveB of primitivesB) {
      intersections.push(...intersectPrimitivePair(primitiveA, primitiveB))
    }
  }

  return dedupeIntersections(intersections)
}

function getBoundaryPrimitives(
  shape: ShapeLike2D,
  transform?: Affine2
): BoundaryPrimitive[] {
  let primitives: BoundaryPrimitive[]

  if (shape instanceof Circle) {
    primitives = [{
      type: 'arc',
      center: new Vector2(),
      radius: shape.radius,
      startAngle: 0,
      endAngle: TAU,
      full: true
    }]
  } else if (shape instanceof Line2) {
    primitives = [createSegment(
      new Vector2(-shape.halfLength, 0),
      new Vector2(shape.halfLength, 0)
    )]
  } else if (shape instanceof Rectangle || shape instanceof Triangle || shape instanceof ConvexPolygon) {
    primitives = createPolygonSegments(shape.getPoints())
  } else if (shape instanceof Capsule) {
    primitives = createCapsulePrimitives(shape)
  } else {
    primitives = []
  }

  return transform ? primitives.map((primitive) => transformPrimitive(primitive, transform)) : primitives
}

function createPolygonSegments(points: Vector2[]): SegmentPrimitive[] {
  if (points.length < 2) {
    return []
  }

  const centroid = points.reduce((acc, point) => acc.add(point), new Vector2()).multiplyScalar(1 / points.length)
  const segments: SegmentPrimitive[] = []

  for (let i = 0; i < points.length; i++) {
    const start = points[i].clone()
    const end = points[(i + 1) % points.length].clone()
    const edge = Vector2.subtract(end, start)

    if (edge.magnitudeSquared() <= EPSILON * EPSILON) {
      continue
    }

    let normal = new Vector2(edge.y, -edge.x).normalize()
    const midpoint = Vector2.add(start, end).multiplyScalar(0.5)

    if (Vector2.dot(normal, Vector2.subtract(centroid, midpoint)) > 0) {
      normal.reverse()
    }

    segments.push({
      type: 'segment',
      start,
      end,
      normal
    })
  }

  return segments
}

function createCapsulePrimitives(shape: Capsule): BoundaryPrimitive[] {
  if (shape.halfHeight <= EPSILON) {
    return [{
      type: 'arc',
      center: new Vector2(),
      radius: shape.radius,
      startAngle: 0,
      endAngle: TAU,
      full: true
    }]
  }

  return [
    {
      type: 'segment',
      start: new Vector2(shape.radius, -shape.halfHeight),
      end: new Vector2(shape.radius, shape.halfHeight),
      normal: new Vector2(1, 0)
    },
    {
      type: 'arc',
      center: new Vector2(0, shape.halfHeight),
      radius: shape.radius,
      startAngle: 0,
      endAngle: Math.PI,
      full: false
    },
    {
      type: 'segment',
      start: new Vector2(-shape.radius, shape.halfHeight),
      end: new Vector2(-shape.radius, -shape.halfHeight),
      normal: new Vector2(-1, 0)
    },
    {
      type: 'arc',
      center: new Vector2(0, -shape.halfHeight),
      radius: shape.radius,
      startAngle: Math.PI,
      endAngle: TAU,
      full: false
    }
  ]
}

function createSegment(start: Vector2, end: Vector2): SegmentPrimitive {
  const tangent = Vector2.subtract(end, start).normalize()

  return {
    type: 'segment',
    start,
    end,
    normal: new Vector2(tangent.y, -tangent.x)
  }
}

function transformPrimitive(primitive: BoundaryPrimitive, transform: Affine2): BoundaryPrimitive {
  if (primitive.type === 'segment') {
    return {
      type: 'segment',
      start: transform.transform(primitive.start.clone()),
      end: transform.transform(primitive.end.clone()),
      normal: Affine2.transformWithoutTranslation(transform, primitive.normal.clone()).normalize()
    }
  }

  const center = transform.transform(primitive.center.clone())

  if (primitive.full) {
    return {
      type: 'arc',
      center,
      radius: primitive.radius,
      startAngle: 0,
      endAngle: TAU,
      full: true
    }
  }

  const startPoint = transformPointOnArc(primitive, primitive.startAngle, transform)
  const endPoint = transformPointOnArc(primitive, primitive.endAngle, transform)

  return {
    type: 'arc',
    center,
    radius: primitive.radius,
    startAngle: Math.atan2(startPoint.y - center.y, startPoint.x - center.x),
    endAngle: Math.atan2(endPoint.y - center.y, endPoint.x - center.x),
    full: false
  }
}

function transformPointOnArc(arc: ArcPrimitive, angle: number, transform: Affine2): Vector2 {
  const point = pointOnCircle(arc.center, arc.radius, angle)
  return transform.transform(point)
}

function intersectPrimitivePair(
  primitiveA: BoundaryPrimitive,
  primitiveB: BoundaryPrimitive
): Intersection2D[] {
  if (primitiveA.type === 'segment' && primitiveB.type === 'segment') {
    return intersectSegmentSegment(primitiveA, primitiveB)
  }

  if (primitiveA.type === 'segment' && primitiveB.type === 'arc') {
    return intersectSegmentArc(primitiveA, primitiveB)
  }

  if (primitiveA.type === 'arc' && primitiveB.type === 'segment') {
    return intersectArcSegment(primitiveA, primitiveB)
  }

  if (primitiveA.type === 'arc' && primitiveB.type === 'arc') {
    return intersectArcArc(primitiveA, primitiveB)
  }

  return []
}

function intersectSegmentSegment(
  segmentA: SegmentPrimitive,
  segmentB: SegmentPrimitive
): Intersection2D[] {
  const p = segmentA.start
  const q = segmentB.start
  const r = Vector2.subtract(segmentA.end, segmentA.start)
  const s = Vector2.subtract(segmentB.end, segmentB.start)
  const rxs = cross2d(r, s)
  const qmp = Vector2.subtract(q, p)
  const qmpxr = cross2d(qmp, r)
  const intersections: Intersection2D[] = []

  if (Math.abs(rxs) <= EPSILON && Math.abs(qmpxr) <= EPSILON) {
    const rr = Vector2.dot(r, r)

    if (rr <= EPSILON) {
      return intersections
    }

    let t0 = Vector2.dot(qmp, r) / rr
    let t1 = t0 + Vector2.dot(s, r) / rr

    if (t0 > t1) {
      const swap = t0
      t0 = t1
      t1 = swap
    }

    const overlapStart = Math.max(0, t0)
    const overlapEnd = Math.min(1, t1)

    if (overlapEnd < -EPSILON || overlapStart > 1 + EPSILON || overlapEnd < overlapStart - EPSILON) {
      return intersections
    }

    const start = Vector2.add(p, Vector2.multiplyScalar(r, clamp01(overlapStart)))
    const end = Vector2.add(p, Vector2.multiplyScalar(r, clamp01(overlapEnd)))

    if (Vector2.distanceToSquared(start, end) <= EPSILON * EPSILON) {
      intersections.push(createPointIntersection(start, segmentA.normal, segmentDirection(segmentA)))
    } else {
      intersections.push(createLinearIntersection([start, end], segmentA.normal, segmentDirection(segmentA)))
    }

    return intersections
  }

  if (Math.abs(rxs) <= EPSILON) {
    return intersections
  }

  const t = cross2d(qmp, s) / rxs
  const u = cross2d(qmp, r) / rxs

  if (!isWithinUnitInterval(t) || !isWithinUnitInterval(u)) {
    return intersections
  }

  const point = Vector2.add(p, Vector2.multiplyScalar(r, t))
  intersections.push(createPointIntersection(point, segmentA.normal, segmentDirection(segmentA)))

  return intersections
}

function intersectSegmentArc(
  segment: SegmentPrimitive,
  arc: ArcPrimitive
): Intersection2D[] {
  const direction = Vector2.subtract(segment.end, segment.start)
  const offset = Vector2.subtract(segment.start, arc.center)
  const a = Vector2.dot(direction, direction)
  const b = 2 * Vector2.dot(offset, direction)
  const c = Vector2.dot(offset, offset) - arc.radius * arc.radius
  const discriminant = b * b - 4 * a * c
  const intersections: Intersection2D[] = []

  if (discriminant < -EPSILON || a <= EPSILON) {
    return intersections
  }

  if (Math.abs(discriminant) <= EPSILON) {
    const t = -b / (2 * a)

    if (!isWithinUnitInterval(t)) {
      return intersections
    }

    const point = Vector2.add(segment.start, Vector2.multiplyScalar(direction, t))

    if (isPointOnArc(point, arc)) {
      intersections.push(createPointIntersection(point, segment.normal, segmentDirection(segment)))
    }

    return intersections
  }

  const sqrtDisc = Math.sqrt(discriminant)
  const ts = [
    (-b - sqrtDisc) / (2 * a),
    (-b + sqrtDisc) / (2 * a)
  ]

  for (const t of ts) {
    if (!isWithinUnitInterval(t)) {
      continue
    }

    const point = Vector2.add(segment.start, Vector2.multiplyScalar(direction, t))

    if (isPointOnArc(point, arc)) {
      intersections.push(createPointIntersection(point, segment.normal, segmentDirection(segment)))
    }
  }

  return dedupeIntersections(intersections) ?? []
}

function intersectArcSegment(
  arc: ArcPrimitive,
  segment: SegmentPrimitive
): Intersection2D[] {
  const direction = Vector2.subtract(segment.end, segment.start)
  const offset = Vector2.subtract(segment.start, arc.center)
  const a = Vector2.dot(direction, direction)
  const b = 2 * Vector2.dot(offset, direction)
  const c = Vector2.dot(offset, offset) - arc.radius * arc.radius
  const discriminant = b * b - 4 * a * c
  const intersections: Intersection2D[] = []

  if (discriminant < -EPSILON || a <= EPSILON) {
    return intersections
  }

  if (Math.abs(discriminant) <= EPSILON) {
    const t = -b / (2 * a)

    if (!isWithinUnitInterval(t)) {
      return intersections
    }

    const point = Vector2.add(segment.start, Vector2.multiplyScalar(direction, t))

    if (isPointOnArc(point, arc)) {
      intersections.push(createPointIntersection(point, arcNormal(arc, point), arcTangent(arc, point)))
    }

    return intersections
  }

  const sqrtDisc = Math.sqrt(discriminant)
  const ts = [
    (-b - sqrtDisc) / (2 * a),
    (-b + sqrtDisc) / (2 * a)
  ]

  for (const t of ts) {
    if (!isWithinUnitInterval(t)) {
      continue
    }

    const point = Vector2.add(segment.start, Vector2.multiplyScalar(direction, t))

    if (isPointOnArc(point, arc)) {
      intersections.push(createPointIntersection(point, arcNormal(arc, point), arcTangent(arc, point)))
    }
  }

  return dedupeIntersections(intersections) ?? []
}

function intersectArcArc(
  arcA: ArcPrimitive,
  arcB: ArcPrimitive
): Intersection2D[] {
  const centerDelta = Vector2.subtract(arcB.center, arcA.center)
  const distance = centerDelta.magnitude()
  const intersections: Intersection2D[] = []

  if (distance <= EPSILON && Math.abs(arcA.radius - arcB.radius) <= EPSILON) {
    const overlaps = intersectArcIntervals(arcA, arcB)

    for (const overlap of overlaps) {
      const span = overlapSpan(overlap)

      if (span <= EPSILON) {
        const point = pointOnCircle(arcA.center, arcA.radius, overlap.start)
        intersections.push(createPointIntersection(point, arcNormal(arcA, point), arcTangent(arcA, point)))
        continue
      }

      const points = sampleArcPoints(arcA.center, arcA.radius, overlap.start, overlap.end)
      const midpoint = points[Math.floor(points.length / 2)] ?? pointOnCircle(arcA.center, arcA.radius, overlap.start)

      intersections.push(
        createLinearIntersection(
          points,
          arcNormal(arcA, midpoint),
          arcTangent(arcA, midpoint)
        )
      )
    }

    return intersections
  }

  if (distance > arcA.radius + arcB.radius + EPSILON) {
    return intersections
  }

  if (distance < Math.abs(arcA.radius - arcB.radius) - EPSILON) {
    return intersections
  }

  if (distance <= EPSILON) {
    return intersections
  }

  const a = (
    arcA.radius * arcA.radius -
    arcB.radius * arcB.radius +
    distance * distance
  ) / (2 * distance)
  const hSquared = arcA.radius * arcA.radius - a * a

  if (hSquared < -EPSILON) {
    return intersections
  }

  const midpoint = Vector2.add(
    arcA.center,
    Vector2.multiplyScalar(centerDelta, a / distance)
  )

  if (Math.abs(hSquared) <= EPSILON) {
    if (isPointOnArc(midpoint, arcA) && isPointOnArc(midpoint, arcB)) {
      intersections.push(
        createPointIntersection(midpoint, arcNormal(arcA, midpoint), arcTangent(arcA, midpoint))
      )
    }

    return intersections
  }

  const h = Math.sqrt(hSquared)
  const offset = new Vector2(-centerDelta.y / distance, centerDelta.x / distance).multiplyScalar(h)
  const candidates = [
    Vector2.add(midpoint, offset),
    Vector2.subtract(midpoint, offset)
  ]

  for (const point of candidates) {
    if (isPointOnArc(point, arcA) && isPointOnArc(point, arcB)) {
      intersections.push(
        createPointIntersection(point, arcNormal(arcA, point), arcTangent(arcA, point))
      )
    }
  }

  return dedupeIntersections(intersections) ?? []
}

function intersectArcIntervals(arcA: ArcPrimitive, arcB: ArcPrimitive): AngleInterval[] {
  const intervalsA = getArcIntervals(arcA)
  const intervalsB = getArcIntervals(arcB)
  const overlaps: AngleInterval[] = []

  for (const intervalA of intervalsA) {
    for (const intervalB of intervalsB) {
      const start = Math.max(intervalA.start, intervalB.start)
      const end = Math.min(intervalA.end, intervalB.end)

      if (end < start - EPSILON) {
        continue
      }

      overlaps.push({
        start,
        end: end < start ? start : end
      })
    }
  }

  return mergeIntervals(overlaps)
}

function getArcIntervals(arc: ArcPrimitive): AngleInterval[] {
  if (arc.full) {
    return [{ start: 0, end: TAU }]
  }

  const start = normalizeAngle(arc.startAngle)
  const end = normalizeAngle(arc.endAngle)

  if (Math.abs(overlapSpan({ start, end: start + deltaAngle(start, end) }) - TAU) <= EPSILON) {
    return [{ start: 0, end: TAU }]
  }

  if (end >= start) {
    return [{ start, end }]
  }

  return [
    { start, end: TAU },
    { start: 0, end }
  ]
}

function mergeIntervals(intervals: AngleInterval[]): AngleInterval[] {
  if (!intervals.length) {
    return []
  }

  const sorted = [...intervals].sort((a, b) => a.start - b.start)
  const merged: AngleInterval[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    const last = merged[merged.length - 1]

    if (current.start <= last.end + EPSILON) {
      last.end = Math.max(last.end, current.end)
    } else {
      merged.push({ ...current })
    }
  }

  return merged
}

function sampleArcPoints(
  center: Vector2,
  radius: number,
  startAngle: number,
  endAngle: number
): Vector2[] {
  const span = overlapSpan({ start: startAngle, end: endAngle })

  if (span <= EPSILON) {
    return [pointOnCircle(center, radius, startAngle)]
  }

  const steps = Math.max(2, Math.ceil(span / Math.PI * SAMPLE_POINTS_PER_PI))
  const points: Vector2[] = []

  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + span * (i / steps)
    points.push(pointOnCircle(center, radius, angle))
  }

  if (Math.abs(span - TAU) <= EPSILON) {
    points.push(points[0].clone())
  }

  return points
}

function isPointOnArc(point: Vector2, arc: ArcPrimitive): boolean {
  const distanceSquared = Vector2.distanceToSquared(point, arc.center)

  if (Math.abs(distanceSquared - arc.radius * arc.radius) > 1e-5) {
    return false
  }

  if (arc.full) {
    return true
  }

  const angle = Math.atan2(point.y - arc.center.y, point.x - arc.center.x)
  return isAngleOnArc(angle, arc.startAngle, arc.endAngle)
}

function isAngleOnArc(angle: number, startAngle: number, endAngle: number): boolean {
  const start = normalizeAngle(startAngle)
  const angleDelta = deltaAngle(start, angle)
  const arcDelta = deltaAngle(start, endAngle)

  return angleDelta <= arcDelta + 1e-6
}

function createPointIntersection(
  point: Vector2,
  normal: Vector2,
  tangent: Vector2
): Intersection2D {
  return new Intersection2D([point.clone()], normal.clone(), tangent.clone())
}

function createLinearIntersection(
  points: Vector2[],
  normal: Vector2,
  tangent: Vector2
): Intersection2D {
  return new Intersection2D(points.map((point) => point.clone()), normal.clone(), tangent.clone())
}

function pointOnCircle(center: Vector2, radius: number, angle: number): Vector2 {
  return new Vector2(
    center.x + Math.cos(angle) * radius,
    center.y + Math.sin(angle) * radius
  )
}

function arcNormal(arc: ArcPrimitive, point: Vector2): Vector2 {
  return Vector2.subtract(point, arc.center).normalize()
}

function arcTangent(arc: ArcPrimitive, point: Vector2): Vector2 {
  const normal = arcNormal(arc, point)
  return new Vector2(-normal.y, normal.x)
}

function segmentDirection(segment: SegmentPrimitive): Vector2 {
  const direction = Vector2.subtract(segment.end, segment.start)
  return direction.magnitudeSquared() <= EPSILON * EPSILON
    ? new Vector2(-segment.normal.y, segment.normal.x)
    : direction.normalize()
}

function dedupeIntersections(intersections: Intersection2D[]): Intersection2D[] | undefined {
  const deduped: Intersection2D[] = []

  for (const intersection of intersections) {
    if (!intersection.points.length) {
      continue
    }

    if (intersection.points.length === 1) {
      const point = intersection.points[0]

      if (deduped.some((existing) => containsPoint(existing, point))) {
        continue
      }
    } else if (deduped.some((existing) => samePolyline(existing.points, intersection.points))) {
      continue
    }

    deduped.push(intersection)
  }

  return deduped.length ? deduped : undefined
}

function containsPoint(intersection: Intersection2D, point: Vector2): boolean {
  return intersection.points.some((existing) => Vector2.distanceToSquared(existing, point) <= 1e-10)
}

function samePolyline(pointsA: Vector2[], pointsB: Vector2[]): boolean {
  if (pointsA.length !== pointsB.length) {
    return false
  }

  let forward = true
  let reverse = true

  for (let i = 0; i < pointsA.length; i++) {
    if (Vector2.distanceToSquared(pointsA[i], pointsB[i]) > 1e-10) {
      forward = false
    }

    if (Vector2.distanceToSquared(pointsA[i], pointsB[pointsB.length - 1 - i]) > 1e-10) {
      reverse = false
    }
  }

  return forward || reverse
}

function normalizeAngle(angle: number): number {
  let result = angle % TAU

  if (result < 0) {
    result += TAU
  }

  return result
}

function deltaAngle(start: number, end: number): number {
  let delta = normalizeAngle(end) - normalizeAngle(start)

  if (delta < 0) {
    delta += TAU
  }

  return delta
}

function overlapSpan(interval: AngleInterval): number {
  return Math.max(0, interval.end - interval.start)
}

function isWithinUnitInterval(value: number): boolean {
  return value >= -EPSILON && value <= 1 + EPSILON
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

function cross2d(a: Vector2, b: Vector2): number {
  return a.x * b.y - a.y * b.x
}
