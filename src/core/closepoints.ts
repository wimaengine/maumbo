import { Affine2, Vector2 } from 'hisabati'

export class ClosestPoint2D {
  pointA = new Vector2()
  pointB = new Vector2()
  distance = 0

  constructor(pointA: Vector2, pointB: Vector2, distance: number) {
    this.pointA = pointA
    this.pointB = pointB
    this.distance = distance
  }
  
  clone(): ClosestPoint2D {
    return new ClosestPoint2D(this.pointA, this.pointB, this.distance)
  }
  
  transform(transformA: Affine2, transformB: Affine2): this {
    this.pointA = Affine2.transform(transformA, this.pointA)
    this.pointB = Affine2.transform(transformB, this.pointB)

    return this
  }

  flip(): this {
    const { pointA } = this

    this.pointA = this.pointB
    this.pointB = pointA

    return this
  }
}
