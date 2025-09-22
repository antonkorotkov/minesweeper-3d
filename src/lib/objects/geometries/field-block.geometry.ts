import { BoxGeometry } from "three";
import Singleton from "../../core/singleton";

export default class FieldBlockGeometry extends Singleton {
    #geometry: BoxGeometry;

    private constructor() {
        super();

        this.#geometry = new BoxGeometry(1, 0.2, 1);
    }

    static getInstance(): FieldBlockGeometry {
        return this.getSingleton<FieldBlockGeometry>();
    }

    get geometry(): BoxGeometry {
        return this.#geometry;
    }
}