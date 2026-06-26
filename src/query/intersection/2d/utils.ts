import { Affine2, clamp, TAU, Vector2, wrap } from 'hisabati'
import { Intersection2D } from '../../../core'
import type { Shape2 } from '../../../shapes'
import { ArcBound2D, Segment2D, type BoundaryPrimitive2D } from '../../../bounds'

const SAMPLE_POINTS_PER_PI = 16

type AngleInterval = {
  start: number
  end: number
}

export function intersectShapes2d(
  shapeA: Shape2,
  shapeB: Shape2,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  const primitivesA = getBoundaryPrimitives(shapeA)
  const primitivesB = getBoundaryPrimitives(shapeB, transform)
  const scale = Math.max(
    1,
    getBoundaryScale(primitivesA),
    getBoundaryScale(primitivesB)
  )
  const effectiveTolerance = tolerance * scale
  const intersections: Intersection2D[] = []

  for (const primitiveA of primitivesA) {
    for (const primitiveB of primitivesB) {
      intersectPrimitivePair(intersections, primitiveA, primitiveB, effectiveTolerance)
    }
  }

  const deduped = dedupeIntersections(intersections, effectiveTolerance)

  if (!deduped.length) {
    return undefined
  }

  return flattenIntersections(deduped)
}

function getBoundaryPrimitives(
  shape: Shape2,
  transform?: Affine2
): BoundaryPrimitive2D[] {
  const primitives = shape.getBoundary()

  return transform ? primitives.map((primitive) => transformPrimitive(primitive, transform)) : primitives
}

function transformPrimitive(
  primitive: BoundaryPrimitive2D,
  transform: Affine2
): BoundaryPrimitive2D {
  if (primitive instanceof Segment2D) {
    return Segment2D.transform(primitive, transform, new Segment2D())
  }

  return ArcBound2D.transform(primitive, transform, new ArcBound2D())
}

function getBoundaryScale(primitives: BoundaryPrimitive2D[]): number {
  let scale = 1

  for (const primitive of primitives) {
    if (primitive instanceof Segment2D) {
      scale = Math.max(
        scale,
        Vector2.magnitude(primitive.start),
        Vector2.magnitude(primitive.end)
      )
      continue
    }

    scale = Math.max(
      scale,
      Vector2.magnitude(primitive.center) + primitive.radius
    )
  }

  return scale
}

function intersectPrimitivePair(
  intersections: Intersection2D[],
  primitiveA: BoundaryPrimitive2D,
  primitiveB: BoundaryPrimitive2D,
  tolerance: number
): void {
  if (primitiveA instanceof Segment2D && primitiveB instanceof Segment2D) {
    intersectSegmentSegment(intersections, primitiveA, primitiveB, tolerance)
    return
  }

  if (primitiveA instanceof Segment2D && primitiveB instanceof ArcBound2D) {
    intersectSegmentArc(intersections, primitiveA, primitiveB, tolerance)
    return
  }

  if (primitiveA instanceof ArcBound2D && primitiveB instanceof Segment2D) {
    intersectArcSegment(intersections, primitiveA, primitiveB, tolerance)
    return
  }

  if (primitiveA instanceof ArcBound2D && primitiveB instanceof ArcBound2D) {
    intersectArcArc(intersections, primitiveA, primitiveB, tolerance)
  }
}

