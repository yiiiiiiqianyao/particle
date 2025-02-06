// @ts-nocheck
import * as THREE from "three";
import { PointZone } from "../zone/PointZone";
import { LineZone } from "../zone/LineZone";
import { BoxZone } from "../zone/BoxZone";
import { SphereZone } from "../zone/SphereZone";
import { MeshZone } from "../zone/MeshZone";
import { Proton } from "../core";
import { Emitter } from "../emitter/Emitter";
import { Color } from "../Behaviour/Color";

export class Debug {
  static addEventListener(proton: Proton, fun: Function) {
    proton.addEventListener("PROTON_UPDATE", function (e) {
      fun(e);
    });
  }

  static drawZone(proton: Proton, container, zone) {
    var geometry, material, mesh;

    if (zone instanceof PointZone) {
      geometry = new THREE.SphereGeometry(15);
    } else if (zone instanceof LineZone) {
    } else if (zone instanceof BoxZone) {
      geometry = new THREE.BoxGeometry(zone.width, zone.height, zone.depth);
    } else if (zone instanceof SphereZone) {
      geometry = new THREE.SphereGeometry(zone.radius, 10, 10);
    } else if (zone instanceof MeshZone) {
      // THREE.Geometry => THREE.BufferGeometry 在 Three.js 较新的版本中，Geometry 已被弃用，取而代之的是 BufferGeometry
      if (zone.geometry instanceof THREE.BufferGeometry)
        geometry = zone.geometry;
      else geometry = zone.geometry.geometry;

      geometry = new THREE.SphereGeometry(zone.radius, 10, 10);
    }

    material = new THREE.MeshBasicMaterial({
      color: "#2194ce",
      wireframe: true,
    });
    mesh = new THREE.Mesh(geometry, material);
    container.add(mesh);

    this.addEventListener(proton, function (e) {
      mesh.position.set(zone.x, zone.y, zone.z);
    });
  }

  static drawEmitter(proton: Proton, container: any, emitter: Emitter, color?: Color) {
    var geometry = new THREE.OctahedronGeometry(15);
    var material = new THREE.MeshBasicMaterial({
      color: color || "#aaa",
      wireframe: true,
    });
    var mesh = new THREE.Mesh(geometry, material);
    container.add(mesh);

    this.addEventListener(proton, function () {
      mesh.position.copy(emitter.p);
      mesh.rotation.set(
        emitter.rotation.x,
        emitter.rotation.y,
        emitter.rotation.z
      );
    });
  }

  static renderInfo(proton: Proton, style: any) {
    function getCreatedNumber(proton: Proton, type) {
      var pool = type === "material" ? "_materialPool" : "_targetPool";
      var renderer = proton.renderers[0];
      return renderer[pool].cID;
    }

    function getEmitterPos(proton: Proton) {
      var e = proton.emitters[0];
      return (
        Math.round(e.p.x) + "," + Math.round(e.p.y) + "," + Math.round(e.p.z)
      );
    }

    this.addInfo(style);
    var str = "";
    switch (this._infoType) {
      case 2:
        str += "emitter:" + proton.emitters.length + "<br>";
        str += "em speed:" + proton.emitters[0].cID + "<br>";
        str += "pos:" + getEmitterPos(proton);
        break;

      case 3:
        str += proton.renderers[0].name + "<br>";
        str += "target:" + getCreatedNumber(proton, "target") + "<br>";
        str += "material:" + getCreatedNumber(proton, "material");
        break;

      default:
        str += "particles:" + proton.getCount() + "<br>";
        str += "pool:" + proton.pool.getCount() + "<br>";
        str += "total:" + (proton.getCount() + proton.pool.getCount());
    }
    this._infoCon.innerHTML = str;
  }

  static addInfo(style: any) {
    var self = this;
    if (!this._infoCon) {
      this._infoCon = document.createElement("div");
      this._infoCon.style.cssText = [
        "position:fixed;bottom:0px;left:0;cursor:pointer;",
        "opacity:0.9;z-index:10000;padding:10px;font-size:12px;",
        "width:120px;height:50px;background-color:#002;color:#0ff;",
      ].join("");

      this._infoType = 1;
      this._infoCon.addEventListener(
        "click",
        function (event) {
          self._infoType++;
          if (self._infoType > 3) self._infoType = 1;
        },
        false
      );

      var bg, color;
      switch (style) {
        case 2:
          bg = "#201";
          color = "#f08";
          break;

        case 3:
          bg = "#020";
          color = "#0f0";
          break;

        default:
          bg = "#002";
          color = "#0ff";
      }

      this._infoCon.style["background-color"] = bg;
      this._infoCon.style["color"] = color;
    }

    if (!this._infoCon.parentNode) document.body.appendChild(this._infoCon);
  }
};
