
import { PI } from '../core/constant';
import { Vector3D } from './Vector3D';
export class MathUtils {
    static randomAToB(a: number, b: number, INT?: number) {
        if (!INT) {
            return a + Math.random() * (b - a);
        }
        else {
            return ((Math.random() * (b - a)) >> 0) + a;
        }

    }
    static randomFloating(center: number, f: number, INT: number) {
        return MathUtils.randomAToB(center - f, center + f, INT);
    }

    static randomZone(display: any) {

    }

    static degreeTransform(a: number) {
        return a * PI / 180;
    }

    static toColor16(num: number) {
        return "#" + num.toString(16);
    }

    static randomColor() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    }

    static lerp(a: number, b: number, energy: number) {
        return b + (a - b) * energy
    }

    static getNormal(v: Vector3D, n: Vector3D) {
        if (v.x === 0 && v.y === 0) {
            if (v.z === 0)
                n.set(1, 0, 1);
            else
                n.set(1, 1, -v.y / v.z);
        } else {
            if (v.x === 0)
                n.set(1, 0, 1);
            else
                n.set(-v.y / v.x, 1, 1);
        }

        return n.normalize();
    }

    /** 
     * Rodrigues' Rotation Formula 
     * https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
     * v′ = vcos(θ) + k(k⋅v)(1−cos(θ)) + (k*v)sin(θ)
     */
    static axisRotate(v0: Vector3D, v: Vector3D, k: Vector3D, tha: number) {
        var cos = Math.cos(tha);
        var sin = Math.sin(tha);
        var p = k.dot(v) * (1 - cos);

        v0.copy(k);
        v0.cross(v).scalar(sin);
        v0.addValue(v.x * cos, v.y * cos, v.z * cos);
        v0.addValue(k.x * p, k.y * p, k.z * p);
    }
}