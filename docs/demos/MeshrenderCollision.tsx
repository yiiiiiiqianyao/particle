import React, { useEffect, useRef } from 'react';
import {
  Body,
  Collision,
  Debug,
  Emitter,
  Gravity,
  Life,
  Mass,
  MeshRender,
  Proton,
  Radius,
  Rate,
  Scale,
  Span,
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
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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
    const geometry = new THREE.SphereGeometry(100.0, 24, 24);
    const sphereMaterial = new THREE.MeshLambertMaterial();
    const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);

    const proton = new Proton();
    this.proton = proton;
    var emitter = new Emitter();
    emitter.rate = new Rate(new Span(2, 5), new Span(.5, 1));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(100));
    emitter.addInitialize(new Life(5, 6));
    emitter.addInitialize(new Body(sphereMesh));
    emitter.addInitialize(new Velocity(new Span(300, 500), new Vector3D(0, 1, 0), 30));
    //emitter.addBehaviour(new Proton.Alpha(1, 0));
    emitter.addBehaviour(new Scale(1));
    emitter.addBehaviour(new Gravity(4));
    emitter.addBehaviour(new Collision(emitter));
    emitter.emit();
    proton.addEmitter(emitter);
    proton.addRender(new MeshRender(scene));

    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton, control } = this;
    proton.update();
    renderer.render(scene, camera);
    control.update();
    requestAnimationFrame(this.animate);
  }



  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }
}
