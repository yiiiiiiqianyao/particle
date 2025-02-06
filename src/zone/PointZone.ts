// @ts-nocheck
import { Zone  } from './Zone';
import { Util } from '../utils/Util';
/**
     * PointZone is a point zone
     * @param {Number|Vector3D} x - the center's x value or a Vector3D Object
     * @param {Number} y - the center's y value
     * @param {Number} z - the center's z value  
     * @example 
     * var pointZone = new PointZone(0,30,10);
     * or
     * var pointZone = new PointZone(new Vector3D(0,30,10));
     * @extends {Zone}
     * @constructor
     */
export class PointZone extends Zone {
    constructor(a, b, c) {
        var x, y, z;
        super();
        if (Util.isUndefined(a, b, c)) {
            x = y = z = 0;
        } else {
            x = a;
            y = b;
            z = c;
        }

        this.x = x;
        this.y = y;
        this.z = z;
    }
    getPosition() {
        this.vector.x = this.x;
        this.vector.y = this.y;
        this.vector.z = this.z;
        return this.vector;
    }

    crossing(particle) {
        if (this.log) {
            console.error('Sorry PointZone does not support crossing method');
            this.log = false;
        }
    }   
}