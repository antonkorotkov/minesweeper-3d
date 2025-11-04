import { Group, Mesh } from "three";
import MineMaterial from "./materials/mine.material";
import MineBodyGeometry from "./geometries/mine-body.geometry";
import MineSpikeGeometry from "./geometries/mine-spike.geometry";

export default class IntroMine extends Group {
    constructor() {
        super();
        this.create();
    }

    private create(): void {
        const material = MineMaterial.getInstance().material;
        const bodyGeometry = MineBodyGeometry.getInstance().geometry;
        const mineBody = new Mesh(bodyGeometry, material);
        mineBody.castShadow = true;
        mineBody.receiveShadow = true;

        const spikeCountLat = 4;
        const spikeCountLon = 9;

        for (let i = 0; i <= spikeCountLat; i++) {
            const phi = (i / spikeCountLat) * Math.PI;
            for (let j = 0; j < spikeCountLon; j++) {
                const theta = (j / spikeCountLon) * 2 * Math.PI;

                const x = Math.sin(phi) * Math.cos(theta);
                const y = Math.sin(phi) * Math.sin(theta);
                const z = Math.cos(phi);

                const spike = new Mesh(MineSpikeGeometry.getInstance().geometry, material);
                spike.position.set(x * 2.2, y * 2.2, z * 2.2);
                spike.lookAt(0, 0, 0);
                spike.rotateX(Math.PI / 2);
                spike.castShadow = true;
                spike.receiveShadow = true;

                this.add(spike);
            }
        }

        this.add(mineBody);
    }
}