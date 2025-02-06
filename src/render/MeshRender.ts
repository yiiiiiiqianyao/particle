import * as THREE from "three";
import { BaseRender } from "./BaseRender";
import { Pool } from "../core/pool";
import { PUID } from "../utils/PUID";
import { Particle } from "../core/Particle";
export class MeshRender extends BaseRender {
  _targetPool: Pool;
  _materialPool: Pool;
  _body: any;
  container: any;
  constructor(container: THREE.Object3D) {
    super();
    this.container = container;

    this._targetPool = new Pool();
    this._materialPool = new Pool();
    this._body = new THREE.Mesh(
      new THREE.BoxGeometry(50, 50, 50),
      new THREE.MeshLambertMaterial({ color: "#ff0000" })
    );

    this.name = "MeshRender";
  }
  onProtonUpdate() { }
  onParticleCreated(particle: Particle) {
    if (!particle.target) {
      //set target
      if (!particle.body) particle.body = this._body;
      particle.target = this._targetPool.get(particle.body);

      //set material
      if (particle.useAlpha || particle.useColor) {
        particle.target.material.__puid = PUID.id(particle.body.material);
        particle.target.material = this._materialPool.get(
          particle.target.material
        );
      }
    }

    if (particle.target) {
      particle.target.position.copy(particle.p);
      this.container.add(particle.target);
    }
  }
  onParticleUpdate(particle: Particle) {
    if (particle.target) {
      particle.target.position.copy(particle.p);
      particle.target.rotation.set(
        particle.rotation.x,
        particle.rotation.y,
        particle.rotation.z
      );
      this.scale(particle);

      if (particle.useAlpha) {
        particle.target.material.opacity = particle.alpha;
        particle.target.material.transparent = true;
      }

      if (particle.useColor) {
        particle.target.material.color.copy(particle.color);
      }
    }
  }
  scale(particle: Particle) {
    particle.target.scale.set(particle.scale, particle.scale, particle.scale);
  }
  onParticleDead(particle: Particle) {
    if (particle.target) {
      if (particle.useAlpha || particle.useColor)
        this._materialPool.expire(particle.target.material);

      this._targetPool.expire(particle.target);
      this.container.remove(particle.target);
      particle.target = null;
    }
  }
}