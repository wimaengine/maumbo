import { Vector2 } from "hisabati";

export class SATProjection {
    min = Infinity;
    max = -Infinity;
    minIndex = 0;
    maxIndex = 0;

    constructor(min = Infinity, max = -Infinity) {
        this.min = min;
        this.max = max;
    }
}

export class SATStructure {
  axis = new Vector2(0, 0)
  overlap = Infinity

  constructor(axis = new Vector2(0, 0), overlap = Infinity) {
    this.axis = axis
    this.overlap = overlap
  }
}