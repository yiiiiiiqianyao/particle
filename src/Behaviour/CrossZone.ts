import { Behaviour } from "./Behaviour";
import { Util } from "../utils/Util";
import { Zone, ZoneCross } from "../zone/Zone";
import { EaseFunc } from "../ease/ease";
import { Particle } from "../core/Particle";

/**
 * 用于处理 Particle 穿越一定区域时候的行为
 */
export class CrossZone extends Behaviour {
  zone!: Zone;
  constructor(a: Zone | ZoneCross, b: Zone | ZoneCross, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.crossReset(a, b);
    ///dead /bound /cross
    this.name = "CrossZone";
  }
  crossReset(a: Zone | ZoneCross, b: Zone | ZoneCross, life?: number, easing?: EaseFunc) {
    let zone: Zone, crossType;
    if (typeof a === "string") {
      crossType = a;
      zone = b as Zone;
    } else {
      crossType = b;
      zone = a as Zone;
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
