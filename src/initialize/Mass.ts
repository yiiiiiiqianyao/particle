import { Initialize } from './Initialize';
import { createSpan, Span } from '../math/Span';
/**
 * Mass is init particle's Mass
 * @param {Number} a - the Mass's start point
 * @param {Number} b - the Mass's end point
 * @param {String} c - span's center
 * @example
 * var Mass = new Proton.Mass(3,5);
 * or
 * var Mass = new Proton.Mass(Infinity);
 * @extends {Initialize}
 * @constructor
 */
export class Mass extends Initialize {
  massPan: Span;
  constructor(a: number, b?: number, c?: string) {
    super();
    this.massPan = createSpan(a, b, c);
  }
  initialize(target: any) {
    target.mass = this.massPan.getValue();
  };
}

