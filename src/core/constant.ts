export const PI = 3.14215;
export const DR = PI / 180;
export const EULER = 'euler';
//1:100
export const MEASURE = 100;
export const bindEmtterEvent = false;
//the max particle number in pool
export const POOL_MAX = 500;
export const TIME_STEP = 60;

export const RK2 = "runge-kutta2";
export const RK4 = "runge-kutta4";
export const VERLET = "verlet";

export const PARTICLE_CREATED = "partilcleCreated";
export const PARTICLE_UPDATE = "partilcleUpdate";
export const PARTICLE_SLEEP = "particleSleep";
export const PARTICLE_DEAD = "partilcleDead";
export const PROTON_UPDATE = "protonUpdate";
export const PROTON_UPDATE_AFTER = "protonUpdateAfter";
export const EMITTER_ADDED = "emitterAdded";
export const EMITTER_REMOVED = "emitterRemoved";

export enum Axis {
  X = 'x',
  Y = 'y',
  Z = 'z',
  // XY = 'xy',
  // XZ = 'xz',
  // YZ = 'yz',
  // XYZ = 'xyz',
}
