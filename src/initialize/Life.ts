import { Initialize } from './Initialize';
import { createSpan, Span } from '../math/Span';
import { Particle } from '../core/Particle';
/**
 * Life is init particle's Life
 * @param {Number} a - the Life's start point
 * @param {Number} b - the Life's end point
 * @param {String} c - span's center
 * @example
 * var life = new Life(3,5);
 * or
 * var life = new Life(Infinity);
 * @extends {Initialize}
 * @constructor
 */
export class Life extends Initialize {
  lifePan: Span;
  constructor(a?: any, b?: any, c?: any) {
    super();
    this.lifePan = createSpan(a, b, c);
  }
  initialize(target: Particle) {
    if (this.lifePan.a === Infinity || this.lifePan.a === "infi")
      target.life = Infinity;
    else target.life = this.lifePan.getValue();
  };
}