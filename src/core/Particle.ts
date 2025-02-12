import { Util } from '../utils/Util';
import { Vector3D } from '../math/Vector3D';
import { ease, EaseFunc } from '../ease/ease';
import { PI } from './constant';
import { EventDispatcher } from '../events/EventDispatcher'
import { Behaviour } from 'yiqianyao_particle/Behaviour';
import { Emitter } from 'yiqianyao_particle/emitter';
import { IParticle } from './interface';
import { Object3D } from 'three';
/**
 * the Particle class
 * @param {Number} pObj - the parameters of particle config;
 * @example
 * const p = new Particle({life:3,dead:false});
 * or
 * const p = new Particle({mass:1,radius:100});
 * @constructor
 */
export class Particle extends EventDispatcher {
  static ID = 0;
  id: string;
  name: string;
  life!: number;
  age!: number;
  energy!: number;
  dead!: boolean; // 粒子是否死亡
  sleep!: boolean;
  mass!: number;
  p = new Vector3D(); // 位置
  v = new Vector3D(); // 速度 velocity
  a = new Vector3D(); // 加速度 acceleration

  target: Object3D | null = null;
  alpha!: number;
  radius!: number; // 粒子的半径
  scale!: number;

  useColor!: boolean;
  useAlpha!: boolean;
  easing!: EaseFunc;
  old: Record<string, Vector3D>;
  behaviours!: Behaviour[];
  rotation = new Vector3D();
  color!: any;
  transform: Record<string, any> = {};
  body: any | null = null;
  parent: Emitter | null = null; // 父级是粒子发射器 setupParticle 的时候设置
  constructor(pOBJ?: IParticle) {
    super();
    /**
     * @property {Number}  cID               - The particle's cID
     */
    /**
     * @property {Number}  id               - The particle's id
     */
    this.id = "particle_" + Particle.ID++;
    this.name = "Particle";
    this.reset("init");
    this.life = pOBJ?.life || Infinity;
    this.age = pOBJ?.age || 0;
    this.energy = pOBJ?.energy || 1;
    this.dead = pOBJ?.dead || false;
    this.sleep = pOBJ?.sleep || false;
    this.mass = pOBJ?.mass || 1;
    this.radius = pOBJ?.radius || 10;
    this.alpha = pOBJ?.alpha || 1;
    this.scale = pOBJ?.scale || 1;
    this.useColor = pOBJ?.useColor || false;
    this.useAlpha = pOBJ?.useAlpha || false;
    this.easing = pOBJ?.easing || ease.easeLinear;
    this.old = {};
    this.old.p = this.p.clone();
    this.old.v = this.v.clone();
    this.old.a = this.a.clone();

    this.behaviours = pOBJ?.behaviours || [];
    this.rotation = pOBJ?.rotation || this.rotation;

    this.color = pOBJ?.color || { r: 0, g: 0, b: 0 };

    // Util.setPrototypeByObj(this, pOBJ);
  }
  getDirection() {
    return Math.atan2(this.v.x, -this.v.y) * (180 / PI);
  }
  /**
  * @property {Number}  life               - The particle's life
  * @property {Number}  age               - The particle's age
  * @property {Number}  energy               - The particle's energy loss
  * @property {Boolean}  dead               - The particle is dead?
  * @property {Boolean}  sleep               - The particle is sleep?
  * @property {Object}  target               - The particle's target
  * @property {Object}  body               - The particle's body
  * @property {Number}  mass               - The particle's mass
  * @property {Number}  radius               - The particle's radius
  * @property {Number}  alpha               - The particle's alpha
  * @property {Number}  scale               - The particle's scale
  * @property {Number}  rotation               - The particle's rotation
  * @property {String|Number}  color               - The particle's color
  * @property {Function}  easing               - The particle's easing
  * @property {Vector3D}  p               - The particle's position
  * @property {Vector3D}  v               - The particle's velocity
  * @property {Vector3D}  a               - The particle's acceleration
  * @property {Array}  behaviours               - The particle's behaviours array
  * @property {Object}  transform               - The particle's transform collection
  */
  reset(init?: string) {
    this.life = Infinity;
    this.age = 0;
    //energy loss
    this.energy = 1;
    this.dead = false;
    this.sleep = false;
    this.body = null;
    this.parent = null;
    this.mass = 1;
    this.radius = 10;
    this.alpha = 1;
    this.scale = 1;
    this.useColor = false;
    this.useAlpha = false;

    this.easing = ease.easeLinear;

    if (init) {
      this.p = new Vector3D();
      this.v = new Vector3D();
      this.a = new Vector3D();
      this.old = {};
      this.old.p = this.p.clone();
      this.old.v = this.v.clone();
      this.old.a = this.a.clone();
      this.behaviours = [];
      this.transform = {};
      this.color = { r: 0, g: 0, b: 0 };
      this.rotation = new Vector3D();
    } else {
      this.p.set(0, 0, 0);
      this.v.set(0, 0, 0);
      this.a.set(0, 0, 0);
      this.old.p.set(0, 0, 0);
      this.old.v.set(0, 0, 0);
      this.old.a.set(0, 0, 0);

      this.color.r = 0;
      this.color.g = 0;
      this.color.b = 0;

      this.rotation.clear();

      Util.destroyObject(this.transform);
      this.removeAllBehaviours();
    }
    return this;
  }
  update(time: number, index: number) {
    if (!this.sleep) {
      this.age += time;
      let i = this.behaviours.length;
      while (i--) {
        this.behaviours[i] &&
          this.behaviours[i].applyBehaviour(this, time, index);
      }
    } else {
      //sleep
    }

    if (this.age >= this.life) {
      this.destroy();
    } else {
      const scale = this.easing(this.age / this.life);
      this.energy = Math.max(1 - scale, 0);
    }
  }
  /**
   * 粒子添加行为
   * @param behaviour
   */
  addBehaviour(behaviour: Behaviour) {
    this.behaviours.push(behaviour);
    behaviour.initialize(this);
  }

  addBehaviours(behaviours: Behaviour[]) {
    let i = behaviours.length;
    while (i--) {
      this.addBehaviour(behaviours[i]);
    }
  }

  removeBehaviour(behaviour: Behaviour) {
    const index = this.behaviours.indexOf(behaviour);
    if (index > -1) {
      this.behaviours.splice(index, 1);
    }
  }

  removeAllBehaviours() {
    this.behaviours.length = 0;
  }

  /**
   * Destory this particle
   * @method destroy
   */
  destroy() {
    this.removeAllBehaviours();
    this.energy = 0;
    this.dead = true;
    this.parent = null;
  }
}
