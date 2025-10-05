import { BoxGeometry } from "three";
import Singleton from "../../core/singleton";

export default class FlagBaseGeometry extends Singleton {
    #geometry: BoxGeometry;

    private constructor() {
        super();

        this.#geometry = new BoxGeometry(0.6, 0.2, 0.4);
    }

    static getInstance(): FlagBaseGeometry {
        return this.getSingleton<FlagBaseGeometry>();
    }

    get geometry(): BoxGeometry {
        return this.#geometry;
    }
}