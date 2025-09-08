'use strict';

import * as THREE from 'three';
import Singleton from '../../core/singleton';

export default class DefaultMaterial extends Singleton {
    #material: THREE.MeshStandardMaterial;

    constructor(color: number = 0x222222) {
        super();

        this.#material = new THREE.MeshStandardMaterial({ color, metalness: 0.95, roughness: 0.5 });
    }

    static getInstance(color: number): DefaultMaterial {
        return this.getSingleton<DefaultMaterial>(color);
    }

    get material(): THREE.MeshStandardMaterial {
        return this.#material;
    }
}