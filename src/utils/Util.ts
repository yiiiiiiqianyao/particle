
import { Span } from "../math/Span";
export class Util {
    static initValue(value?: any, defaults?: any) {
        const initValue = (value !== null && value !== undefined) ? value : defaults;
        return initValue;
    }
    static destroyObject(obj: Record<string, any>) {
        for (const o in obj) {
          delete obj[o];
        }
    }
    static isUndefined(...items: any[]) {
        for (var id in items) {
            var arg = arguments[id];
            if (arg !== undefined)
                return false;
        }
        return true;
    }
    static setVectorByObj(target: any, pOBJ: any) {
        if (pOBJ["x"] !== undefined) target.p.x = pOBJ["x"];
        if (pOBJ["y"] !== undefined) target.p.y = pOBJ["y"];
        if (pOBJ["z"] !== undefined) target.p.z = pOBJ["z"];

        if (pOBJ["vx"] !== undefined) target.v.x = pOBJ["vx"];
        if (pOBJ["vy"] !== undefined) target.v.y = pOBJ["vy"];
        if (pOBJ["vz"] !== undefined) target.v.z = pOBJ["vz"];

        if (pOBJ["ax"] !== undefined) target.a.x = pOBJ["ax"];
        if (pOBJ["ay"] !== undefined) target.a.y = pOBJ["ay"];
        if (pOBJ["az"] !== undefined) target.a.z = pOBJ["az"];

        if (pOBJ["p"] !== undefined) target.p.copy(pOBJ["p"]);
        if (pOBJ["v"] !== undefined) target.v.copy(pOBJ["v"]);
        if (pOBJ["a"] !== undefined) target.a.copy(pOBJ["a"]);

        if (pOBJ["position"] !== undefined) target.p.copy(pOBJ["position"]);
        if (pOBJ["velocity"] !== undefined) target.v.copy(pOBJ["velocity"]);
        if (pOBJ["accelerate"] !== undefined) target.a.copy(pOBJ["accelerate"]);
    }
    //set prototype
    static setPrototypeByObj(target: any, proObj: any, filters?: any) {
        for (var key in proObj) {
            if (target.hasOwnProperty(key)) {
                if (filters) {
                    if (filters.indexOf(key) < 0) target[key] = Util._getValue(proObj[key]);
                } else {
                    target[key] = Util._getValue(proObj[key]);
                }
            }
        }

        return target;
    }
    static _getValue(pan: any) {
        if (pan instanceof Span)
            return pan.getValue();
        else
            return pan;
    }
};
