// @ts-nocheck
import { Behaviour } from './Behaviour';
import { Vector3D } from '../math/Vector3D'
import { Particle } from 'particle/core';
/**
 * The Behaviour class is the base for the other Behaviour
 *
 * @class Behaviour
 * @constructor
 */
export class Force extends Behaviour {
  constructor(fx, fy, fz, life?: any, easing?: any) {
    super(life, easing);
    this.reset(fx, fy, fz);
    this.name = "Force";
  }
  // 使用箭头函数 绑定 this
  reset = (fx, fy, fz) => {
    this.force = this.normalizeForce(new Vector3D(fx, fy, fz));
    this.force.id = Math.random();
  };
  applyBehaviour(particle: Particle, time, index) {
    super.applyBehaviour.call(this, particle, time, index);
    particle.a.add(this.force);
  }
}
