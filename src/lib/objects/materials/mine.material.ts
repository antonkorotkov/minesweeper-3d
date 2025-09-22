import { MeshStandardMaterial } from 'three';
import Singleton from '../../core/singleton';

export default class MineMaterial extends Singleton {
    #material: MeshStandardMaterial;

    constructor() {
        super();

        this.#material = new MeshStandardMaterial({ color: 0x111111, metalness: 0.95, roughness: 0.5 });
    }

    static getInstance(): MineMaterial {
        return this.getSingleton<MineMaterial>();
    }

    get material(): MeshStandardMaterial {
        return this.#material;
    }
}