import { Initialize } from './Initialize'
import { Util } from '../utils/Util'
import { Emitter } from '../emitter/Emitter';
import { Particle } from '../core/Particle';

export class InitializeUtil {
  static initialize(emitter: Emitter, particle: Particle, initializes: Initialize[]) {
    var i = initializes.length;
    while (i--) {
      var initialize = initializes[i];
      if (initialize instanceof Initialize)
        initialize.init(emitter, particle);
      else InitializeUtil.init(emitter, particle, initialize);
    }

    InitializeUtil.bindEmitter(emitter, particle);
  }
  static init(emitter: Emitter, particle: Particle, initialize: Initialize) {
    Util.setPrototypeByObj(particle, initialize);
    Util.setVectorByObj(particle, initialize);
  }
  static bindEmitter(emitter: Emitter, particle: Particle) {
    if (emitter.bindEmitter) {
      particle.p.add(emitter.p);
      particle.v.add(emitter.v);
      particle.a.add(emitter.a);
      particle.v.applyEuler(emitter.rotation);
    }
  }
};
