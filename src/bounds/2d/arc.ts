import type { Vector2 } from "hisabati"

export interface ArcBound2DOptions {
  center: Vector2
  radius: number
  startAngle: number
  endAngle: number
}

export class ArcBound2D {
  center: Vector2
  radius: number
  startAngle: number
  endAngle: number

  constructor(parameters: ArcBound2DOptions) {
    this.center = parameters.center
    this.radius = parameters.radius
    this.startAngle = parameters.startAngle
    this.endAngle = parameters.endAngle
  }
}