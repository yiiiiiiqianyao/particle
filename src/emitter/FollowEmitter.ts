// @ts-nocheck
import { Emitter } from "./Emitter";
import { Util } from "../utils/Util";
import { Vector3D } from "../math/Vector3D";
import { THREEUtil } from "../utils/THREEUtil";
import { EaseFunc } from "../ease/ease";

/**
 * The FollowEmitter class inherits from Emitter
 *
 * use the FollowEmitter will emit particle when mousemoving
 *
 * @class FollowEmitter
 * @constructor
 * @param {Element} mouseTarget mouseevent's target;
 * @param {Number} ease the easing of following speed;
 * @default 0.7
 * @param {Object} pObj the parameters object;
 */
export class FollowEmitter extends Emitter {
  constructor(mouseTarget?: HTMLElement, ease?: EaseFunc, pObj?: any) {
    super(pObj);
    this.mouseTarget = Util.initValue(mouseTarget, window);
    this.ease = Util.initValue(ease, 0.7);
    this._allowEmitting = false;
    this.mouse = new Vector3D();
    this.initEventHandler();
  }
  initEventHandler() {
    var self = this;
    this.mousemoveHandler = function (e) {
      self.mousemove.call(self, e);
    };

    this.mousedownHandler = function (e) {
      self.mousedown.call(self, e);
    };

    this.mouseupHandler = function (e) {
      self.mouseup.call(self, e);
    };

    this.mouseTarget.addEventListener(
      "mousemove",
      this.mousemoveHandler,
      false
    );
  }

  /**
   * start emit particle
   * @method emit
   */
  emit() {
    this._allowEmitting = true;
  }

  /**
   * stop emiting
   * @method stopEmit
   */
  stopEmit() {
    this._allowEmitting = false;
  }

  setCameraAndCanvas(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
  }

  setCameraAndRenderer(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.canvas = renderer.domElement;
  }

  mousemove(e) {
    const rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var ratio = this.renderer ? this.renderer.getPixelRatio() : 1;
    x *= ratio;
    y *= ratio;

    this.mouse.x += (x - this.mouse.x) * this.ease;
    this.mouse.y += (y - this.mouse.y) * this.ease;

    this.p.copy(
      THREEUtil.toSpacePos(this.mouse, this.camera, this.canvas, this.renderer)
    );

    if (this._allowEmitting) {
      super.emit.call(this, "once");
    }
  }

  /**
   * Destory this Emitter
   * @method destroy
   */
  destroy() {
    super.destroy.call(this);
    this.mouseTarget.removeEventListener(
      "mousemove",
      this.mousemoveHandler,
      false
    );
  }
}
