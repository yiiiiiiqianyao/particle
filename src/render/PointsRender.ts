import * as THREE from "three";
import { Particle } from "../core/Particle";
import { BaseRender } from "./BaseRender";
export class PointsRender extends BaseRender {
  points;
    constructor(ps: THREE.Mesh) {
      super();
      this.points = ps;
      this.name = "PointsRender";
    }
    onProtonUpdate() {};

    onParticleCreated(particle: Particle) {
      // TODO three js 更新后 points 的实现待更新
      // if (!particle.target) {
      //   particle.target = new THREE.Vector3();
      // }

      // particle.target.copy(particle.p);
      // this.points.geometry.vertices.push(particle.target);
    };

    onParticleUpdate(particle: Particle) {
      if (particle.target) {
        particle.target.copy(particle.p);
      }
    };

    onParticleDead(particle: Particle) {
      // TODO three js 更新后 points 的实现待更新
      // if (particle.target) {
      //   var index = this.points.geometry.vertices.indexOf(particle.target);
      //   if (index > -1) this.points.geometry.vertices.splice(index, 1);

      //   particle.target = null;
      // }
    };
  }
