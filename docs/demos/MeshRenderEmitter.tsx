import React, { useEffect, useRef } from 'react';
import {
  Body,
  BoxZone,
  Color,
  Debug,
  ease,
  Emitter,
  Life,
  Mass,
  MeshRender,
  Proton,
  Radius,
  Rate,
  Rotate,
  Scale,
  Span,
  Spring,
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
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
let R = 100;
class SceneManager {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: THREE.PerspectiveCamera;
  proton!: Proton;
  control!: OrbitControls;
  spring!: Spring;

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
    const { emitter, spring } = this.createEmitter(scene, proton);
    this.spring = spring;
    proton.addEmitter(emitter);
    proton.addRender(new MeshRender(scene));
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton, control, spring } = this;
    proton.update();
    renderer.render(scene, camera);

    tha += .005;
    proton.emitters[0].p.x = Math.cos(tha) * R;
    proton.emitters[0].p.y = Math.sin(tha) * R;
    proton.emitters[0].rotation.x += 0.01;
    var x = Math.cos(tha) * 100;
    var y = Math.sin(tha) * 100;
    spring.reset(x, y, 100);
    control.update();

    Debug.renderInfo(proton, 3);

    requestAnimationFrame(this.animate);
  };

  createEmitter(scene: Scene, proton: Proton) {
    const emitter = new Emitter();
    emitter.rate = new Rate(new Span(6, 12), new Span(.2, .5));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(100));
    emitter.addInitialize(new Life(2, 4));
    emitter.addInitialize(new Body(this.createBox()));
    emitter.addInitialize(new Velocity(300, new Vector3D(0, 1, 0), 50));
    emitter.addBehaviour(new Rotate("random", "random"));
    emitter.addBehaviour(new Scale(1, .1));

    var zone2 = new BoxZone(500);
    const spring = new Spring(100, 100, 100);
    emitter.addBehaviour(spring);
    emitter.addBehaviour(new Color('random', 'random', Infinity, ease.easeOutQuart));

    emitter.p.x = 0;
    emitter.p.y = 0;
    emitter.emit();

    Debug.drawZone(proton,scene,zone2);
    Debug.drawEmitter(proton, scene, emitter);
    return { emitter, spring };
}

  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }

  createBox() {
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshLambertMaterial({ color: "#00ffcc" });
    return new THREE.Mesh(geometry, material);
  }
}
