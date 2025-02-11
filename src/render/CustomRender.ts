import { BaseRender } from "./BaseRender";
import { Pool } from "../core/pool";
import { Particle } from "../core/Particle";
export class CustomRender extends BaseRender {
  targetPool: Pool;
  materialPool: Pool;
  constructor() {
    super();
    this.targetPool = new Pool();
    this.materialPool = new Pool();

    this.name = "CustomRender";
  }
  onProtonUpdate() { };
  onParticleCreated(particle: Particle) { };
  onParticleUpdate(particle: Particle) { };
  onParticleDead(particle: Particle) { };
}
