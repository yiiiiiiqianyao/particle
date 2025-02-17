import { Util } from "../utils/Util";
import { EULER } from "../core/constant";
import { Particle } from "../core/Particle";

/**
 * Euler Integration 欧拉积分 是一种用于数值求解粒子运动方程的方法
 * or 显式欧拉方法更新（Explicit Euler Method Update）
 * 使用欧拉积分方法更新粒子的速度和位置，同时简单地对粒子的大小和角度进行匀速更新。
 */
export class Integration {
  type: string;
  constructor(type: string) {
    this.type = Util.initValue(type, EULER);
  }
  integrate(particle: Particle, deltaTime: number, damping: number) {
    this.euler(particle, deltaTime, damping);
  }

  euler(particle: Particle, deltaTime: number, damping: number) {
    if (!particle.sleep) {
      particle.old.p.copy(particle.p);
      particle.old.v.copy(particle.v);
      /**
       * a = F / m
       * 1. 粒子在执行 integrate 先执行了 applyBehaviour, 设置了一个 force
       * 2. 粒子在 integrate 执行了 euler => 执行了 a = F / m 计算出对应的加速度 a
       * 3. 粒子在 integrate 执行了 euler => 执行了 v = v + a * deltaTime 计算出对应的速度 v
       * 4. 粒子在 integrate 执行了 euler => 执行了 p = p + v * deltaTime 计算出对应的位置 p
       * 5. 粒子在 integrate 执行了 euler => 执行了 damping 计算出对应的阻尼 damping
       * 6. 粒子在 integrate 执行了 euler => 执行了 a.clear 清空对应的加速度 a
       */
      particle.a.scalar(1 / particle.mass);
      particle.v.add(particle.a.scalar(deltaTime));
      particle.p.add(particle.old.v.scalar(deltaTime));
      damping && particle.v.scalar(damping);
      particle.a.clear();
    }
  }
}
