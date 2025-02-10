// @ts-nocheck
import { Behaviour } from './Behaviour';
import { Util } from '../utils/Util';
import { Vector3D } from '../math/Vector3D';
import { EaseFunc } from 'particle/ease/ease';

// 吸引力
export class Attraction extends Behaviour {
  name: string;
  targetPosition: Vector3D;
  radius: number;
  radiusSq: number;
  force: number;
  attractionForce: Vector3D;
  lengthSq: number;
  constructor(targetPosition?: Vector3D, force, radius, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.targetPosition = Util.initValue(targetPosition, new Vector3D());
    this.radius = Util.initValue(radius, 1000);
    this.force = Util.initValue(this.normalizeValue(force), 100);
    this.radiusSq = this.radius * this.radius;
    this.attractionForce = new Vector3D();
    this.lengthSq = 0;
    this.name = "Attraction";
  }
  reset(targetPosition: Vector3D, force, radius, life, easing) {
    this.targetPosition = Util.initValue(targetPosition, new Vector3D());
    this.radius = Util.initValue(radius, 1000);
    this.force = Util.initValue(this.normalizeValue(force), 100);
    this.radiusSq = this.radius * this.radius;
    this.attractionForce = new Vector3D();
    this.lengthSq = 0;
    if (life) super.reset.call(this, life, easing);
  }
  applyBehaviour(particle, time, index) {
    super.applyBehaviour.call(this, particle, time, index);
    this.attractionForce.copy(this.targetPosition);
    this.attractionForce.sub(particle.p);
    this.lengthSq = this.attractionForce.lengthSq();
    if (this.lengthSq > 0.000004 && this.lengthSq < this.radiusSq) {
      this.attractionForce.normalize();
      this.attractionForce.scalar(1 - this.lengthSq / this.radiusSq);
      this.attractionForce.scalar(this.force);
      particle.a.add(this.attractionForce);
    }
  }
}
