import { Affine2, Vector2 } from 'hisabati'
import type { Segment2D } from '../bounds'

export const IntersectionType2D = {
  Point: 0,
  Segment: 1
} as const
export class Intersection2D {
  points: (Vector2 | Segment2D)[] = []
  normals: Vector2[] = []

  constructor(
    points: (Vector2 | Segment2D)[],
    normal: Vector2[]
  ) {
    this.points = points
    this.normals = normal
  }

  clone(): Intersection2D {
    return new Intersection2D(
      this.points.map(p => p.clone()),
      this.normals.map(p => p.clone())
    )
  }

  transform(transform: Affine2) {
    this.points.forEach(e => {
      if (e instanceof Vector2) {
        Affine2.transform(transform, e, e)
      } else {
        Affine2.transform(transform, e.start, e.start)
        Affine2.transform(transform, e.end, e.end)
      }
    })
    this.normals.forEach(e => { Affine2.transform(transform, e, e) })
  }
}
