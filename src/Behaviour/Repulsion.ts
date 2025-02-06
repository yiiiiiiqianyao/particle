
// @ts-nocheck
import { Attraction } from "./Attraction";

// 排斥力
export class Repulsion extends Attraction {
  constructor(targetPosition, force, radius, life, easing) {
    super(targetPosition, force, radius, life, easing);
    this.force *= -1;
    this.name = "Repulsion";
  }
  reset(targetPosition, force, radius, life, easing) {
    super.reset.call(
      this,
      targetPosition,
      force,
      radius,
      life,
      easing
    );
    this.force *= -1;
  }

}
