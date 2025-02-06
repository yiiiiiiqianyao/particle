// @ts-nocheck
import { Behaviour } from './Behaviour';
import { Util } from '../utils/Util';
import { createSpan } from '../math/Span';
import { MathUtils } from '../math/MathUtils';
import { EaseFunc } from '../ease/ease';
/**
 * The Scale class is the base for the other Behaviour
 *
 * @class Behaviour
 * @constructor
 */

export class Scale extends Behaviour {
  constructor(a, b?: any, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.reset(a, b);
    this.name = "Scale";
  }
  initialize(particle) {
    particle.transform.scaleA = this.a.getValue();
    particle.transform.oldRadius = particle.radius;
    if (this._same) particle.transform.scaleB = particle.transform.scaleA;
    else particle.transform.scaleB = this.b.getValue();
  }
  reset(a, b, life, easing) {
    if (b === null || b === undefined) this._same = true;
    else this._same = false;

    this.a = createSpan(Util.initValue(a, 1));
    this.b = createSpan(b);

    life && super.reset.call(this, life, easing);
  }
  applyBehaviour(particle, time, index) {
    super.applyBehaviour.call(this, particle, time, index);
    particle.scale = MathUtils.lerp(
      particle.transform.scaleA,
      particle.transform.scaleB,
      this.energy
    );

    if (particle.scale < 0.0005) particle.scale = 0;
    particle.radius = particle.transform.oldRadius * particle.scale;
  }
}