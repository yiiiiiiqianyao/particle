import { createSpan, Span } from '../math/Span';
import { Util } from '../utils/Util';
/**
 * The number of particles per second emission (a [particle]/b [s]);
 * @class Rate
 * @constructor
 * @param {Array or Number or Span} numPan the number of each emission;
 * @param {Array or Number or Span} timePan the time of each emission;
 * for example: new Rate(new Span(10, 20), new Span(.1, .25));
 */

export class Rate {
  startTime: number;
  nextTime: number;
  numPan: Span;
  timePan: Span;
  constructor(numPan: Span, timePan: Span) {
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

  getValue(time: number) {
    this.startTime += time;

    if (this.startTime >= this.nextTime) {
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