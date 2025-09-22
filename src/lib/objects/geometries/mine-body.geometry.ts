import { SphereGeometry } from "three";
import Singleton from "../../core/singleton";

export default class MineBodyGeometry extends Singleton {
    #geometry: SphereGeometry;

    private constructor() {
        super();

        this.#geometry = new SphereGeometry(2, 32, 32);
    }

    static getInstance(): MineBodyGeometry {
        return this.getSingleton<MineBodyGeometry>();
    }

    get geometry(): SphereGeometry {
        return this.#geometry;
    }
}