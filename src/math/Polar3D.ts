import { Vector3D } from './Vector3D';

export class Polar3D {
    radius: number;
    phi: number;
    theta: number;
    constructor(radius?: number, theta?: number, phi?: number) {
        this.radius = radius || 1;
        this.phi = phi || 0;
        this.theta = theta || 0;
    }
    set(radius?: number, theta?: number, phi?: number) {
        this.radius = radius || 1;
        this.phi = phi || 0;
        this.theta = theta || 0;

        return this;
    }

    setRadius(radius: number) {
        this.radius = radius;
        return this;
    }

    setPhi(phi: number) {
        this.phi = phi;
        return this;
    }

    setTheta(theta: number) {
        this.theta = theta;
        return this;
    }

    copy(p: Polar3D) {
        this.radius = p.radius;
        this.phi = p.phi;
        this.theta = p.theta;
        return this;
    }

    toVector3D() {
        return new Vector3D(this.getX(), this.getY(), this.getZ());
    }

    getX() {
        return this.radius * Math.sin(this.theta) * Math.cos(this.phi);
    }

    getY() {
        return -this.radius * Math.sin(this.theta) * Math.sin(this.phi);
    }

    getZ() {
        return this.radius * Math.cos(this.theta);
    }

    normalize() {
        this.radius = 1;
        return this;
    }

    equals(v: Polar3D) {
        return ((v.radius === this.radius) && (v.phi === this.phi) && (v.theta === this.theta));
    }

    clear() {
        this.radius = 0.0;
        this.phi = 0.0;
        this.theta = 0.0;
        return this;
    }

    clone() {
        return new Polar3D(this.radius, this.phi, this.theta);
    }
}