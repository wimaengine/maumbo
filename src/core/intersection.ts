import { Vector2 } from 'hisabati'

export class Intersection2D {
  readonly point = new Vector2()
  readonly normal = new Vector2()
  readonly distance:number

  constructor(point: Vector2, normal: Vector2, distance: number) {
    this.point = point
    this.normal = normal
    this.distance = distance
  }
}
