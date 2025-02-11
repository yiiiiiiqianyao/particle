import { Proton } from "../core";
import { Particle } from "../core/Particle";

/**
 * The BaseRender class is the base for the other Render
 * render 类控制粒子的渲染表现（如材质、缩放等），并支持在每帧进行作用
 */
export class BaseRender {
  name: string;
  proton!: Proton | null;
  constructor() {
    this.name = "BaseRender";
  }
  init(proton: Proton) {
    this.proton = proton;
    proton.addEventListener("PROTON_UPDATE", (proton: Particle) => {
      this.onProtonUpdate(proton);
    });

    proton.addEventListener("PARTICLE_CREATED", (particle: Particle) => {
      this.onParticleCreated(particle);
    });

    proton.addEventListener("PARTICLE_UPDATE", (particle: Particle) => {
      this.onParticleUpdate(particle);
    });

    proton.addEventListener("PARTICLE_DEAD", (particle: Particle) => {
      this.onParticleDead(particle);
    });
  }

  remove (proton: Proton) {
    // this.proton.removeEventListener("PROTON_UPDATE", this.onProtonUpdate);
    // this.proton.removeEventListener("PARTICLE_CREATED", this.onParticleCreated);
    // this.proton.removeEventListener("PARTICLE_UPDATE", this.onParticleUpdate);
    // this.proton.removeEventListener("PARTICLE_DEAD", this.onParticleDead);
    this.proton = null;
  }

  onParticleCreated (particle: any) {}

  onParticleUpdate (particle: any) {}

  onParticleDead (particle: any) {}

  onProtonUpdate (proton: any) {}
}
