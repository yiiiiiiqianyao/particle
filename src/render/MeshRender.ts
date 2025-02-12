import * as THREE from "three";
import { BaseRender } from "./BaseRender";
import { Pool } from "../core/pool";
import { PUID } from "../utils/PUID";
import { Particle } from "../core/Particle";
export class MeshRender extends BaseRender {
  _targetPool: Pool;
  _materialPool: Pool;
  _body!: THREE.Mesh;
  container: any;
  constructor(container: THREE.Object3D) {
    super();
    this.container = container;

    this._targetPool = new Pool();
    this._materialPool = new Pool();
    this.name = "MeshRender";
  }

  getDefaultBody() {
    if(!this._body) {
      this._body = new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, 50),
        new THREE.MeshLambertMaterial({ color: "#ff0000" })
      );
    }
    return this._body;
  }
  onProtonUpdate() { }
  onParticleCreated(particle: Particle) {
    if (!particle.target) {
      //set target
      if (!particle.body) {
        particle.body = this.getDefaultBody();
      }
      particle.target = this._targetPool.get(particle.body) as THREE.Mesh;

      //set material
      if (particle.useAlpha || particle.useColor) {
        const target = particle.target as THREE.Mesh;
        // @ts-ignore
        target.material.__puid = PUID.id(particle.body.material);
        target.material = this._materialPool.get(target.material);
      }
    }

    if (particle.target) {
      particle.target.position.copy(particle.p);
      this.container.add(particle.target);
    }
  }
  onParticleUpdate(particle: Particle) {
    if (particle.target) {
      const target = particle.target as THREE.Mesh;
      target.position.copy(particle.p);
      target.rotation.set(
        particle.rotation.x,
        particle.rotation.y,
        particle.rotation.z
      );
      this.scale(particle);
      const materials = Array.isArray(target.material) ? target.material : [target.material];
      if (particle.useAlpha) {
        materials.forEach((m) => {
          m.opacity = particle.alpha;
          m.transparent = true;
        })
      }

      if (particle.useColor) {
        materials.forEach((m) => {
          // @ts-ignore
          m?.color.copy(particle.color);
        })
      }
    }
  }
  scale(particle: Particle) {
    particle.target!.scale.set(particle.scale, particle.scale, particle.scale);
  }
  onParticleDead(particle: Particle) {
    if (particle.target) {
      const target = particle.target as THREE.Mesh;
      if (particle.useAlpha || particle.useColor) {
        this._materialPool.expire(target.material);
      }
      this._targetPool.expire(target);
      this.container.remove(target);
      particle.target = null;
    }
  }
}
