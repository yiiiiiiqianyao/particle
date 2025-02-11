
import { Util } from "../utils/Util";
import { Pool } from "./pool";
import { EULER, POOL_MAX } from "./constant";
import { Integration } from "../math/Integration";
import { EventDispatcher } from '../events/EventDispatcher'
import { Emitter } from "../emitter/Emitter";
import { BaseRender } from "yiqianyao_particle/render";

/**
 * @name Proton is a particle engine for three.js
 *
 * @class Proton
 * @param {number} particleNumber input any number
 * @param {number} integrationType input any number
 * @example var proton = new Proton(200);
 */
export class Proton extends EventDispatcher {
  static integrator: Integration;
  pool: Pool;
  renderers: BaseRender[];
  emitters: Emitter[];
  integrationType: string;
  particleNumber: number;
  constructor(particleNumber?: any, integrationType?: any) {
    super();
    this.particleNumber = Util.initValue(particleNumber, POOL_MAX);
    this.integrationType = Util.initValue(integrationType, EULER);

    this.emitters = [];
    this.renderers = [];

    this.pool = new Pool();
    Proton.integrator = new Integration(this.integrationType);
  }

  /**
   * @name add a type of Renderer
   *
   * @method addRender
   * @param {Renderer} render
   */
  addRender(renderer: BaseRender) {
    this.renderers.push(renderer);
    renderer.init(this);
  }

  /**
   * @name add a type of Renderer
   *
   * @method addRender
   * @param {Renderer} render
   */
  removeRender(renderer: BaseRender) {
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
    renderer.remove(this);
  }

  /**
   * add the Emitter
   *
   * @method addEmitter
   * @param {Emitter} emitter
   */
  addEmitter(emitter: Emitter) {
    this.emitters.push(emitter);
    emitter.parent = this;
    this.dispatchEvent("EMITTER_ADDED", emitter);
  }

  removeEmitter(emitter: Emitter) {
    if (emitter.parent !== this) return;

    this.emitters.splice(this.emitters.indexOf(emitter), 1);
    emitter.parent = null;
    this.dispatchEvent("EMITTER_REMOVED", emitter);
  }

  update(delta = 0.0167) {
    this.dispatchEvent("PROTON_UPDATE", this);
    if (delta > 0) {
      let i = this.emitters.length;
      while (i--) {
        this.emitters[i].update(delta);
      }
    }

    this.dispatchEvent("PROTON_UPDATE_AFTER", this);
  }

  /**
   * getCount
   * @name get the count of particle
   * @return (number) particles count
   */
  getCount() {
    let total = 0;
    let i;
    const length = this.emitters.length;
    for (i = 0; i < length; i++) {
      total += this.emitters[i].particles.length;
    }
    return total;
  }

  /**
   * destroy
   * @name destroy the proton
   */
  destroy() {
    let i = 0;
    const length = this.emitters.length;

    for (i; i < length; i++) {
      this.emitters[i].destroy();
      delete this.emitters[i];
    }

    this.emitters.length = 0;
    this.pool.destroy();
  }
}
