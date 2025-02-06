import { PI } from '../core/constant'
/**
* The Ease class provides a collection of easing functions for use with Proton
*/

export type EaseFunc = (v: number) => number;


export class ease {
    static easeLinear(value: number) {
        return value;
    }

    static easeInQuad(value: number) {
        return Math.pow(value, 2);
    }

    static easeOutQuad(value: number) {
        return -(Math.pow((value - 1), 2) - 1);
    }

    static easeInOutQuad(value: number) {
        if ((value /= 0.5) < 1)
            return 0.5 * Math.pow(value, 2);
        return -0.5 * ((value -= 2) * value - 2);
    }

    static easeInCubic(value: number) {
        return Math.pow(value, 3);
    }

    static easeOutCubic(value: number) {
        return (Math.pow((value - 1), 3) + 1);
    }

    static easeInOutCubic(value: number) {
        if ((value /= 0.5) < 1)
            return 0.5 * Math.pow(value, 3);
        return 0.5 * (Math.pow((value - 2), 3) + 2);
    }

    static easeInQuart(value: number) {
        return Math.pow(value, 4);
    }

    static easeOutQuart(value: number) {
        return -(Math.pow((value - 1), 4) - 1);
    }

    static easeInOutQuart(value: number) {
        if ((value /= 0.5) < 1)
            return 0.5 * Math.pow(value, 4);
        return -0.5 * ((value -= 2) * Math.pow(value, 3) - 2);
    }

    static easeInSine(value: number) {
        return -Math.cos(value * (PI / 2)) + 1;
    }

    static easeOutSine(value: number) {
        return Math.sin(value * (PI / 2));
    }

    static easeInOutSine(value: number) {
        return (-0.5 * (Math.cos(PI * value) - 1));
    }

    static easeInExpo(value: number) {
        return (value === 0) ? 0 : Math.pow(2, 10 * (value - 1));
    }

    static easeOutExpo(value: number) {
        return (value === 1) ? 1 : -Math.pow(2, -10 * value) + 1;
    }

    static easeInOutExpo(value: number) {
        if (value === 0)
            return 0;
        if (value === 1)
            return 1;
        if ((value /= 0.5) < 1)
            return 0.5 * Math.pow(2, 10 * (value - 1));
        return 0.5 * (-Math.pow(2, -10 * --value) + 2);
    }

    static easeInCirc(value: number) {
        return -(Math.sqrt(1 - (value * value)) - 1);
    }

    static easeOutCirc(value: number) {
        return Math.sqrt(1 - Math.pow((value - 1), 2));
    }

    static easeInOutCirc(value: number) {
        if ((value /= 0.5) < 1)
            return -0.5 * (Math.sqrt(1 - value * value) - 1);
        return 0.5 * (Math.sqrt(1 - (value -= 2) * value) + 1);
    }

    static easeInBack(value: number) {
        var s = 1.70158;
        return (value) * value * ((s + 1) * value - s);
    }

    static easeOutBack(value: number) {
        var s = 1.70158;
        return (value = value - 1) * value * ((s + 1) * value + s) + 1;
    }

    static easeInOutBack(value: number) {
        var s = 1.70158;
        if ((value /= 0.5) < 1)
            return 0.5 * (value * value * (((s *= (1.525)) + 1) * value - s));
        return 0.5 * ((value -= 2) * value * (((s *= (1.525)) + 1) * value + s) + 2);
    }
}


