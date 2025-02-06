// @ts-nocheck
import { Behaviour } from './Behaviour';
import { Vector3D } from '../math/Vector3D';
import { EaseFunc } from '../ease/ease';

/**
 * The Behaviour class is the base for the other Behaviour
 *
 * @class Behaviour
 * @constructor
 */
export class Spring extends Behaviour {
    constructor(x, y, z, spring?: number, friction?: number, life?: number, easing?: EaseFunc) {
      super(life, easing);
      this.reset(x, y, z, spring, friction);
      this.name = "Spring";
    }
    reset(x, y, z, spring?: number, friction?: number) {
      if (!this.pos) this.pos = new Vector3D(x, y, z);
      else this.pos.set(x, y, z);
      this.spring = spring || 0.1;
      this.friction = friction || 0.98;
    }
    applyBehaviour(particle, time, index) {
      super.applyBehaviour.call(this, particle, time, index);
  
      particle.v.x += (this.pos.x - particle.p.x) * this.spring;
      particle.v.y += (this.pos.y - particle.p.y) * this.spring;
      particle.v.z += (this.pos.z - particle.p.z) * this.spring;
    }
  }