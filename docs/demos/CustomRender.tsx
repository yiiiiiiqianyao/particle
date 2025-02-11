import {
  BoxZone,
  Color,
  CrossZone,
  CustomRender,
  Debug,
  ease,
  Emitter,
  Gravity,
  Life,
  Mass,
  Particle,
  Proton,
  Radius,
  Rate,
  Rotate,
  Scale,
  Span,
  Vector3D,
  Velocity,
} from 'yiqianyao_particle';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AmbientLight, PointLight, Scene, WebGLRenderer } from 'three';
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
    <div
      className="wrap"
      style={{ height: '500px', position: 'relative' }}
      ref={containerRef}
    />
  );
};

class SceneManager {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: THREE.PerspectiveCamera;
  proton!: Proton;
  control!: OrbitControls;

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

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: '#00ffcc' });
    const mesh = new THREE.Mesh(geometry, material);
    this.initLights(scene);

    const proton = new Proton();
    this.proton = proton;
    proton.addEmitter(this.createEmitter(scene, proton));

    const particleRenderer = new CustomRender();
    particleRenderer.onParticleCreated = (p: Particle) => {
      p.target = particleRenderer.targetPool.get(mesh);
      p.target.position.copy(p.p);
      scene.add(p.target);
    };

    particleRenderer.onParticleUpdate = (p: Particle) => {
      p.target.position.copy(p.p);
      p.target.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
      // 在初始化的时候 更新粒子的 scale
      const scale = p.scale * 35;
      p.target.scale.set(scale, scale, scale);
    };

    particleRenderer.onParticleDead = (p: Particle) => {
      particleRenderer.targetPool.expire(p.target);
      scene.remove(p.target);
      p.target = null;
    };

    proton.addRender(particleRenderer);
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton, control } = this;
    proton.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
    debug.renderInfo(proton, 3);
    control.update();
  };

  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }

  createEmitter(scene: Scene, proton: Proton) {
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(4, 8), new Span(0.2, 0.5));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(100));
    emitter.addInitialize(new Life(3, 6));
    emitter.addInitialize(new Velocity(400, new Vector3D(0, 1, 0), 60));

    emitter.addBehaviour(new Rotate('random', 'random'));
    emitter.addBehaviour(new Scale(1, 0.1));
    emitter.addBehaviour(new Gravity(6));

    const zone = new BoxZone(600);
    zone.friction = 0.95;
    zone.max = 7;
    emitter.addBehaviour(new CrossZone(zone, 'bound'));
    emitter.addBehaviour(
      new Color(0xff0000, 'random', Infinity, ease.easeOutQuart),
    );

    emitter.p.x = 0;
    emitter.p.y = 0;
    emitter.emit();
    debug.drawZone(proton, scene, zone);
    return emitter;
  }
}
