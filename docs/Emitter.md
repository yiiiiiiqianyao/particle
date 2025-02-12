# Emitter

粒子发射器

## 基本用法

### Constructor
```ts
constructor(rate: Rate, behavior: Behavior, capacity: number);
```
### 属性
| 属性名 | 类型 | 描述 |
| --- | --- | --- |
| rate | Rate | 粒子发射速率 |
| behavior | Behavior | 粒子行为 |
| capacity | number | 粒子最大数量 |
### 方法
| 方法名 | 描述 |
| --- | --- |
| addInitialize(initialize: Initialize) | 添加初始化行为 |
| addBehaviour(behavior: Behavior) | 添加粒子行为 |
| removeBehaviour(behavior: Behavior) | 移除粒子行为 |
| getBehaviours() | 获取粒子行为 |
| getInitializes() | 获取初始化行为 |
| emit() | 发射粒子 |
| update(delta: number) | 更新粒子 |
| reset() | 重置粒子发射器 |
| recycle() | 回收粒子发射器 |
| getCapacity() | 获取粒子最大数量 |
| setCapacity(capacity: number) | 设置粒子最大数量 |
| getRate() | 获取粒子发射速率 |
| setRate(rate: Rate) | 设置粒子发射速率 |
| getBehavior() | 获取粒子行为 |
| setBehavior(behavior: Behavior) | 设置粒子行为 |
| getParticles() | 获取粒子 |
| getParticleCount() | 获取粒子数量 |
| getEmitCount() | 获取粒子发射数量 |
| getEmitTime() | 获取粒子发射时间 |
| getEmitRate() | 获取粒子发射速率 |
| getEmitRateValue() | 获取粒子发射速率值 |
| getEmitRateType() | 获取粒子发射速率类型 |
| getEmitRateTime() | 获取粒子发射速率时间 |
| getEmitRateTimeValue() | 获取粒子发射速率时间值 |
| getEmitRateTimeType() | 获取粒子发射速率时间类型 |
| getEmitRateTimeValue() | 获取粒子发射速率时间值 | 
| getEmitRateTimeType() | 获取粒子发射速率时间类型 |  


## MeshEmitter

<code src="./demos/MeshRenderEmitter.tsx"></code>

## FollowEmitter

跟随鼠标移动的粒子发射器

<code src="./demos/FollowEmitter.tsx"></code>
