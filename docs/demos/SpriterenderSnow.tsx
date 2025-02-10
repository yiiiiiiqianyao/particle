import React, { useEffect, useRef } from 'react';
import {
  Body,
  BoxZone,
  CrossZone,
  Debug,
  Emitter,
  Gravity,
  Life,
  Mass,
  Position,
  Proton,
  Radius,
  RandomDrift,
  Rate,
  Rotate,
  ScreenZone,
  Span,
  SpriteRender,
  Vector3D,
  Velocity,
} from 'yiqianyao_particle';
import * as THREE from 'three';
import {
  AmbientLight,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';
import Snow from '../assets/snow.png';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const debug = new Debug();

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    debug.setParentNode(containerRef.current);
    const sceneManager = new SceneManager(containerRef.current);
    return () => {
      // 清理操作
      containerRef.current?.removeChild(sceneManager.renderer.domElement);
    };
  }, []);
  return (
    <div className="wrap" style={{ height: '500px', position: 'relative' }} ref={containerRef} />
  );
};

class SceneManager {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: THREE.PerspectiveCamera;
  proton!: Proton;
  control: OrbitControls;
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
    const control = new OrbitControls(camera, wrap);
    this.control = control;
    control.update();

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer = renderer;
    renderer.setSize(rect.width, rect.height);
    wrap.appendChild(renderer.domElement);

    this.initLights(scene);

    const proton = new Proton();
    this.proton = proton;
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(34, 48), new Span(.2, .5));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(new Span(10, 20)));

    const position = new Position();
    position.addZone(new BoxZone(2500, 10, 2500));
    emitter.addInitialize(position);

    emitter.addInitialize(new Life(5, 10));
    emitter.addInitialize(new Body(this.createSnow()));
    emitter.addInitialize(new Velocity(0, new Vector3D(0, -1, 0), 90));

    emitter.addBehaviour(new RandomDrift(10, 1, 10, .05));
    emitter.addBehaviour(new Rotate("random", "random"));
    emitter.addBehaviour(new Gravity(2));

    const screenZone = new ScreenZone(camera, renderer, 20, "234");
    emitter.addBehaviour(new CrossZone(screenZone, "dead"));

    emitter.p.x = 0;
    emitter.p.y = 800;
    emitter.emit();

    proton.addEmitter(emitter);
    proton.addRender(new SpriteRender(scene));
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton, control } = this;
    proton.update();
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
    debug.renderInfo(proton, 3)
  }
  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }

  createSnow() {
    const map = new THREE.TextureLoader().load(Snow);
    const material = new THREE.SpriteMaterial({
        map: map,
        transparent: true,
        opacity: .5,
        color: 0xffffff
    });
    return new THREE.Sprite(material);
  }
}
