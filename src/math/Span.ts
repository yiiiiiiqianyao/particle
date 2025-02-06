// @ts-nocheck
import { MathUtils } from './MathUtils'
import { Util } from '../utils/Util'
/**
 * Span Class. Get a random Number from a to b. Or from c-a to c+b
 * @param {Number|Array} a - min number
 * @param {Number} b - max number
 * @param {Number} center - the center's z value  
 * @example 
 * var span = new Span(0,30);
 * or
 * var span = new Span(["#fff","#ff0","#000"]);
 * or
 * var span = new Span(5,1,"center");
 * @extends {Zone}
 * @constructor
 */
export class Span {
    _isArray: boolean;
    a: number | string;
    b: number;
    _center
    constructor(a: number | string, b?: number, center?: number) {
        this._isArray = false;

        if (Array.isArray(a)) {
            this._isArray = true;
            this.a = a;
        } else {
            this.a = Util.initValue(a, 1);
            this.b = Util.initValue(b, this.a);
            this._center = Util.initValue(center, false);
        }
    }
    /**
     * Span.getValue function
     * @name get a random Number from a to b. Or get a random Number from c-a to c+b
     * @param {number} INT or int
     * @return {number} a random Number
     */
    getValue(INT?: number | string) {
        if (this._isArray) {
            return this.a[(this.a.length * Math.random()) >> 0];
        } else {
            if (!this._center)
                return MathUtils.randomAToB(this.a, this.b, INT);
            else
                return MathUtils.randomFloating(this.a, this.b, INT);
        }
    }
}

     /**
     * ArraySpan name get a random Color from a colors array
     * @param {String|Array} colors - colors array
     * @example 
     * var span = new ArraySpan(["#fff","#ff0","#000"]);
     * or
     * var span = new ArraySpan("#ff0");
     * @extends {Span}
     * @constructor
     */

     export class ArraySpan extends Span {
        constructor(colors) {
            super();
            this._arr = Array.isArray(colors) ? colors : [colors];
        }
            /**
     * getValue function
     * @name get a random Color
     * @return {string} a hex color
     */
        getValue = function() {
            var color = this._arr[(this._arr.length * Math.random()) >> 0];
            
            if (color === 'random' || color === 'Random')
                return MathUtils.randomColor();
            else
                return color;
        }
    }

 /**
     * createSpan function
     * @name get a instance of Span
     * @param {number} a min number
     * @param {number} b max number
     * @param {number} c center number
     * @return {number} return a instance of Span
     */
 export function createSpan(a: number, b?: number, c?: any) {
    if (a instanceof Span) return a;

    if (b === undefined) {
        return new Span(a);
    } else {
        if (c === undefined)
            return new Span(a, b);
        else
            return new Span(a, b, c);
    }
}

    /**
     * Proton.createArraySpan function
     * @name get a instance of Span
     * @param {number} a min number
     * @param {number} b max number
     * @param {number} c center number
     * @return {number} return a instance of Span
     */
    export function createArraySpan(arr?: ArraySpan | any[]) {
        if (!arr) return null;
        if (arr instanceof ArraySpan)
            return arr;
        else 
            return new ArraySpan(arr);
    }