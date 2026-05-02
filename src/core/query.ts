import type { Vector2 } from "hisabati";

export interface PointQuery2D {
    queryPointLocal(point: Vector2, tolerance:number):boolean
    queryPoint(point: Vector2, tolerance:number):true
    queryPointDistance(point: Vector2, tolerance:number):number
}