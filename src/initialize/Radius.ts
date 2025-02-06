import { Initialize } from './Initialize';
import { createSpan, Span } from '../math/Span';
import { Particle } from '../core/Particle';
/**
 * Radius is init particle's Radius
 * @param {Number} a - the Radius's start point
 * @param {Number} b - the Radius's end point
 * @param {String} c - span's center
 * @example
 * var Radius = new Proton.Radius(3,5);
 * or
 * var Radius = new Proton.Radius(3,1,"center");
 * @extends {Initialize}
 * @constructor
 */
export class Radius extends Initialize {
  radius: Span;
  constructor(a: any, b?: number, c?: number){
    super();
    this.radius = createSpan(a, b, c);
  }
  reset(a?: any, b?: any, c?: any) {
    this.radius = createSpan(a, b, c);
  };
  initialize(particle: Particle) {
    particle.radius = this.radius.getValue();
    particle.transform.oldRadius = particle.radius;
  };
}
