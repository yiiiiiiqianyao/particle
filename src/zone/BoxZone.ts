
import { Zone } from './Zone';
import { Util } from '../utils/Util'
import { MathUtils } from '../math/MathUtils';
import { Particle } from '../core/Particle';
import { Axis } from 'yiqianyao_particle/core/constant';
/**
 * BoxZone is a box zone
 * @param {Number|Vector3D} x - the position's x value or a Vector3D Object
 * @param {Number} y - the position's y value
 * @param {Number} z - the position's z value
 * @param {Number} w - the Box's width
 * @param {Number} h - the Box's height
 * @param {Number} d - the Box's depth
 * @example
 * var boxZone = new BoxZone(0,0,0,50,50,50);
 * or
 * var boxZone = new BoxZone(new Vector3D(0,0,0), 50, 50, 50);
 * @extends {Zone}
 * @constructor
 */
export class BoxZone extends Zone {
  width!: number;
  height: number;
  depth: number;
  friction: number;
  max: number;
  constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number) {
    super();
    let x, y, z;
    let width, height, depth;
    if (Util.isUndefined(b, c, d, e, f)) {
      x = y = z = 0;
      width = height = depth = (a || 100);
    } else if (Util.isUndefined(d, e, f)) {
      x = y = z = 0;
      width = a;
      height = b;
      depth = c;
    } else {
      x = a;
      y = b;
      z = c;
      width = d;
      height = e;
      depth = f;
    }
    this.x = x as number;
    this.y = y as number;
    this.z = z as number;
    this.width = width as number;
    this.height = height as number;
    this.depth = depth as number;
    //
    this.friction = 0.85;
    this.max = 6;
  }
  getPosition() {
    this.vector.x = this.x + MathUtils.randomAToB(-.5, .5) * this.width;
    this.vector.y = this.y + MathUtils.randomAToB(-.5, .5) * this.height;
    this.vector.z = this.z + MathUtils.randomAToB(-.5, .5) * this.depth;
    return this.vector;
  }

  _dead(particle: Particle) {
    if (particle.p.x + particle.radius < this.x - this.width / 2)
      particle.dead = true;
    else if (particle.p.x - particle.radius > this.x + this.width / 2)
      particle.dead = true;

    if (particle.p.y + particle.radius < this.y - this.height / 2)
      particle.dead = true;
    else if (particle.p.y - particle.radius > this.y + this.height / 2)
      particle.dead = true;

    if (particle.p.z + particle.radius < this.z - this.depth / 2)
      particle.dead = true;
    else if (particle.p.z - particle.radius > this.z + this.depth / 2)
      particle.dead = true;
  }

  _bound(particle: Particle) {
    if (particle.p.x - particle.radius < this.x - this.width / 2) {
      particle.p.x = this.x - this.width / 2 + particle.radius;
      particle.v.x *= -this.friction;
      this._static(particle, Axis.X);
    } else if (particle.p.x + particle.radius > this.x + this.width / 2) {
      particle.p.x = this.x + this.width / 2 - particle.radius;
      particle.v.x *= -this.friction;
      this._static(particle, Axis.X);
    }

    if (particle.p.y - particle.radius < this.y - this.height / 2) {
      particle.p.y = this.y - this.height / 2 + particle.radius;
      particle.v.y *= -this.friction;
      this._static(particle, Axis.Y);
    } else if (particle.p.y + particle.radius > this.y + this.height / 2) {
      particle.p.y = this.y + this.height / 2 - particle.radius;
      particle.v.y *= -this.friction;
      this._static(particle, Axis.Y);
    }

    if (particle.p.z - particle.radius < this.z - this.depth / 2) {
      particle.p.z = this.z - this.depth / 2 + particle.radius;
      particle.v.z *= -this.friction;
      this._static(particle, Axis.Z);
    } else if (particle.p.z + particle.radius > this.z + this.depth / 2) {
      particle.p.z = this.z + this.depth / 2 - particle.radius;
      particle.v.z *= -this.friction;
      this._static(particle, Axis.Z);
    }
  }

  _cross(particle: Particle) {
    if (particle.p.x + particle.radius < this.x - this.width / 2 && particle.v.x <= 0) {
      particle.p.x = this.x + this.width / 2 + particle.radius;
    } else if (particle.p.x - particle.radius > this.x + this.width / 2 && particle.v.x >= 0) {
      particle.p.x = this.x - this.width / 2 - particle.radius;
    }

    if (particle.p.y + particle.radius < this.y - this.height / 2 && particle.v.y <= 0) {
      particle.p.y = this.y + this.height / 2 + particle.radius;
    } else if (particle.p.y - particle.radius > this.y + this.height / 2 && particle.v.y >= 0) {
      particle.p.y = this.y - this.height / 2 - particle.radius;
    }

    if (particle.p.z + particle.radius < this.z - this.depth / 2 && particle.v.z <= 0) {
      particle.p.z = this.z + this.depth / 2 + particle.radius;
    }
    else if (particle.p.z - particle.radius > this.z + this.depth / 2 && particle.v.z >= 0) {
      particle.p.z = this.z - this.depth / 2 - particle.radius;
    }
  }

  private _static(particle: Particle, axis: Axis) {
    if (particle.v[axis] * particle.a[axis] > 0) return;
    if (Math.abs(particle.v[axis]) < Math.abs(particle.a[axis]) * 0.0167 * this.max) {
      particle.v[axis] = 0;
      particle.a[axis] = 0;
    }
  }
}
