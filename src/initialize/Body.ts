import { Initialize } from './Initialize';
import { ArraySpan, createArraySpan } from '../math/Span';
import { Util } from '../utils/Util';
import { Particle } from '../core/Particle';

export class Body extends Initialize {
  body: ArraySpan;
  w: number;
  h: number;
  constructor(body?: any, w?: any, h?: any) {
    super();
    this.body = createArraySpan(body) as ArraySpan;
    this.w = w;
    this.h = Util.initValue(h, this.w);
  }

  initialize(particle: Particle) {
    const body = this.body.getValue();
    if (!!this.w) {
      particle.body = {
        width: this.w,
        height: this.h,
        body: body,
      };
    } else {
      particle.body = body;
    }
  };
}

