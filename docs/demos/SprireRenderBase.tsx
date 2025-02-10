import React, { useEffect, useRef } from 'react';
import {
  Alpha,
  Body,
  BoxZone,
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
  Rotate,
  Scale,
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
import { createSprite } from './utils';

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


    const proton = new Proton();
    this.proton = proton;

    proton.addEmitter(this.createEmitter());
    proton.addRender(new SpriteRender(scene));
    const zone2 = new BoxZone(400);
    Debug.drawZone(proton, scene, zone2);

    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton } = this;
    proton.update();
    renderer.render(scene, camera);
    tha += .02;
    camera.lookAt(scene.position);
    camera.position.x = Math.sin(tha) * 500;
    camera.position.z = Math.cos(tha) * 500;
    requestAnimationFrame(this.animate);

  }

  createEmitter() {
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(5, 10), new Span(.1, .25));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(100));
    emitter.addInitialize(new Life(2, 4));
    emitter.addInitialize(new Body(createSprite()));
    emitter.addInitialize(new Position(new BoxZone(100)));
    emitter.addInitialize(new Velocity(200, new Vector3D(0, 1, 1), 180));
    emitter.addBehaviour(new Rotate("random", "random"));
    emitter.addBehaviour(new Scale(1, 0.5));
    emitter.addBehaviour(new Alpha(1, 0, Infinity, ease.easeInQuart));
    emitter.addBehaviour(new Color(0xff0000, 'random', Infinity, ease.easeOutQuart));
    emitter.p.x = 0;
    emitter.p.y = 0;
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
