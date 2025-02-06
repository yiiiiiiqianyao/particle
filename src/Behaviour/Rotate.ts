// @ts-nocheck
import { Behaviour } from './Behaviour';
import { PI, DR } from '../core/constant';
import { createSpan } from '../math/Span';
import { MathUtils } from '../math/MathUtils';
import { Vector3D } from '../math/Vector3D';
import { EaseFunc } from '../ease/ease';
/* The Rotate class is the base
 * for the other Behaviour
 *
 * @class Behaviour * @constructor
 * @example new Proton.Rotate(createSpan(-1,1),createSpan(-1,1),createSpan(-1,1));
 * @example new Proton.Rotate();
 * @example new Proton.Rotate("random");
 */

export class Rotate extends Behaviour {
  constructor(x, y, z?: any, life?: number, easing?: EaseFunc) {
    super(life, easing);
    this.reset(x, y, z);
    this.name = "Rotate";
  }
  reset(a, b, c, life, easing) {
    this.a = a || 0;
    this.b = b || 0;
    this.c = c || 0;

    if (a === undefined || a === "same") {
      this._type = "same";
    } else if (b === undefined) {
      this._type = "set";
    } else if (c === undefined) {
      this._type = "to";
    } else {
      this._type = "add";
      this.a = createSpan(this.a * DR);
      this.b = createSpan(this.b * DR);
      this.c = createSpan(this.c * DR);
    }

    life && super.reset.call(this, life, easing);
  }
  initialize = function (particle) {
    switch (this._type) {
      case "same":
        break;

      case "set":
        this._setRotation(particle.rotation, this.a);
        break;

      case "to":
        particle.transform.fR = particle.transform.fR || new Vector3D();
        particle.transform.tR = particle.transform.tR || new Vector3D();
        this._setRotation(particle.transform.fR, this.a);
        this._setRotation(particle.transform.tR, this.b);
        break;

      case "add":
        particle.transform.addR = new Vector3D(
          this.a.getValue(),
          this.b.getValue(),
          this.c.getValue()
        );
        break;
    }
  };
  _setRotation = function (vec3, value) {
    vec3 = vec3 || new Vector3D();
    if (value === "random") {
      var x = MathUtils.randomAToB(-PI, PI);
      var y = MathUtils.randomAToB(-PI, PI);
      var z = MathUtils.randomAToB(-PI, PI);
      vec3.set(x, y, z);
    } else if (value instanceof Vector3D) {
      vec3.copy(value);
    }
  };
  applyBehaviour(particle, time, index) {
    super.applyBehaviour.call(this, particle, time, index);
    switch (this._type) {
      case "same":
        if (!particle.rotation) particle.rotation = new Vector3D();
        particle.rotation.eulerFromDir(particle.v);
        //http://stackoverflow.com/questions/21622956/how-to-convert-direction-vector-to-euler-angles
        //console.log(particle.rotation);
        break;

      case "set":
        //
        break;

      case "to":
        particle.rotation.x = MathUtils.lerp(
          particle.transform.fR.x,
          particle.transform.tR.x,
          this.energy
        );
        particle.rotation.y = MathUtils.lerp(
          particle.transform.fR.y,
          particle.transform.tR.y,
          this.energy
        );
        particle.rotation.z = MathUtils.lerp(
          particle.transform.fR.z,
          particle.transform.tR.z,
          this.energy
        );
        break;
      case "add":
        particle.rotation.add(particle.transform.addR);
        break;
    }
  }
}