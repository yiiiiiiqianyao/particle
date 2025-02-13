# Zone

## Screen Zone
定义屏幕区域

<code src="./demos/SpriterenderSnow.tsx"></code>

### Constructor
```ts
constructor(camera: THREE.Camera, renderer: THREE.WebGLRenderer, dis: number, dir: string);
```
### 属性
| 属性名 | 类型 | 描述 |
| --- | --- | --- |
| camera | THREE.Camera | 相机 |
| renderer | THREE.WebGLRenderer | 渲染器 |
| dis | number | 超出屏幕边缘多少距离的时候 粒子死亡 |  
| dir | string <br/> 1 <br/> 12 <br/> 123 <br/> 1234 <br/> ... | 屏幕上边界 1 <br/> 屏幕右边界 2 <br/> 屏幕下边界 3 <br/> 屏幕左边界 4 <br/> 屏幕坐标系为左上交，x 轴正方向为水平向右，y 轴正方向为垂直向下 |

### 方法
| 方法名 | 描述 |
| --- | --- |
| getPosition() | 获取粒子位置 |  

