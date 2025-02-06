// @ts-nocheck
import { Behaviour } from './Behaviour';
import { createSpan } from '../math/Span';
import { MathUtils } from '../math/MathUtils';
import { Util } from '../utils/Util';
import { EaseFunc } from '../ease/ease';

/**
 * The Alpha class is the base for the other Behaviour
 *
 * @class Behaviour
 * @constructor
 */

export class Alpha extends Behaviour {
  constructor(a, b, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.reset(a, b);
    /**
     * The Behaviour name;
     * @property name
     * @type {string}
     */
    this.name = "Alpha";
  }
  reset(a, b, life, easing) {
    if (b === null || b === undefined) this._same = true;
    else this._same = false;

    this.a = createSpan(Util.initValue(a, 1));
    this.b = createSpan(b);
    life && super.reset.call(this, life, easing);
  }
  initialize(particle) {
    particle.useAlpha = true;
    particle.transform.alphaA = this.a.getValue();
    if (this._same) particle.transform.alphaB = particle.transform.alphaA;
    else particle.transform.alphaB = this.b.getValue();
  }
  applyBehaviour(particle, time, index) {
    super.applyBehaviour.call(this, particle, time, index);

    particle.alpha = MathUtils.lerp(
      particle.transform.alphaA,
      particle.transform.alphaB,
      this.energy
    );
    if (particle.alpha < 0.002) particle.alpha = 0;
  }
}