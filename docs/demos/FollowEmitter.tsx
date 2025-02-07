import React, { useEffect, useRef } from 'react';
import {
  Alpha,
  Body,
  BoxZone,
  Color,
  CrossZone,
  Debug,
  Emitter,
  FollowEmitter,
  Force,
  Gravity,
  Life,
  Mass,
  MeshRender,
  Position,
  Proton,
  Radius,
  Rate,
  Rotate,
  Scale,
  ScreenZone,
  Span,
  SpriteRender,
  Vector3D,
  Velocity,
} from 'particle';
import * as THREE from 'three';
import {
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createSprite } from './utils';

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const sceneManager = new SceneManager(containerRef.current);
    return () => {
      // 清理操作
      containerRef.current?.removeChild(sceneManager.renderer.domElement);
    };
  }, []);
  return (
    <div className="wrap" style={{ height: '500px' }} ref={containerRef} />
  );
};

class SceneManager {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: THREE.PerspectiveCamera;
  control: OrbitControls;
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
    this.initPlane(scene);

    const proton = new Proton();
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
    const { renderer, scene, camera, control, proton } = this;
    proton.update();
    renderer.render(scene, camera);
    control.update();
    requestAnimationFrame(this.animate);
  };

  createEmitter(obj: any) {
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(5, 10), new Span(0.1, 0.25));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(10));
    emitter.addInitialize(new Life(2, 4));
    emitter.addInitialize(new Body(obj.Body));
    emitter.addInitialize(new Position(new BoxZone(100)));
    emitter.addInitialize(new Velocity(200, new Vector3D(0, 1, 1), 30));

    emitter.addBehaviour(new Rotate('random', 'random'));
    emitter.addBehaviour(new Scale(1, 0.1));
    // Gravity
    emitter.addBehaviour(new Gravity(3));
    emitter.p.x = obj.p.x;
    emitter.p.y = obj.p.y;
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

  initPlane(scene: Scene) {
    const groundGeo = new PlaneGeometry(10000, 10000);
    const groundMat = new MeshPhongMaterial({
      color: 0xffffff,
    });
    groundMat.color.setHSL(0.095, 1, 0.75);

    const ground = new Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -200;
    scene.add(ground);
  }

  createMesh(geoType: 'sphere' | 'cube') {
    if (geoType == 'sphere') {
      const geometry = new SphereGeometry(10, 8, 8);
      const material = new MeshPhongMaterial({
        color: '#ff0000',
      });
      return new Mesh(geometry, material);
    } else {
      const geometry = new BoxGeometry(20, 20, 20);
      const material = new MeshPhongMaterial({
        color: '#00ffcc',
      });
      return new Mesh(geometry, material);
    }
  }
}
