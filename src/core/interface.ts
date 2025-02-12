import { Behaviour } from "yiqianyao_particle/Behaviour";
import { EaseFunc } from "yiqianyao_particle/ease/ease";
import { Emitter } from "yiqianyao_particle/emitter";
import { Vector3D } from "yiqianyao_particle/math";

export interface IParticle {
  id: string;
  name?: string;
  life?: number;
  age?: number;
  energy?: number;
  old?: any;
  a?: Vector3D; // 加速度 acceleration
  v?: Vector3D; // 速度 velocity
  p?: Vector3D; // 位置
  mass?: number;
  target?: any;
  radius?: number; // 粒子的半径
  scale?: number;
  rotation?: Vector3D;
  transform?: any;
  useAlpha?: any;
  color?: any;
  useColor?: any;
  behaviours?: Behaviour[];
  body?: any;
  sleep?: boolean;
  alpha?: number;
  dead?: boolean; // 粒子是否死亡
  parent?: Emitter | null; // 父级是粒子发射器 setupParticle 的时候设置
  easing?: EaseFunc;
}
