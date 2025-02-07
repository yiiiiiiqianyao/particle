import { Util } from "../utils/Util";
import { EULER } from "../core/constant";
import { Particle } from "../core/Particle";

/**
 * Euler Integration 欧拉积分
 * or 显式欧拉方法更新（Explicit Euler Method Update）
 * 使用欧拉积分方法更新粒子的速度和位置，同时简单地对粒子的大小和角度进行匀速更新。
 */
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
