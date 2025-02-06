import { Initialize } from './Initialize';
import { createSpan, Span } from '../math/Span';
import { Vector3D } from '../math/Vector3D';
import { MathUtils } from '../math/MathUtils';
import { DR, PI, MEASURE } from '../core/constant';
import { Polar3D } from '../math/Polar3D';

/**
 * Velocity is init particle's Velocity
 * @param {Number} a - the Life's start point
 * @param {Number} b - the Life's end point
 * @param {String} c - span's center
 * @example
 * var life = new Life(3,5);
 * or
 * var life = new Life(Infinity);
 * @extends {Initialize}
 * @constructor
 */
//radius and tha
export class Velocity extends Initialize {
  dirVec: Vector3D;
  dir!: Vector3D;
  tha!: number;
  _useV!: boolean;
  radiusPan!: Span;
  constructor(a?: any, b?: any, c?: any) {
    super();
    this.reset(a, b, c);
    this.dirVec = new Vector3D(0, 0, 0);
  
    this.name = "Velocity";
  }
  reset(a?: any, b?: any, c?: any) {
    //[vector,tha]
    if (a instanceof Vector3D) {
      this.radiusPan = createSpan(1);
      this.dir = a.clone();
      this.tha = b * DR;
      this._useV = true;
    }
  
    //[polar,tha]
    else if (a instanceof Polar3D) {
      this.tha = b * DR;
      this.dirVec = a.toVector3D();
      this._useV = false;
    }
  
    //[radius,vector,tha]
    else {
      this.radiusPan = createSpan(a);
      this.dir = b.clone().normalize();
      this.tha = c * DR;
      this._useV = true;
    }
  };
  normalize(vr: any) {
    return vr * MEASURE;
  };
  initialize(target: any) {
    var tha;
    var normal = new Vector3D(0, 0, 1);
    var v = new Vector3D(0, 0, 0);
  
    tha = this.tha * Math.random();
      this._useV && this.dirVec.copy(this.dir).scalar(this.radiusPan.getValue());
  
      MathUtils.getNormal(this.dirVec, normal);
      v.copy(this.dirVec).applyAxisAngle(normal, tha);
      v.applyAxisAngle(this.dirVec.normalize(), Math.random() * PI * 2);
  
      // use  axisRotate methods
      // MathUtils.axisRotate(this.v1, this.dirVec, normal, tha);
      // MathUtils.axisRotate(this.v2, this.v1, this.dirVec.normalize(), Math.random() * PI * 2);
      target.v.copy(v);
      return this;
  };
}