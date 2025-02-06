// @ts-nocheck
import { Zone } from '../zone/Zone';
import { Initialize } from './Initialize';

/**
 * Position is init particle's Position
 * @param {Zone} zone - the Position zone
 * @example
 * var Position = new Proton.Position(new PointZone(30,100,0));
 * or
 * var Position = new Proton.Position(Infinity);
 * @extends {Initialize}
 * @constructor
 */
export class Position extends Initialize {
  zones = [];
  constructor(z?: Zone) {
    super();
    // this.reset.apply(this, arguments);
    if(z) {
      this.zones = this.zones.concat(z);
    }
  }
  reset () {
    if (!this.zones) {
      this.zones = [];
    } else {
      this.zones.length = 0;
      this.zones = [];
    }
  
    // var args = Array.prototype.slice.call(arguments);
    this.zones = this.zones.concat(...arguments);
  };
  addZone(...zones: Zone[]) {
    const args = Array.prototype.slice.call(zones);
    this.zones = this.zones.concat(args);
  };

  initialize = (() => {
    return (target) => {
      const zone = this.zones[(Math.random() * this.zones.length) >> 0];
      zone.getPosition();
      target.p.x = zone.vector.x;
      target.p.y = zone.vector.y;
      target.p.z = zone.vector.z;
    };
  })();
}