import { MeshStandardMaterial } from 'three';
import Singleton from '../../core/singleton';

export default class FieldBlockMaterial extends Singleton {
    #normal: MeshStandardMaterial;
    #highlight: MeshStandardMaterial;

    constructor() {
        super();

        this.#normal = new MeshStandardMaterial({ color: 0x007c92 });
        this.#highlight = new MeshStandardMaterial({ color: 0xffcc66 });
    }

    static getInstance(): FieldBlockMaterial {
        return this.getSingleton<FieldBlockMaterial>();
    }

    get materialNormal(): MeshStandardMaterial {
        return this.#normal;
    }

    get materialHighlight(): MeshStandardMaterial {
        return this.#highlight;
    }
}