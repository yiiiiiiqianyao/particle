import { Vector3D } from "../math/Vector3D";
import { Particle } from "yiqianyao_particle/core";
/**
 * Zone is a base class.
 * @constructor
 */
export class Zone {
  x!: number;
  y!: number;
  z!: number;
  friction!: number;
  vector: Vector3D;
  random: number;
  radius!: number;
  crossType: string;
  log: boolean;
  geometry: any;
  constructor() {
    this.vector = new Vector3D(0, 0, 0);
    this.random = 0;
    this.crossType = "dead";
    this.log = true;
  }
  getPosition(): Vector3D | null { return null };

  crossing(particle: any) {
    switch (this.crossType) {
      case "bound":
        this._bound(particle);
        break;
      case "cross":
        this._cross(particle);
        break;
      case "dead":
        this._dead(particle);
        break;
    }
  }

  /**
   * particle 粒子是否还在 zone 的区域内
   * @param particle
   */
  _dead(particle: Particle) {}
  /**
   * 粒子在 zone 所在的包围盒内 运动速度按照摩擦系数衰减
   * @param particle
   */
  _bound(particle: Particle) {}
  _cross(particle: Particle) {}
}
