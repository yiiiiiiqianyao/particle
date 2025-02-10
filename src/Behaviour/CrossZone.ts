import { Behaviour } from "./Behaviour";
import { Util } from "../utils/Util";
import { Zone } from "../zone/Zone";
import { EaseFunc } from "../ease/ease";
import { Particle } from "../core/Particle";

/**
 * 用于处理 Particle 穿越一定区域时候的行为
 */
export class CrossZone extends Behaviour {
  zone!: Zone;
  constructor(a: any, b: any, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.reset(a, b);
    ///dead /bound /cross
    this.name = "CrossZone";
  }
  reset(a: any, b: any, life?: number, easing?: EaseFunc) {
    let zone, crossType;
    if (typeof a === "string") {
      crossType = a;
      zone = b;
    } else {
      crossType = b;
      zone = a;
    }

    this.zone = zone;
    this.zone.crossType = Util.initValue(crossType, "dead");
    if (life) {
      super.reset.call(this, life, easing);
    }
  }
  applyBehaviour(particle: Particle, time: number, index: number) {
    super.applyBehaviour.call(this, particle, time, index);
    this.zone.crossing.call(this.zone, particle);
  }
}
