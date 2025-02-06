// @ts-nocheck
import * as THREE from 'three';
import { Zone } from './Zone';
    /**
     * MeshZone is a threejs mesh zone
     * @param {Geometry|Mesh} geometry - a THREE.Geometry or THREE.Mesh object
     * @example 
     * var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
     * var cylinder = new THREE.Mesh( geometry, material );
     * var meshZone = new MeshZone(geometry);
     * or
     * var meshZone = new MeshZone(cylinder);
     * @extends {Zone}
     * @constructor
     */
export class MeshZone extends Zone {
    constructor(geometry, scale) {
        super();
        // THREE.Geometry => THREE.BufferGeometry 在 Three.js 较新的版本中，Geometry 已被弃用，取而代之的是 BufferGeometry
        if (geometry instanceof THREE.BufferGeometry) {
            this.geometry = geometry;
        } else {
            this.geometry = geometry.geometry;
        }
        this.vertices = this.getVertices();
        this.scale = scale || 1;
    }
    getPosition() {
        // var vertices = this.geometry.vertices;
        var vertices = this.vertices;
        var rVector = vertices[(vertices.length * Math.random()) >> 0];
        this.vector.x = rVector.x * this.scale;
        this.vector.y = rVector.y * this.scale;
        this.vector.z = rVector.z * this.scale;
        return this.vector;
    }

    getVertices() {
        const positionAttribute = this.geometry.attributes.position;
        const vertexCount = positionAttribute.count;
        const vertices = [];
        for (let i = 0; i < vertexCount; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const z = positionAttribute.getZ(i);
            vertices.push(new THREE.Vector3(x, y, z));
        }
        return vertices;
    }

    crossing = function(particle) {
        if (this.log) {
            console.error('Sorry MeshZone does not support crossing method');
            this.log = false;
        }
    }
}