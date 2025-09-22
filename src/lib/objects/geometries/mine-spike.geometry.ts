import { CylinderGeometry } from "three";
import Singleton from "../../core/singleton";

export default class MineSpikeGeometry extends Singleton {
    #geometry: CylinderGeometry;

    private constructor() {
        super();

        this.#geometry = new CylinderGeometry(0.1, 0.1, 1, 8);
    }

    static getInstance(): MineSpikeGeometry {
        return this.getSingleton<MineSpikeGeometry>();
    }

    get geometry(): CylinderGeometry {
        return this.#geometry;
    }
}