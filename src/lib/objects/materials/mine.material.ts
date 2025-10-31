import { MeshPhongMaterial } from 'three';
import Singleton from '../../core/singleton';

export default class MineMaterial extends Singleton {
    #material: MeshPhongMaterial;

    constructor() {
        super();

        this.#material = new MeshPhongMaterial({ color: 0x050505, shininess: 100 });
    }

    static getInstance(): MineMaterial {
        return this.getSingleton<MineMaterial>();
    }

    get material(): MeshPhongMaterial {
        return this.#material;
    }
}