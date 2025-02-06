import { Force } from './Force';
import { EaseFunc } from '../ease/ease';
export class Gravity extends Force {
    constructor(g: number, life?: number, easing?: EaseFunc) {
      super(0, -g, 0, life, easing);
      this.name = "Gravity";
    }
    // @ts-ignore
    reset(g: number, life?: number, easing?: EaseFunc) {
      // @ts-ignore
      super.reset.call(this, 0, -g, 0, life, easing);
    }
  }