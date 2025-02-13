// @ts-nocheck
import { Zone } from "./Zone";
import { THREEUtil } from "../utils/THREEUtil";
import { Vector3D } from '../math/Vector3D';
import { Camera, WebGLRenderer } from "three";
import { Particle } from "yiqianyao_particle/core";

/**
 * ScreenZone is a 3d line zone 屏幕区域的 zone
 * @param {Number|Vector3D} x1 - the line's start point of x value or a Vector3D Object
 * @param {Number|Vector3D} y1 - the line's start point of y value or a Vector3D Object
 * @param {Number} z1 - the line's start point of z value
 * @param {Number} x2 - the line's end point of x value
 * @param {Number} y2 - the line's end point of y value
 * @param {Number} z2 - the line's end point of z value
 * @example
 * var lineZone = new ScreenZone(0,0,0,100,100,0);
 * or
 * var lineZone = new ScreenZone(new Vector3D(0,0,0),new Vector3D(100,100,0));
 * @extends {Zone}
 * @constructor
 * camera 相机
 * renderer 渲染器
 * dis 超出屏幕边缘多少距离的时候 粒子死亡
 * dir 1234 分别代表:
 *  屏幕上边界 1
 *  屏幕右边界 2
 *  屏幕下边界 3
 *  屏幕左边界 4
 *
 * 屏幕坐标系为左上交，x 轴正方向为水平向右，y 轴正方向为垂直向下
 * (0, 0) ---- (1, 0)
 * |                |
 * |                |
 * |                |
 * (0, 1) ---- (1, 1)
 */
export class ScreenZone extends Zone {
  name: string;
  camera: Camera;
  renderer: WebGLRenderer;
  vec2 = new Vector3D();
  constructor(camera?: Camera, renderer?: WebGLRenderer, dis?: number, dir?: string) {
    super();
    this.camera = camera;
    this.renderer = renderer;
    this.dis = dis || 20;
    dir = dir || "1234";
    for (let i = 1; i < 5; i++) {
      this["d" + i] = dir.indexOf(i + "") >= 0;
    }

    this.name = "ScreenZone";
  }
  /**
   * 随机获取屏幕上的一个坐标位置
   * @returns {Vector3D}
   */
  getPosition() {
    const vec2 = this.vec2;
    const canvas = this.renderer.domElement;
    vec2.x = Math.random() * canvas.width;
    vec2.y = Math.random() * canvas.height;
    this.vector.copy(THREEUtil.toSpacePos(vec2, this.camera, canvas));
    return this.vector;
  };


  /**
   * particle 粒子超出屏幕区域的时候 设置为死亡状态
   * @param particle
   */
  _dead(particle: Particle) {
    const pos = THREEUtil.toScreenPos(particle.p, this.camera, this.renderer.domElement);
    const canvas = this.renderer.domElement;

    // 屏幕坐标系为左上交，x 轴正方向为水平向右，y 轴正方向为垂直向下
    if (pos.y + particle.radius < -this.dis && this.d1) { // 屏幕上边界 1
      particle.dead = true;
    } else if (pos.y - particle.radius > canvas.height + this.dis && this.d3) { // 屏幕下边界 3
      particle.dead = true;
    }

    if (pos.x + particle.radius < -this.dis && this.d4) { // 屏幕左边界 4
      particle.dead = true;
    } else if (pos.x - particle.radius > canvas.width + this.dis && this.d2) { // 屏幕右边界 2
      particle.dead = true;
    }
  }

  _cross (particle) {
    const vec2 = this.vec2;
    const pos = THREEUtil.toScreenPos(particle.p, this.camera, this.renderer.domElement);
    const canvas = this.renderer.domElement;

    if (pos.y + particle.radius < -this.dis) {
      vec2.x = pos.x;
      vec2.y = canvas.height + this.dis + particle.radius;
      particle.p.y = THREEUtil.toSpacePos(vec2, this.camera, canvas).y;
    } else if (pos.y - particle.radius > canvas.height + this.dis) {
      vec2.x = pos.x;
      vec2.y = -this.dis - particle.radius;
      particle.p.y = THREEUtil.toSpacePos(vec2, this.camera, canvas).y;
    }

    if (pos.x + particle.radius < -this.dis) {
      vec2.y = pos.y;
      vec2.x = canvas.width + this.dis + particle.radius;
      particle.p.x = THREEUtil.toSpacePos(vec2, this.camera, canvas).x;
    } else if (pos.x - particle.radius > canvas.width + this.dis) {
      vec2.y = pos.y;
      vec2.x = -this.dis - particle.radius;
      particle.p.x = THREEUtil.toSpacePos(vec2, this.camera, canvas).x;
    }
  };

  _bound(particle) {
    var pos = THREEUtil.toScreenPos(
      particle.p,
      this.camera,
      this.renderer.domElement
    );
    var canvas = this.renderer.domElement;

    if (pos.y + particle.radius < -this.dis) {
      particle.v.y *= -1;
    } else if (pos.y - particle.radius > canvas.height + this.dis) {
      particle.v.y *= -1;
    }

    if (pos.x + particle.radius < -this.dis) {
      particle.v.y *= -1;
    } else if (pos.x - particle.radius > canvas.width + this.dis) {
      particle.v.y *= -1;
    }
  }
}