function intersectSegmentSegment(
  intersections: Intersection2D[],
  segmentA: Segment2D,
  segmentB: Segment2D,
  tolerance: number
): void {
  const p = segmentA.start
  const q = segmentB.start
  const r = Vector2.subtract(segmentA.end, segmentA.start)
  const s = Vector2.subtract(segmentB.end, segmentB.start)
  const rxs = Vector2.cross(r, s)
  const qmp = Vector2.subtract(q, p)
  const qmpxr = Vector2.cross(qmp, r)
  const normal = segmentNormal(segmentA)

  if (Math.abs(rxs) <= tolerance && Math.abs(qmpxr) <= tolerance) {
    const rr = Vector2.dot(r, r)

    if (rr <= tolerance) {
      return
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

    if (
      overlapEnd < -tolerance ||
      overlapStart > 1 + tolerance ||
      overlapEnd < overlapStart - tolerance
    ) {
      return
    }

    const start = Vector2.add(p, Vector2.multiplyScalar(r, clamp(overlapStart, 0, 1)))
    const end = Vector2.add(p, Vector2.multiplyScalar(r, clamp(overlapEnd, 0, 1)))

    if (Vector2.distanceToSquared(start, end) <= tolerance * tolerance) {
      intersections.push(new Intersection2D([start.clone()], [normal.clone()]))
    } else {
      intersections.push(new Intersection2D(
        [new Segment2D(start.clone(), end.clone())],
        [normal.clone()]
      ))
    }

    return
  }

  if (Math.abs(rxs) <= tolerance) {
    return
  }

  const t = Vector2.cross(qmp, s) / rxs
  const u = Vector2.cross(qmp, r) / rxs

  if (!isWithinUnitInterval(t, tolerance) || !isWithinUnitInterval(u, tolerance)) {
    return
  }

  const point = Vector2.add(p, Vector2.multiplyScalar(r, t))
  intersections.push(new Intersection2D([point.clone()], [normal.clone()]))
}

function intersectSegmentArc(
  intersections: Intersection2D[],
  segment: Segment2D,
  arc: ArcBound2D,
  tolerance: number
): void {
  const direction = Vector2.subtract(segment.end, segment.start)
  const offset = Vector2.subtract(segment.start, arc.center)
  const a = Vector2.dot(direction, direction)
  const b = 2 * Vector2.dot(offset, direction)
  const c = Vector2.dot(offset, offset) - arc.radius * arc.radius
  const discriminant = b * b - 4 * a * c
  const normal = segmentNormal(segment)

  if (a <= tolerance) {
    return
  }

  const sqrtDisc = Math.sqrt(Math.max(0, discriminant))
  const ts = discriminant > 0
    ? [
        (-b - sqrtDisc) / (2 * a),
        (-b + sqrtDisc) / (2 * a)
      ]
    : [
        -b / (2 * a)
      ]

  for (const t of ts) {
    if (!isWithinUnitInterval(t, tolerance)) {
      continue
    }

    const point = Vector2.add(segment.start, Vector2.multiplyScalar(direction, t))

    if (isPointOnArc(point, arc, tolerance)) {
      intersections.push(new Intersection2D([point.clone()], [normal.clone()]))
    }
  }
}

function intersectArcSegment(
  intersections: Intersection2D[],
  arc: ArcBound2D,
  segment: Segment2D,
  tolerance: number
): void {
  const direction = Vector2.subtract(segment.end, segment.start)
  const offset = Vector2.subtract(segment.start, arc.center)
  const a = Vector2.dot(direction, direction)
  const b = 2 * Vector2.dot(offset, direction)
  const c = Vector2.dot(offset, offset) - arc.radius * arc.radius
  const discriminant = b * b - 4 * a * c

  if (a <= tolerance) {
    return
  }

  const sqrtDisc = Math.sqrt(Math.max(0, discriminant))
  const ts = discriminant > 0
    ? [
        (-b - sqrtDisc) / (2 * a),
        (-b + sqrtDisc) / (2 * a)
      ]
    : [
        -b / (2 * a)
      ]

  for (const t of ts) {
    if (!isWithinUnitInterval(t, tolerance)) {
      continue
    }

    const point = Vector2.add(segment.start, Vector2.multiplyScalar(direction, t))

    if (isPointOnArc(point, arc, tolerance)) {
      intersections.push(
        new Intersection2D([point.clone()], [arcNormal(arc, point).clone()])
      )
    }
  }
}

function intersectArcArc(
  intersections: Intersection2D[],
  arcA: ArcBound2D,
  arcB: ArcBound2D,
  tolerance: number
): void {
  const centerDelta = Vector2.subtract(arcB.center, arcA.center)
  const distance = centerDelta.magnitude()

  if (distance <= tolerance && Math.abs(arcA.radius - arcB.radius) <= tolerance) {
    const overlaps = intersectArcIntervals(arcA, arcB, tolerance)

    for (const overlap of overlaps) {
      const span = overlapSpan(overlap)

      if (span <= tolerance) {
        const point = pointOnCircle(arcA.center, arcA.radius, overlap.start)
        intersections.push(
          new Intersection2D([point.clone()], [arcNormal(arcA, point).clone()])
        )
        continue
      }

      const points = sampleArcPoints(
        arcA.center,
        arcA.radius,
        overlap.start,
        overlap.end,
        tolerance
      )

      intersections.push(
        new Intersection2D(
          points.map((point) => point.clone()),
          points.map((point) => arcNormal(arcA, point))
        )
      )
    }

    return
  }

  if (distance > arcA.radius + arcB.radius + tolerance) {
    return
  }

  if (distance < Math.abs(arcA.radius - arcB.radius) - tolerance) {
    return
  }

  if (distance <= tolerance) {
    return
  }

  const a = (
    arcA.radius * arcA.radius -
    arcB.radius * arcB.radius +
    distance * distance
  ) / (2 * distance)
  const hSquared = arcA.radius * arcA.radius - a * a

  const midpoint = Vector2.add(
    arcA.center,
    Vector2.multiplyScalar(centerDelta, a / distance)
  )

  if (hSquared <= 0) {
    if (isPointOnArc(midpoint, arcA, tolerance) && isPointOnArc(midpoint, arcB, tolerance)) {
      intersections.push(
        new Intersection2D([midpoint.clone()], [arcNormal(arcA, midpoint).clone()])
      )
    }

    return
  }

  const h = Math.sqrt(hSquared)
  const offset = new Vector2(-centerDelta.y / distance, centerDelta.x / distance).multiplyScalar(h)
  const candidates = [
    Vector2.add(midpoint, offset),
    Vector2.subtract(midpoint, offset)
  ]

  for (const point of candidates) {
    if (isPointOnArc(point, arcA, tolerance) && isPointOnArc(point, arcB, tolerance)) {
      intersections.push(
        new Intersection2D([point.clone()], [arcNormal(arcA, point).clone()])
      )
    }
  }
}

function intersectArcIntervals(
  arcA: ArcBound2D,
  arcB: ArcBound2D,
  tolerance: number
): AngleInterval[] {
  const intervalsA = getArcIntervals(arcA, tolerance)
  const intervalsB = getArcIntervals(arcB, tolerance)
  const overlaps: AngleInterval[] = []

  for (const intervalA of intervalsA) {
    for (const intervalB of intervalsB) {
      const start = Math.max(intervalA.start, intervalB.start)
      const end = Math.min(intervalA.end, intervalB.end)

      if (end < start - tolerance) {
        continue
      }

      overlaps.push({
        start,
        end: end < start ? start : end
      })
    }
  }

  return mergeIntervals(overlaps, tolerance)
}

function getArcIntervals(arc: ArcBound2D, tolerance: number): AngleInterval[] {
  const start = wrap(arc.startAngle, 0, TAU)
  const end = wrap(arc.endAngle, 0, TAU)

  if (isFullCircleArc(arc, tolerance)) {
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

function mergeIntervals(intervals: AngleInterval[], tolerance: number): AngleInterval[] {
  if (!intervals.length) {
    return []
  }

  const sorted = [...intervals].sort((a, b) => a.start - b.start)
  const merged: AngleInterval[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    const last = merged[merged.length - 1]

    if (current.start <= last.end + tolerance) {
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
  endAngle: number,
  tolerance: number
): Vector2[] {
  const span = overlapSpan({ start: startAngle, end: endAngle })

  if (span <= tolerance) {
    return [pointOnCircle(center, radius, startAngle)]
  }

  const steps = Math.max(2, Math.ceil(span / Math.PI * SAMPLE_POINTS_PER_PI))
  const points: Vector2[] = []

  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + span * (i / steps)
    points.push(pointOnCircle(center, radius, angle))
  }

  if (Math.abs(span - TAU) <= tolerance) {
    points.push(points[0].clone())
  }

  return points
}

function isPointOnArc(point: Vector2, arc: ArcBound2D, tolerance: number): boolean {
  const distance = Vector2.distanceTo(point, arc.center)

  if (Math.abs(distance - arc.radius) > tolerance) {
    return false
  }

  if (isFullCircleArc(arc, tolerance)) {
    return true
  }

  const angle = Math.atan2(point.y - arc.center.y, point.x - arc.center.x)
  return isAngleOnArc(angle, arc.startAngle, arc.endAngle, tolerance)
}

function isAngleOnArc(
  angle: number,
  startAngle: number,
  endAngle: number,
  tolerance: number
): boolean {
  return (
    wrap(angle - startAngle, 0, TAU) <=
    wrap(endAngle - startAngle, 0, TAU) + tolerance
  )
}

function pointOnCircle(center: Vector2, radius: number, angle: number): Vector2 {
  return new Vector2(
    center.x + Math.cos(angle) * radius,
    center.y + Math.sin(angle) * radius
  )
}

function arcNormal(arc: ArcBound2D, point: Vector2): Vector2 {
  return Vector2.subtract(point, arc.center).normalize()
}

function segmentNormal(segment: Segment2D): Vector2 {
  return new Vector2(
    segment.end.y - segment.start.y,
    segment.start.x - segment.end.x
  ).normalize()
}

function isFullCircleArc(arc: ArcBound2D, tolerance: number): boolean {
  const span = Math.abs(arc.endAngle - arc.startAngle)
  return Math.abs(span - TAU) <= tolerance
}

function overlapSpan(interval: AngleInterval): number {
  return Math.max(0, interval.end - interval.start)
}

function isWithinUnitInterval(value: number, tolerance: number): boolean {
  return value >= -tolerance && value <= 1 + tolerance
}

function dedupeIntersections(
  intersections: Intersection2D[],
  tolerance: number
): Intersection2D[] {
  const deduped: Intersection2D[] = []

  for (const intersection of intersections) {
    if (!intersection.points.length) {
      continue
    }

    if (intersection.points.length === 1) {
      const feature = intersection.points[0]

      if (feature instanceof Segment2D) {
        if (deduped.some((existing) => containsSegment(existing, feature, tolerance))) {
          continue
        }
      } else if (deduped.some((existing) => containsPoint(existing, feature, tolerance))) {
        continue
      }
    } else if (isVectorPointList(intersection.points)) {
      const currentPoints = intersection.points

      if (deduped.some((existing) =>
        isVectorPointList(existing.points) &&
        samePolyline(existing.points, currentPoints, tolerance)
      )) {
        continue
      }
    }

    deduped.push(intersection)
  }

  return deduped
}

function flattenIntersections(intersections: Intersection2D[]): Intersection2D {
  const points: (Vector2 | Segment2D)[] = []
  const normals: Vector2[] = []

  for (const intersection of intersections) {
    points.push(...intersection.points.map((point) => point.clone()))
    normals.push(...intersection.normals.map((normal) => normal.clone()))
  }

  return new Intersection2D(points, normals)
}

function containsPoint(
  intersection: Intersection2D,
  point: Vector2,
  tolerance: number
): boolean {
  if (!isVectorPointList(intersection.points)) {
    return false
  }

  return intersection.points.some(
    (existing) => Vector2.distanceToSquared(existing, point) <= tolerance * tolerance
  )
}

function containsSegment(
  intersection: Intersection2D,
  segment: Segment2D,
  tolerance: number
): boolean {
  if (intersection.points.length !== 1) {
    return false
  }

  const existing = intersection.points[0]

  if (!(existing instanceof Segment2D)) {
    return false
  }

  return sameSegment(existing, segment, tolerance)
}

function isVectorPointList(points: (Vector2 | Segment2D)[]): points is Vector2[] {
  return points.every((point) => point instanceof Vector2)
}

function sameSegment(a: Segment2D, b: Segment2D, tolerance: number): boolean {
  const toleranceSq = tolerance * tolerance

  return (
    (
      Vector2.distanceToSquared(a.start, b.start) <= toleranceSq &&
      Vector2.distanceToSquared(a.end, b.end) <= toleranceSq
    ) || (
      Vector2.distanceToSquared(a.start, b.end) <= toleranceSq &&
      Vector2.distanceToSquared(a.end, b.start) <= toleranceSq
    )
  )
}

function samePolyline(
  pointsA: Vector2[],
  pointsB: Vector2[],
  tolerance: number
): boolean {
  if (pointsA.length !== pointsB.length) {
    return false
  }

  let forward = true
  let reverse = true

  for (let i = 0; i < pointsA.length; i++) {
    if (Vector2.distanceToSquared(pointsA[i], pointsB[i]) > tolerance * tolerance) {
      forward = false
    }

    if (Vector2.distanceToSquared(pointsA[i], pointsB[pointsB.length - 1 - i]) > tolerance * tolerance) {
      reverse = false
    }
  }

  return forward || reverse
}
