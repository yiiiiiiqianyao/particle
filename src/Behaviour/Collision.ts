
import { Behaviour } from './Behaviour';
import { Vector3D } from '../math/Vector3D';
import { EaseFunc } from '../ease/ease';
import { Emitter } from '../emitter/Emitter';
import { Particle } from 'yiqianyao_particle/core';

/**
 * The Scale class is the base for the other Behaviour
 *
 * @class Behaviour
 * @constructor
 */
//can use Collision(emitter,true,function(){}) or Collision();
export class Collision extends Behaviour {
  useMass!: boolean | undefined;
  delta!: Vector3D;
  particles!: Particle[];
  callback!: ((p1?: any, p2?: any) => void) | undefined;
  emitter!: Emitter;
  constructor(emitter: Emitter, useMass?: boolean, callback?: any, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.reset(emitter, useMass, callback);
    this.name = "Collision";
  }

  // @ts-ignore
  reset(emitter: Emitter, useMass?: boolean, callback?: () => void, life?: number, easing?: EaseFunc) {
    this.emitter = emitter;
    this.useMass = useMass;
    this.callback = callback;
    this.particles = [];
    this.delta = new Vector3D();
    life && super.reset.call(this, life, easing);
  };
  applyBehaviour(particle: Particle, time?: number, index?: number) {
    var particles = this.emitter
      ? this.emitter.particles.slice(index)
      : this.particles.slice(index);
    var otherParticle, lengthSq, overlap, distance;
    var averageMass1, averageMass2;

    var i = particles.length;
    while (i--) {
      otherParticle = particles[i];
      if (otherParticle === particle) continue;

      this.delta.copy(otherParticle.p).sub(particle.p);
      lengthSq = this.delta.lengthSq();
      distance = particle.radius + otherParticle.radius;

      if (lengthSq <= distance * distance) {
        overlap = distance - Math.sqrt(lengthSq);
        overlap += 0.5;

        averageMass1 = this._getAverageMass(particle, otherParticle);
        averageMass2 = this._getAverageMass(otherParticle, particle);

        particle.p.add(
          this.delta
            .clone()
            .normalize()
            .scalar(overlap * -averageMass1)
        );
        otherParticle.p.add(
          this.delta.normalize().scalar(overlap * averageMass2)
        );

        this.callback && this.callback(particle, otherParticle);
      }
    }
  };
  _getAverageMass (aParticle: Particle, bParticle: Particle) {
    return this.useMass
      ? bParticle.mass / (aParticle.mass + bParticle.mass)
      : 0.5;
  };
}
