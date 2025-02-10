import React, { useEffect, useRef } from 'react';
import {
  Alpha,
  Body,
  Color,
  CrossZone,
  Debug,
  FollowEmitter,
  Force,
  Life,
  Mass,
  Proton,
  Radius,
  Rate,
  Scale,
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
import { createSprite } from './utils';

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
    const emitter = new FollowEmitter();
    emitter.rate = new Rate(new Span(5, 7), new Span(0.01, 0.02));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Life(2));
    emitter.addInitialize(new Body(createSprite()));
    emitter.addInitialize(new Radius(40));
    emitter.addInitialize(new Velocity(200, new Vector3D(0, 0, -1), 0));

    emitter.addBehaviour(new Alpha(1, 0));
    emitter.addBehaviour(new Color("#4F1500", "#0029FF"));
    emitter.addBehaviour(new Scale(1, 0.5));
    emitter.addBehaviour(new CrossZone(new ScreenZone(camera, renderer), "dead"));

    emitter.addBehaviour(new Force(0, 0, -20));
    emitter.setCameraAndRenderer(camera, renderer);

    emitter.emit();

    proton.addEmitter(emitter);
    proton.addRender(new SpriteRender(scene));
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton } = this;
    proton.update();
    renderer.render(scene, camera);
    debug.renderInfo(proton, 3);
    requestAnimationFrame(this.animate);
  };

  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }
}
