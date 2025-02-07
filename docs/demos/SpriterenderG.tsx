import React, { useEffect, useRef } from 'react';
import {
  Body,
  Color,
  Debug,
  ease,
  Emitter,
  Gravity,
  Life,
  Mass,
  Position,
  Proton,
  RandomDrift,
  Rate,
  Scale,
  Span,
  SphereZone,
  SpriteRender,
  Vector3D,
  Velocity,
} from 'particle';
import * as THREE from 'three';
import {
  AmbientLight,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';
import { createSprite } from './utils';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const sceneManager = new SceneManager(containerRef.current);
    Debug?._infoCon && containerRef.current.appendChild(Debug._infoCon);
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
    proton.addEmitter(this.createEmitter());
    proton.addRender(new SpriteRender(scene));
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton, control } = this;
    proton.update();
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
    Debug.renderInfo(proton, 3)
  }

  createEmitter() {
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(10, 15), new Span(.05, .1));
    emitter.addInitialize(new Body(createSprite()));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Life(1, 3));
    emitter.addInitialize(new Position(new SphereZone(20)));
    emitter.addInitialize(new Velocity(new Span(500, 800), new Vector3D(0, 1, 0), 30));
    emitter.addBehaviour(new RandomDrift(10, 10, 10, .05));
    emitter.addBehaviour(new Scale(new Span(2, 3.5), 0));
    emitter.addBehaviour(new Gravity(6));
    emitter.addBehaviour(new Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, ease.easeOutSine));
    emitter.p.x = 0;
    emitter.p.y = -150;
    emitter.emit();
    return emitter;
}

  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }
}
