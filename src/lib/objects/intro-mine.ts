'use strict';

import { Group, Material, SphereGeometry, CylinderGeometry, Mesh } from "three";

export default class IntroMine extends Group {
    private material: Material;

    constructor(material: Material) {
        super();
        this.material = material;
        this.create();
    }

    private create(): void {
        const bodyGeometry = new SphereGeometry(2, 32, 32);
        const mineBody = new Mesh(bodyGeometry, this.material);
        mineBody.receiveShadow = true;
        const spikeGeometry = new CylinderGeometry(0.1, 0.1, 1, 8);

        const spikeCountLat = 4;
        const spikeCountLon = 9;

        for (let i = 0; i <= spikeCountLat; i++) {
            const phi = (i / spikeCountLat) * Math.PI;
            for (let j = 0; j < spikeCountLon; j++) {
                const theta = (j / spikeCountLon) * 2 * Math.PI;

                const x = Math.sin(phi) * Math.cos(theta);
                const y = Math.sin(phi) * Math.sin(theta);
                const z = Math.cos(phi);

                const spike = new Mesh(spikeGeometry, this.material);
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