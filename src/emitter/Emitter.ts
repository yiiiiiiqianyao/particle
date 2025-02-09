// @ts-nocheck
import { Util } from "../utils/Util";
import { Rate } from "../initialize/Rate";
import { Particle } from "../core/Particle";
import { InitializeUtil } from "../initialize/InitializeUtil";
import { bindEmtterEvent } from "../core/constant";
import { Proton } from "../core/index";
import { Vector3D } from '../math/Vector3D';
import { Initialize } from "../initialize/Initialize";
import { Behaviour } from "../Behaviour/Behaviour";

export class Emitter extends Particle {
  static ID = 0;
  p: Vector3D = new Vector3D();
  rotation = new Vector3D();
  initializes: Initialize[] = [];
  particles: Particle[] = [];
  behaviours: Behaviour[] = [];
  currentEmitTime: number | string = 0; // 当前触发次数
  totalEmitTimes: number | string = -1; // 总触发次数
   /**
     * @property {Number} damping -The friction coefficient for all particle emit by This;
     * @default 0.006
     */
  damping: number = 0.006; // 衰减系数
  /**
 * If bindEmitter the particles can bind this emitter's property;
 * @property bindEmitter
 * @type {Boolean}
 * @default true
 */
  bindEmitter = true;
      /**
     * The number of particles per second emit (a [particle]/b [s]);
     * @property rate
     * @type {Rate}
     * @default Rate(1, .1)
     */
      rate = new Rate(1, 0.1);
      id: string;
      cID: number;

  constructor(pObj?: any) {
    super(pObj);

    /**
     * The emitter's id;
     * @property id
     * @type {String} id
     */
    this.id = "emitter_" + Emitter.ID++;
    this.cID = 0;
    this.name = "Emitter";
  }

  /**
   * start emit particle
   * @method emit
   * @param {Number} totalEmitTimes total emit times;
   * @param {String} life the life of this emitter
   */
  emit(totalEmitTimes?: number, life?: number) {
    this.currentEmitTime = 0;
    this.totalEmitTimes = Util.initValue(totalEmitTimes, Infinity);
    if (life === true || life === "life" || life === "destroy") {
      this.life = totalEmitTimes === "once" ? 1 : this.totalEmitTimes;
    } else if (!isNaN(life)) {
      this.life = life;
    }
    this.rate.init();
  }
  /**
   * stop emiting
   * @method stopEmit
   */
  stopEmit() {
    this.totalEmitTimes = -1;
    this.currentEmitTime = 0;
  }
  /**
   * remove current all particles
   * @method removeAllParticles
   */
  removeAllParticles() {
    var i = this.particles.length;
    while (i--) this.particles[i].dead = true;
  }

  /**
   * create single particle;
   *
   * can use emit({x:10},new Gravity(10),{'particleUpdate',fun}) or emit([{x:10},new Initialize],new Gravity(10),{'particleUpdate',fun})
   * @method removeAllParticles
   */
  createParticle(initialize?: Initialize, behaviour?: Behaviour) {
    const particle = this.parent.pool.get(Particle);
    this.setupParticle(particle, initialize, behaviour);
    this.parent && this.parent.dispatchEvent("PARTICLE_CREATED", particle);
    bindEmtterEvent && this.dispatchEvent("PARTICLE_CREATED", particle);

    return particle;
  }
  /**
   * add initialize to this emitter
   * @method addSelfInitialize
   */
  addSelfInitialize(pObj: any) {
    if (pObj["init"]) {
      pObj.init(this);
    } else {
      this.initAll();
    }
  }

  /**
   * add the Initialize to particles;
   *
   * you can use initializes array:for example emitter.addInitialize(initialize1,initialize2,initialize3);
   * @method addInitialize
   * @param {Initialize} initialize like this new Radius(1, 12)
   */
  addInitialize(initialize: Initialize) {
    // var i = arguments.length;
    // while (i--) this.initializes.push(arguments[i]);
    this.initializes.push(initialize);
  }

