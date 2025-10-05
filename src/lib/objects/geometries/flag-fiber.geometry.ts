import { ExtrudeGeometry, Shape } from "three";
import Singleton from "../../core/singleton";

export default class FlagFiberGeometry extends Singleton {
    #geometry: ExtrudeGeometry;

    private constructor() {
        super();

        const flagShape = new Shape();
        flagShape.moveTo(0, 0);
        flagShape.lineTo(0, 1.2);
        flagShape.lineTo(1.4, 0.6);
        flagShape.lineTo(0, 0);

        this.#geometry = new ExtrudeGeometry(flagShape, { depth: 0.05, bevelEnabled: false });
    }

    static getInstance(): FlagFiberGeometry {
        return this.getSingleton<FlagFiberGeometry>();
    }

    get geometry(): ExtrudeGeometry {
        return this.#geometry;
    }
}