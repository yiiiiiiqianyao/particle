import React, { useEffect, useRef } from 'react';
import {
  Alpha,
  Color,
  Debug,
  Emitter,
  Life,
  Mass,
  PointZone,
  Position,
  Proton,
  Radius,
  Rate,
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

const debug = new Debug();

// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    debug.setParentNode(containerRef.current);
    const sceneManager = new SceneManager(containerRef.current);
    return () => {
      containerRef.current?.removeChild(sceneManager.renderer.domElement);
    };
  }, []);
  return (
    <div className="wrap" style={{ height: '500px', position: 'relative' }} ref={containerRef} />
  );
};

let tha = 0;
let hcolor = 0;
let ctha = 0;
let r = 500;

class SceneManager {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: THREE.PerspectiveCamera;
  proton!: Proton;
  control: OrbitControls;
  clock!: THREE.Clock;
  emitter: Emitter;
  color1!: THREE.Color;
  color2!: THREE.Color;
  constructor(wrap: HTMLDivElement) {
    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0x000000);
    const rect = wrap.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(
      70,
      rect.width / rect.height,
      0.1,
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
    const clock = new THREE.Clock();
    this.clock = clock;
    const emitter = new Emitter();
    this.emitter = emitter;
    //setRate
    emitter.rate = new Rate(new Span(4, 16), new Span(.01));
    //addInitialize
    emitter.addInitialize(new Position(new PointZone(0, 0, 0)));
    emitter.addInitialize(new Mass(1));
    emitter.addInitialize(new Radius(6, 12));
    emitter.addInitialize(new Life(3));
    emitter.addInitialize(new Velocity(45, new Vector3D(0, 1, 0), 180));
    //addBehaviour
    emitter.addBehaviour(new Alpha(1, 0));
    emitter.addBehaviour(new Scale(.1, 1.3));

    const color1 = new THREE.Color();
    const color2 = new THREE.Color();
    this.color1 = color1;
    this.color2 = color2;
    const colorBehaviour = new Color(color1, color2);
    emitter.addBehaviour(colorBehaviour);

    emitter.emit();
    //add emitter
    proton.addEmitter(emitter);
    proton.addRender(new SpriteRender(scene));
    this.animate();
  }

  animate = () => {
    const { renderer, scene, camera, proton, control, clock, emitter, color1, color2 } = this;
    proton.update();
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
    debug.renderInfo(proton, 3)

    this.changeParticleColor(color1, color2);
    this.protonUpdate(clock, proton);

    camera.lookAt(scene.position);
    this.moveEmitter(emitter);
    this.rotateCamera(camera);
    debug.renderInfo(proton, 3);
  }

  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 10000, 100000);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
  }

  protonUpdate(clock: THREE.Clock, proton: Proton) {
    var delta = clock.getDelta();
    delta < 5 / 60 && proton.update(delta);
  }
  changeParticleColor(color1: THREE.Color, color2: THREE.Color) {
    hcolor += .01;
    color1.setHSL(hcolor - (hcolor >> 0), 1, .5);
    color2.setHSL(hcolor - (hcolor >> 0) + .3, 1, .5);
  }

  moveEmitter(emitter: Emitter){
    tha += Math.PI / 150;
    var p = 300 * Math.sin(2 * tha);
    emitter.p.x = p * Math.cos(tha);
    emitter.p.y = p * Math.sin(tha);
    emitter.p.z = p * Math.tan(tha) / 2;
  }

  rotateCamera(camera: THREE.Camera){
    ctha += .016;
    r = 300;
    camera.position.x = Math.sin(ctha) * r;
    camera.position.z = Math.cos(ctha) * r;
    camera.position.y = Math.sin(ctha) * r;
  }
}
