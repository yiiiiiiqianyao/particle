import { Util } from "../utils/Util";
import { ease, EaseFunc } from "../ease/ease";
import { MEASURE } from "../core/constant";
import { Vector3D } from "../math/Vector3D";
import { Particle } from "../core/Particle";
/**
 * The Behaviour class is the base for the other Behaviour
 *
 * @class Behaviour
 * @constructor
 */
export class Behaviour {
  static id: number;
  name: string;
  id: string;
  life: number;
  dead: boolean;
  age: number;
  energy: number;
  easing: EaseFunc;
  constructor(life?: number, easing?: EaseFunc) {
    /**
     * The behaviour's id;
     * @property id
     * @type {String} id
     */
    this.id = "Behaviour_" + Behaviour.id++;
    this.life = Util.initValue(life, Infinity) as number;

    /**
     * The behaviour's decaying trend, for example ease.easeOutQuart;
     * @property easing
     * @type {String}
     * @default easeLinear
     */
    this.easing = Util.initValue(easing, ease.easeLinear) as EaseFunc;
    this.age = 0;
    this.energy = 1;
    /**
     * The behaviour is Dead;
     * @property dead
     * @type {Boolean}
     */
    this.dead = false;

    /**
     * The behaviour name;
     * @property name
     * @type {string}
     */

    this.name = "Behaviour";
  }
  /**
   * Reset this behaviour's parameters
   *
   * @method reset
   * @param {Number} this behaviour's life
   * @param {String} this behaviour's easing
   */
  reset(life?: number, easing?: EaseFunc | any) {
    this.life = Util.initValue(life, Infinity) as number;
    this.easing = Util.initValue(easing, ease.easeLinear) as EaseFunc;
  }
  /**
   * Normalize a force by 1:100;
   *
   * @method normalizeForce
   * @param {Vector2D} force
   */
  normalizeForce(force: Vector3D) {
    return force.scalar(MEASURE);
  }

  /**
   * Normalize a value by 1:100;
   *
   * @method normalizeValue
   * @param {Number} value
   */
  normalizeValue(value: number) {
    return value * MEASURE;
  }

  /**
   * Initialize the behaviour's parameters for all particles
   *
   * @method initialize
   * @param {Particle} particle
   */
  initialize(particle: Particle) {}

  /**
   * Apply this behaviour for all particles every time
   *
   * @method applyBehaviour
   * @param {Particle} particle
   * @param {Number} the integrate time 1/ms
   * @param {Int} the particle index
   */
  applyBehaviour(particle: Particle, time: number, index: number) {
    if (this.dead) return;

    this.age += time;
    if (this.age >= this.life) {
      this.energy = 0;
      this.dead = true;
      return;
    }

    const scale = this.easing(particle.age / particle.life);
    this.energy = Math.max(1 - scale, 0);
  }

  /**
   * Destory this behaviour
   * @method destroy
   */
  destroy() {}
}

Behaviour.id = 0;
