import { Proton } from "../core";
import { Particle } from "../core/Particle";

export class BaseRender {
  name: string;
  proton!: Proton | null;
  constructor() {
    this.name = "BaseRender";
  }
  init (proton: Proton) {
    var self = this;
    this.proton = proton;

    this.proton.addEventListener("PROTON_UPDATE", function (proton: Particle) {
      self.onProtonUpdate.call(self, proton);
    });

    this.proton.addEventListener("PARTICLE_CREATED", function (particle: Particle) {
      self.onParticleCreated.call(self, particle);
    });

    this.proton.addEventListener("PARTICLE_UPDATE", function (particle: Particle) {
      self.onParticleUpdate.call(self, particle);
    });

    this.proton.addEventListener("PARTICLE_DEAD", function (particle: Particle) {
      self.onParticleDead.call(self, particle);
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