import { createSpan, Span } from '../math/Span';
import { Util } from '../utils/Util';
/**
 * The number of particles per second emission (a [particle]/b [s])，通常用于控制粒子的发射的速率。
 * @class Rate
 * @constructor
 * @param {Array or Number or Span} numPan the number of each emission; 发射器每次发射的粒子数量
 * @param {Array or Number or Span} timePan the time of each emission; 发射器每隔多少时间发射一次
 * for example: new Rate(new Span(10, 20), new Span(.1, .25));
 */

export class Rate {
  startTime: number;
  nextTime: number;
  numPan: Span;
  timePan: Span;
  constructor(numPan?: number | Span, timePan?: number | Span) {
    this.numPan = createSpan(Util.initValue(numPan, 1));
    this.timePan = createSpan(Util.initValue(timePan, 1));

    this.startTime = 0;
    this.nextTime = 0;
    this.init();
  }
  init() {
    this.startTime = 0;
    this.nextTime = this.timePan.getValue();
  }

  /**
   * 获取当前触发的粒子数
   * @param deltaTime
   * @returns
   */
  getValue(deltaTime: number) {
    this.startTime += deltaTime;

    if (this.startTime >= this.nextTime) { // 控制触发的间隔
      this.init();

      if (this.numPan.b === 1) {
        if (this.numPan.getValue("Float") > 0.5) return 1;
        else return 0;
      } else {
        return this.numPan.getValue("Int");
      }
    }

    return 0;
  }
}
