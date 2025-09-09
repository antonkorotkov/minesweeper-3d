'use strict';

import { MeshStandardMaterial } from 'three';
import Singleton from '../../core/singleton';

export default class FieldBlockMaterial extends Singleton {
    #material: MeshStandardMaterial;

    constructor() {
        super();

        this.#material = new MeshStandardMaterial({ color: 0x007c92 });
    }

    static getInstance(): FieldBlockMaterial {
        return this.getSingleton<FieldBlockMaterial>();
    }

    get material(): MeshStandardMaterial {
        return this.#material;
    }
}