import { Behaviour } from './Behaviour';
import { createSpan, Span } from '../math/Span';
import { MathUtils } from '../math/MathUtils';
import { Vector3D } from '../math/Vector3D';
import { Particle } from '../core/Particle';
import { EaseFunc } from '../ease/ease';

/**
 * The Behaviour class is the base for the other Behaviour
 *
 * @class Behaviour
 * @constructor
 */
export class RandomDrift extends Behaviour {
  time: number;
  randomFoce!: Vector3D;
  delayPan!: Span;
  constructor(driftX?: number, driftY?: number, driftZ?: number, delay?: number, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.reset(driftX, driftY, driftZ, delay);
    this.time = 0;
    this.name = "RandomDrift";
  }
  reset(driftX?: number, driftY?: number, driftZ?: number, delay?: number, life?: number, easing?: EaseFunc) {
    this.randomFoce = this.normalizeForce(new Vector3D(driftX, driftY, driftZ));
    this.delayPan = createSpan(delay || 0.03);
    this.time = 0;
    life && super.reset.call(this, life, easing);
  }
  applyBehaviour(particle: Particle, time: number, index: number) {
    super.applyBehaviour.call(this, particle, time, index);

    this.time += time;
    if (this.time >= this.delayPan.getValue()) {
      var ax = MathUtils.randomAToB(-this.randomFoce.x, this.randomFoce.x);
      var ay = MathUtils.randomAToB(-this.randomFoce.y, this.randomFoce.y);
      var az = MathUtils.randomAToB(-this.randomFoce.z, this.randomFoce.z);
      particle.a.addValue(ax, ay, az);
      this.time = 0;
    }
  }
}