  /**
   * remove the Initialize
   * @method removeInitialize
   * @param {Initialize} initialize a initialize
   */
  removeInitialize(initializer: Initialize) {
    var index = this.initializes.indexOf(initializer);
    if (index > -1) this.initializes.splice(index, 1);
  }

  /**
   * remove all Initializes
   * @method removeInitializers
   */
  removeInitializers() {
    Util.destroyArray(this.initializes);
  }
  /**
   * add the Behaviour to particles;
   *
   * you can use Behaviours array:emitter.addBehaviour(Behaviour1,Behaviour2,Behaviour3);
   * @method addBehaviour
   * @param {Behaviour} behaviour like this new Color('random')
   */
  addBehaviour(behaviour: any) {
    // var i = arguments.length;
    // while (i--) this.behaviours.push(arguments[i]);
    this.behaviours.push(behaviour);
  }
  /**
   * remove the Behaviour
   * @method removeBehaviour
   * @param {Behaviour} behaviour a behaviour
   */
  removeBehaviour(behaviour: Behaviour) {
    var index = this.behaviours.indexOf(behaviour);
    if (index > -1) this.behaviours.splice(index, 1);
  }
  /**
   * remove all behaviours
   * @method removeAllBehaviours
   */
  removeAllBehaviours() {
    Util.destroyArray(this.behaviours);
  }

  integrate(time: number) {
    var damping = 1 - this.damping;
    Proton.integrator.integrate(this, time, damping);

    var i = this.particles.length;
    while (i--) {
      const particle = this.particles[i];
      particle.update(time, i);
      Proton.integrator.integrate(particle, time, damping);

      this.parent && this.parent.dispatchEvent("PARTICLE_UPDATE", particle);
      bindEmtterEvent && this.dispatchEvent("PARTICLE_UPDATE", particle);
    }
  }

  emitting(time: number) {
    if (this.totalEmitTimes === "once") {
      var i = this.rate.getValue(99999);
      if (i > 0) this.cID = i;
      while (i--) this.createParticle();
      this.totalEmitTimes = "none";
    } else if (!isNaN(this.totalEmitTimes)) {
      this.currentEmitTime += time;
      if (this.currentEmitTime < this.totalEmitTimes) {
        var i = this.rate.getValue(time);
        if (i > 0) this.cID = i;
        while (i--) this.createParticle();
      }
    }
  }

  update(time: number) {
    this.age += time;
    if (this.dead || this.age >= this.life) {
      this.destroy();
    }

    this.emitting(time);
    this.integrate(time);

    // 剔除死亡的粒子
    let particle;
    let i = this.particles.length;
    while (i--) {
      particle = this.particles[i];
      if (particle.dead) {
        this.parent && this.parent.dispatchEvent("PARTICLE_DEAD", particle);
        bindEmtterEvent && this.dispatchEvent("PARTICLE_DEAD", particle);

        this.parent.pool.expire(particle.reset());
        this.particles.splice(i, 1);
      }
    }
  }

  setupParticle(particle: Particle, initialize: Initialize, behaviour: Behaviour) {
    var initializes = this.initializes;
    var behaviours = this.behaviours;

    if (initialize) {
      if (Array.isArray(initialize)) {
        initializes = initialize;
      } else {
        initializes = [initialize];
      }
    }

    if (behaviour) {
      if (Array.isArray(behaviour)) {
        behaviours = behaviour;
      } else {
        behaviours = [behaviour];
      }
    }

    InitializeUtil.initialize(this, particle, initializes);
    particle.addBehaviours(behaviours);
    particle.parent = this;
    this.particles.push(particle);
  }

  /**
   * Destory this Emitter
   * @method destroy
   */
  destroy() {
    this.dead = true;
    this.energy = 0;
    this.totalEmitTimes = -1;

    if (this.particles.length === 0) {
      this.removeInitializers();
      this.removeAllBehaviours();

      this.parent && this.parent.removeEmitter(this);
    }
  }
}
