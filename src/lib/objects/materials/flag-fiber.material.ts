import { MeshStandardMaterial } from 'three';
import Singleton from '../../core/singleton';

export default class FlagFiberMaterial extends Singleton {
    #material: MeshStandardMaterial;

    constructor() {
        super();

        this.#material = new MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.4 });
    }

    static getInstance(): FlagFiberMaterial {
        return this.getSingleton<FlagFiberMaterial>();
    }

    get material(): MeshStandardMaterial {
        return this.#material;
    }
}