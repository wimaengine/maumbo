import { Affine2, Vector2 } from "hisabati"
import type { Rotary } from "hisabati"

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

  constructor(parameters: Partial<ArcBound2DOptions> = {}) {
    this.center = parameters.center ?? new Vector2()
    this.radius = parameters.radius ?? 0
    this.startAngle = parameters.startAngle ?? 0
    this.endAngle = parameters.endAngle ?? 0
  }

  translate(translation: Vector2) {
    return ArcBound2D.translate(this, translation, this)
  }

  rotate(center: Vector2, rotary: Rotary) {
    return ArcBound2D.rotate(this, center, rotary, this)
  }

  transform(affine: Affine2) {
    return ArcBound2D.transform(this, affine, this)
  }

  static copy(bound: ArcBound2D, out = new ArcBound2D()) {
    out.center.x = bound.center.x
    out.center.y = bound.center.y
    out.radius = bound.radius
    out.startAngle = bound.startAngle
    out.endAngle = bound.endAngle

    return out
  }

  static translate(bound: ArcBound2D, translation: Vector2, out = new ArcBound2D()) {
    out.center.x = bound.center.x + translation.x
    out.center.y = bound.center.y + translation.y
    out.radius = bound.radius
    out.startAngle = bound.startAngle
    out.endAngle = bound.endAngle

    return out
  }

  static rotate(bound: ArcBound2D, center: Vector2, rotary: Rotary, out = new ArcBound2D()) {
    const angle = Vector2.toAngle(Vector2.set(rotary.cos, rotary.sin, new Vector2()))
    const relative = Vector2.subtract(bound.center, center, new Vector2())

    Vector2.rotateFast(relative, rotary.cos, rotary.sin, relative)
    Vector2.add(relative, center, out.center)
    out.radius = bound.radius
    out.startAngle = bound.startAngle + angle
    out.endAngle = bound.endAngle + angle

    return out
  }

  static transform(bound: ArcBound2D, affine: Affine2, out = new ArcBound2D()) {
    const centerX = bound.center.x
    const centerY = bound.center.y
    const radius = bound.radius
    const startAngle = bound.startAngle
    const endAngle = bound.endAngle
    const start = new Vector2(
      centerX + Math.cos(startAngle) * radius,
      centerY + Math.sin(startAngle) * radius
    )
    const end = new Vector2(
      centerX + Math.cos(endAngle) * radius,
      centerY + Math.sin(endAngle) * radius
    )

    Affine2.transform(affine, new Vector2(centerX, centerY), out.center)
    Affine2.transform(affine, start, start)
    Affine2.transform(affine, end, end)

    out.radius = radius
    const startRelative = Vector2.subtract(start, out.center, new Vector2())
    const endRelative = Vector2.subtract(end, out.center, new Vector2())
    out.startAngle = startRelative.x === 0 && startRelative.y === 0 ? startAngle : Vector2.toAngle(startRelative)
    out.endAngle = endRelative.x === 0 && endRelative.y === 0 ? endAngle : Vector2.toAngle(endRelative)

    return out
  }
}
