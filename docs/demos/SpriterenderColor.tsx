import React, { useEffect, useRef } from 'react';
import {
  Alpha,
  Body,
  Color,
  Debug,
  ease,
  Emitter,
  Life,
  Mass,
  Position,
  Proton,
  Radius,
  Rate,
  Scale,
  ScreenZone,
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

    const proton = new Proton();
    this.proton = proton;
    proton.addEmitter(this.createEmitter(camera, renderer));
    proton.addRender(new SpriteRender(scene));
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton } = this;
    proton.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
    Debug.renderInfo(proton, 3)
  }

  createEmitter(camera: THREE.Camera, renderer: WebGLRenderer) {
    const colors = ['#529B88', '#CDD180', '#FFFA32', '#FB6255', '#FB4A53', '#FF4E50', '#F9D423'];
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(3, 6), new Span(.05, .2));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(200, 400));
    emitter.addInitialize(new Life(2, 4));
    emitter.addInitialize(new Body(createSprite()));
    emitter.addInitialize(new Position(new ScreenZone(camera, renderer)));
    emitter.addBehaviour(new Alpha(0, 1, Infinity, ease.easeOutCubic));
    emitter.addBehaviour(new Scale(2, 0, Infinity, ease.easeOutCubic));
    emitter.addBehaviour(new Color(colors, 'random'));
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
