import React, { useEffect, useRef } from 'react';
import {
  Alpha,
  Attraction,
  Body,
  Color,
  CrossZone,
  Debug,
  Emitter,
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
import { createSprite } from './utils';

const R = 70;
let tha = 0;
let ctha = 0;
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
  proton!: Proton;
  emitter1!: Emitter;
  emitter2!: Emitter

  constructor(wrap: HTMLDivElement) {
    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0xffffff, 1, 10000);
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
    // this.initPlane(scene);

    const proton = new Proton();
    this.proton = proton;
    const emitter1 = this.createEmitter(R, 0, '#4F1500', '#0029FF', camera, renderer);
    this.emitter1 = emitter1;
    const emitter2 = this.createEmitter(-R, 0, '#004CFE', '#6600FF', camera, renderer);
    this.emitter2 = emitter2;
    proton.addEmitter(emitter1);
    proton.addEmitter(emitter2);
    proton.addRender(new SpriteRender(scene));

    Debug.drawEmitter(proton, scene, emitter1);
    Debug.drawEmitter(proton, scene, emitter2);
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton, emitter1, emitter2 } = this;
    tha += .13;
    emitter1.p.x = R * Math.cos(tha);
    emitter1.p.y = R * Math.sin(tha);
    emitter2.p.x = R * Math.cos(tha + Math.PI / 2);
    emitter2.p.y = R * Math.sin(tha + Math.PI / 2);

    proton.update();
    renderer.render(scene, camera);

    camera.lookAt(scene.position);
    ctha += .02;
    camera.position.x = Math.sin(ctha) * 500;
    camera.position.z = Math.cos(ctha) * 500;
    camera.position.y = Math.sin(ctha) * 500;
    requestAnimationFrame(this.animate);
  };

  createEmitter(x: number, y: number, color1: string, color2: string, camera: THREE.Camera, renderer: WebGLRenderer) {
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(5, 7), new Span(.01, .02));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Life(2));
    emitter.addInitialize(new Body(createSprite()));
    emitter.addInitialize(new Radius(80));
    emitter.addInitialize(new Velocity(200, new Vector3D(0, 0, -1), 0));

    emitter.addBehaviour(new Alpha(1, 0));
    emitter.addBehaviour(new Color(color1, color2));
    emitter.addBehaviour(new Scale(1, 0.5));
    emitter.addBehaviour(new CrossZone(new ScreenZone(camera, renderer), 'dead'));
    emitter.addBehaviour(new Force(0, 0, -20));
    // emitter.addBehaviour(new Attraction(new Vector3D(0, 0, 0), 5, 250));
    emitter.p.x = x;
    emitter.p.y = y;
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
