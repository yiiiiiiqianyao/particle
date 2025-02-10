import { Vector3D } from "../math/Vector3D";
/**
 * Zone is a base class.
 * @constructor
 */
export class Zone {
  x!: number;
  y!: number;
  z!: number;
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
  getPosition(): any {
    return null;
  }

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

  _dead(particle: any) {}
  _bound(particle: any) {}
  _cross(particl: any) {}
}
