import * as THREE from 'three';
import { PUID } from './PUID';
import { Vector3D } from 'yiqianyao_particle/math';

export class THREEUtil {
    static _vector: THREE.Vector3 | null;
    static _dir: THREE.Vector3 | null;
    static store: Record<string, any> = {}
    static get vector() {
        if (THREEUtil._vector == null) {
            THREEUtil._vector = new THREE.Vector3();
        }
        return THREEUtil._vector;
    }
    static get dir() {
        if (THREEUtil._dir == null) {
            THREEUtil._dir = new THREE.Vector3();
        }
        return THREEUtil._dir;
    }
    static toScreenPos(pos: Vector3D, camera: THREE.Camera, canvas: HTMLCanvasElement) {
        const vector = THREEUtil.vector;
        vector.copy(pos);
        // map to normalized device coordinate (NDC) space
        vector.project(camera);
        // map to 2D screen space
        vector.x = Math.round((vector.x + 1) * canvas.width / 2);
        vector.y = Math.round((-vector.y + 1) * canvas.height / 2);
        vector.z = 0;
        // console.log('vector', vector)
        return vector;
    }

    static toSpacePos(pos: any, camera: any, canvas: any) {
        const vector = THREEUtil.vector;
        const dir = THREEUtil.dir;
        let distance;

        vector.set((pos.x / canvas.width) * 2 - 1, -(pos.y / canvas.height) * 2 + 1, 0.5);
        vector.unproject(camera);

        dir.copy(vector.sub(camera.position).normalize());
        distance = -camera.position.z / dir.z;
        vector.copy(camera.position);
        vector.add(dir.multiplyScalar(distance));
        return vector;
    }

    static getTexture(img: any) {
        const store = THREEUtil.store;

        if (img instanceof THREE.Texture) {
            return img;
        }
        // else if (typeof img === "string") {
        //     var id = PUID.hash(img);
        //     if (!store[id]) store[id] = new THREE.Texture(img);;
        //     return store[id];
        // }
        else if (img instanceof Image) {
            var id = PUID.hash(img.src);
            if (!store[id]) store[id] = new THREE.Texture(img);;
            return store[id];
        }
    }
};
