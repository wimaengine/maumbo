import { Vector2 } from 'hisabati'

export const IntersectionType2D = {
  Point: 0,
  Segment: 1
} as const
export class Intersection2D {
  points:Vector2[] = []
  normal = new Vector2()
  tangent = new Vector2()

  constructor(
    points: Vector2[],
    normal: Vector2,
    tangent: Vector2
  ) {
    this.points = points
    this.normal = normal
    this.tangent = tangent
  }

  clone(): Intersection2D {
    return new Intersection2D(
      this.points.map(p=>p.clone()),
      this.normal.clone(),
      this.tangent.clone()
    )
  }
}
