import React, { useEffect, useRef } from 'react';
import {
  Body,
  Color,
  Debug,
  Emitter,
  Gravity,
  Life,
  Mass,
  MeshZone,
  Position,
  Proton,
  Radius,
  RandomDrift,
  Rate,
  Span,
  SpriteRender,
} from 'yiqianyao_particle';
import * as THREE from 'three';
import {
  AmbientLight,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';
import { createSprite } from './utils';

let randomBehaviour: RandomDrift;
let gravity: Gravity;

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const sceneManager = new SceneManager(containerRef.current);
    containerRef.current.appendChild(Debug._infoCon);
    return () => {
      // 清理操作
      containerRef.current?.removeChild(sceneManager.renderer.domElement);
    };
  }, []);
  return (
    <div className="wrap" style={{ height: '500px', position: 'relative' }} ref={containerRef} />
  );
};
let tha = 0;
class SceneManager {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: THREE.PerspectiveCamera;
  proton!: Proton;

  constructor(wrap: HTMLDivElement) {
    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0x000000);
    const rect = wrap.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(
      70,
      rect.width / rect.height,
      1,
      10000,
    );
    camera.position.z = 500;
    this.camera = camera;


    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer = renderer;
    renderer.setSize(rect.width, rect.height);
    wrap.appendChild(renderer.domElement);

    this.initLights(scene);

    const geometry = new THREE.SphereGeometry(1, 24, 24);
    const sphereMaterial = new THREE.MeshLambertMaterial();
    const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);

    const proton = new Proton();
    this.proton = proton;
    proton.addEmitter(this.createEmitter(sphereMesh));
    proton.addRender(new SpriteRender(scene));
    this.addMouseEvent();
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton } = this;
    proton.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
  }

  addMouseEvent() {
    var index = 0;
    window.addEventListener("mousedown", function (e) {
        index++;
        if (index % 3 == 1) {
            randomBehaviour.reset(2, 0, 0.2);
            gravity.reset(3.5);
        } else if (index % 3 == 2) {
            randomBehaviour.reset(10, 10, 10);
            gravity.reset(0);
        } else {
            randomBehaviour.reset(2, 2, 2);
            gravity.reset(0);
        }
    });
  }

  createEmitter(mesh: THREE.Object3D) {
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(11, 15), new Span(0.02));
    //addInitialize
    emitter.addInitialize(new Position(new MeshZone(mesh, 200)));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(26, 50));
    emitter.addInitialize(new Life(1.5));
    emitter.addInitialize(new Body(createSprite()));

    //addBehaviour
    randomBehaviour = new RandomDrift(2, 2, 2);
    gravity = new Gravity(0);
    // @ts-ignore
    emitter.addBehaviour(this.customScaleBehaviour());
    emitter.addBehaviour(gravity);
    emitter.addBehaviour(randomBehaviour);
    emitter.addBehaviour(new Color(["#00aeff", "#0fa954", "#54396e", "#e61d5f"]));
    emitter.addBehaviour(new Color("random"));

    emitter.p.x = 0;
    emitter.p.y = 0;
    emitter.emit();

    return emitter;
  }

  customScaleBehaviour() {
    return {
        initialize: function (particle: any) {
            particle.oldRadius = particle.radius;
            particle.scale = 0;
        },
        applyBehaviour: function (particle: any) {
            if (particle.energy >= 2 / 3) {
                particle.scale = (1 - particle.energy) * 3;
            } else if (particle.energy <= 1 / 3) {
                particle.scale = particle.energy * 3;
            }
            particle.radius = particle.oldRadius * particle.scale;
        }
    };
  }

  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }
}
