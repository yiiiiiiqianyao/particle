import { Quaternion } from './Quaternion';
import { PI } from '../core/constant';

export class Vector3D {
    id!: number;
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    setX(x: number) {
        this.x = x;
        return this;
    }

    setY(y: number) {
        this.y = y;
        return this;
    }

    setZ(z: number) {
        this.z = z;
        return this;
    }

    getGradient() {
        if (this.x !== 0)
            return Math.atan2(this.y, this.x);
        else if (this.y > 0)
            return PI / 2;
        else if (this.y < 0)
            return -PI / 2;
    }

    copy(v: Vector3D) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    add(v: Vector3D, w?: Vector3D) {
        if (w !== undefined) return this.addVectors(v, w);

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;

    }

    addValue(a: number, b: number, c: number) {
        this.x += a;
        this.y += b;
        this.z += c;

        return this;

    }

    addVectors(a: Vector3D, b: Vector3D) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;
    }

    addScalar(s: number) {
        this.x += s;
        this.y += s;
        this.z += s;

        return this;
    }

    sub(v: Vector3D, w?: Vector3D) {
        if (w !== undefined) return this.subVectors(v, w);

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;
    }

    subVectors(a: Vector3D, b: Vector3D) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    scalar(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;

        return this;
    }

    divideScalar(s: number) {
        if (s !== 0) {
            this.x /= s;
            this.y /= s;
            this.z /= s;
        } else {
            this.set(0, 0, 0);
        }

        return this;
    }

    negate() {
        return this.scalar(-1);
    }

    dot(v: Vector3D) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vector3D) {
        var x = this.x,
            y = this.y,
            z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;

        return this;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalize() {
        return this.divideScalar(this.length());
    }

    distanceTo(v: Vector3D) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    crossVectors(a: Vector3D, b: Vector3D) {

        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    }

    eulerFromDir(dir: Vector3D) { }

    applyEuler = function () {
        var quaternion: Quaternion | undefined;

        return function applyEuler(euler: any) {
            if (quaternion === undefined) quaternion = new Quaternion();
            // @ts-ignore
            this.applyQuaternion(quaternion.setFromEuler(euler));
            // @ts-ignore
            return this;
        };
    }()

    applyAxisAngle = function () {
        var quaternion: Quaternion | undefined;
        return function applyAxisAngle(axis: any, angle: any) {
            if (quaternion === undefined) quaternion = new Quaternion();
            // @ts-ignore
            this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
            // @ts-ignore
            return this;
        };
    }()

    applyQuaternion(q: Quaternion) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vector

        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    }

    distanceToSquared(v: Vector3D) {
        var dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    }

    lerp(v: Vector3D, alpha: number) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }

    equals(v: Vector3D) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    }

    clear() {
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        return this;
    }

    clone() {
        return new Vector3D(this.x, this.y, this.z);
    }

    toString() {
        return "x:" + this.x + "y:" + this.y + "z:" + this.z;
    }
}