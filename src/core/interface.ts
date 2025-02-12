import { Object3D } from "three";
import { Behaviour } from "yiqianyao_particle/Behaviour";
import { EaseFunc } from "yiqianyao_particle/ease/ease";
import { Vector3D } from "yiqianyao_particle/math";

export interface IParticle {
  life?: number;
  age?: number;
  energy?: number;
  mass?: number;
  target?: Object3D;
  radius?: number; // 粒子的半径
  scale?: number;
  rotation?: Vector3D;
  transform?: any;
  useAlpha?: any;
  color?: any;
  useColor?: any;
  behaviours?: Behaviour[];
  sleep?: boolean;
  alpha?: number;
  dead?: boolean; // 粒子是否死亡
  easing?: EaseFunc;
}
