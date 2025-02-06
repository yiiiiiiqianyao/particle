import { Zone } from './Zone';
import { Util } from '../utils/Util';
import { Vector3D } from '../math/Vector3D';
import { PI } from '../core/constant';
/**
     * SphereZone is a sphere zone
     * @param {Number|Vector3D} x - the center's x value or a Vector3D Object
     * @param {Number} y - the center's y value or the Sphere's radius 
     * @param {Number} z - the center's z value 
     * @param {Number} r - the Sphere's radius 
     * @example 
     * var sphereZone = new SphereZone(0,0,0,100);
     * var sphereZone = new SphereZone(new Vector3D(0,0,0),100);
     * @extends {Zone}
     * @constructor
     */
    export class SphereZone extends Zone {
        x: number;
        y: number;
        z: number;
        radius: number;
        tha: number;
        phi: number;
        _normal!: Vector3D;
        _v!: Vector3D;
        constructor(a: number, b?: number, c?: number, d?: number) {
            super()
            let x, y, z;
            let r: number;
            if (Util.isUndefined(b, c, d)) {
                x = y = z = 0;
                r = (a || 100);
            } else {
                x = a;
                y = b;
                z = c;
                r = d || 1;
            }
    
            this.x = x;
            this.y = x;
            this.z = x;
            this.radius = r;
            this.tha = this.phi = 0;
        }
        getPosition() {
            let tha, phi, r;
            this.random = Math.random();
    
            r = this.random * this.radius;
            tha = PI * Math.random(); //[0-pi]
            phi = PI * 2 * Math.random(); //[0-2pi]

            this.vector.x = this.x + r * Math.sin(tha) * Math.cos(phi);
            this.vector.y = this.y + r * Math.sin(phi) * Math.sin(tha);
            this.vector.z = this.z + r * Math.cos(tha);

            return this.vector;
        };
    
        _dead(particle: any) {
            var d = particle.p.distanceTo(this);
            if (d - particle.radius > this.radius) particle.dead = true;
        }
    
        _bound(particle: any) {
            if(!this._normal) {
                this._normal = new Vector3D();
            }
            if(!this._v) {
                this._v = new Vector3D();
            }
            let normal = this._normal;
            let v = this._v;
            let k;
    
            var d = particle.p.distanceTo(this);
            if (d + particle.radius >= this.radius) {
                const sphereV = this as unknown as Vector3D;
                normal.copy(particle.p).sub(sphereV).normalize();
                v.copy(particle.v);
                k = 2 * v.dot(normal);
                particle.v.sub(normal.scalar(k));
            }
        };
    
        _cross(particle: any) {
            if (this.log) {
                console.error('Sorry SphereZone does not support _cross method');
                this.log = false;
            }
        }
    }