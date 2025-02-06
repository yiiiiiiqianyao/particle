import { Util } from "../utils/Util";
import { EULER } from "../core/constant";
import { Particle } from "../core/Particle";

export class Integration {
  type: string;
  constructor(type: string) {
    this.type = Util.initValue(type, EULER);
  }
  integrate(particle: Particle, time: number, damping: number) {
    this.euler(particle, time, damping);
  }

  euler(particle: Particle, time: number, damping: number) {
    if (!particle.sleep) {
      particle.old.p.copy(particle.p);
      particle.old.v.copy(particle.v);
      particle.a.scalar(1 / particle.mass);
      particle.v.add(particle.a.scalar(time));
      particle.p.add(particle.old.v.scalar(time));
      damping && particle.v.scalar(damping);
      particle.a.clear();
    }
  }
}
