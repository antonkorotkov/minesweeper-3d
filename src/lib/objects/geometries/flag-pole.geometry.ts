import { BoxGeometry } from "three";
import Singleton from "../../core/singleton";

export default class FlagPoleGeometry extends Singleton {
    #geometry: BoxGeometry;

    private constructor() {
        super();

        this.#geometry = new BoxGeometry(0.08, 2.8, 0.08);
    }

    static getInstance(): FlagPoleGeometry {
        return this.getSingleton<FlagPoleGeometry>();
    }

    get geometry(): BoxGeometry {
        return this.#geometry;
    }
}