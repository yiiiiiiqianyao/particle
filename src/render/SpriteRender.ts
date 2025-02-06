import * as THREE from "three";
import { MeshRender } from "./MeshRender";
import { Particle } from "../core/Particle.js";

export class SpriteRender extends MeshRender{
  constructor(container: THREE.Object3D) {
    super(container);

    this._body = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffff }));
    this.name = "SpriteRender";
  }
  
  scale(particle: Particle) {
    particle.target.scale.set(
      particle.scale * particle.radius,
      particle.scale * particle.radius,
      1
    );
  }
}

