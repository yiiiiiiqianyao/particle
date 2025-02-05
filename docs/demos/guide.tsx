
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from 'three';
import { AmbientLight, PointLight, Scene, WebGLRenderer } from 'three';
import { Proton } from 'particle';

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log('Proton', Proton)
    if (!containerRef.current) return;
    const sceneManager = new SceneManager(containerRef.current);
    return () => {
      // 清理操作
      containerRef.current?.removeChild(sceneManager.renderer.domElement);
  };
  }, [])

  return <div className='wrap' style={{ height: '400px' }} ref={containerRef} />
};

class SceneManager {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: THREE.PerspectiveCamera;
  control: OrbitControls;
  mesh: THREE.Mesh;
  // proton!: Proton
  constructor(wrap: HTMLDivElement) {
       const scene = new THREE.Scene();
       this.scene = scene;
       scene.background = new THREE.Color(0xaaccff);
       scene.fog = new THREE.Fog(0xffffff, 1, 10000);

       const rect = wrap.getBoundingClientRect();
       // 创建相机
       const camera = new THREE.PerspectiveCamera(70, rect.width / rect.height, 0.1, 10000);
       this.camera = camera;
       camera.position.set(1, 1, 1);
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

       // 创建几何体
       const geometry = new THREE.BoxGeometry();
       const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
       const mesh = new THREE.Mesh(geometry, material);
       scene.add(mesh);
       this.initLights(scene);

       this.animate();

      //  custom render particle demo
      // initCustomRenderParticle(scene, camera, renderer, control, mesh);
      // initHelloWorldParticle(scene, camera, renderer, control, mesh);
      // initFollowEmitter(scene, camera, renderer);
      // initEightdiagramsParticle(scene, camera, renderer);
      // initMeshRenderCollision(scene, camera, renderer, control);
      // initMeshRenderEmitter(scene, camera, renderer, control);
      // initMeshZone(scene, camera, renderer, control);
      // initSpriteRenderBase(scene, camera, renderer, control);
      // initSpriteRenderColor(scene, camera, renderer, control);
      // initSpriteRenderG(scene, camera, renderer, control);
      // initSpriteRenderPointZone(scene, camera, renderer, control);
      // initSpriteRenderSnow(scene, camera, renderer, control);
  }

  animate = () => {
    const { renderer, scene, camera, control } = this;
    renderer.render(scene, camera);
    control.update();
    requestAnimationFrame(this.animate);
  }

  initLights(scene: Scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff);
    pointLight.position.set(0, 1, 0);
    scene.add(pointLight);
}
}
