# Helloworld
基础的 `demo` 示例

## Helloworld
<code src="./demos/Helloworld.tsx"></code>

## Eight Diagrams 

八卦

<code src="./demos/Eightdiagrams.tsx"></code>

## Mesh Collision

网格碰撞

<code src="./demos/MeshrenderCollision.tsx"></code>

## Debug
插件提供了 `debug` 工具，用于调试

```ts
import { Debug } from "yiqianyao_particle";
const debug = new Debug(); // 实例化 debug 工具
class SceneManager {
  ...
  debug.drawEmitter(proton, scene, emitter1); // 绘制发射器
  ...
  animate = () => {
    const { renderer, scene, camera, proton } = this;
    proton.update();
    renderer.render(scene, camera);
    debug.renderInfo(proton, 3); // 输出每帧的粒子信息
    requestAnimationFrame(this.animate);
  }
}
export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    debug.setParentNode(containerRef.current);
    const sceneManager = new SceneManager(containerRef.current);
  }, []);
  return <div className="wrap" style={{ height: '500px', position: 'relative' }} ref={containerRef} />;
};
```
