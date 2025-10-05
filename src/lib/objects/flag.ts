import { Group, Mesh } from "three";
import FlagFiberGeometry from "./geometries/flag-fiber.geometry";
import FlagPoleGeometry from "./geometries/flag-pole.geometry";
import FlagBaseGeometry from "./geometries/flag-base.geometry";
import MineMaterial from "./materials/mine.material";
import FlagFiberMaterial from "./materials/flag-fiber.material";

export default class Flag extends Group {
    constructor() {
        super();

        this.create();
    }

    create() {
        // Create the flag geometry and material
        const flagFiberGeometry = FlagFiberGeometry.getInstance().geometry;
        const flagPoleGeometry = FlagPoleGeometry.getInstance().geometry;
        const flagBaseGeometry = FlagBaseGeometry.getInstance().geometry;
        const mineMaterial = MineMaterial.getInstance().material;
        const fiberMaterial = FlagFiberMaterial.getInstance().material;

        // Create the flag mesh
        const flagFiberMesh = new Mesh(flagFiberGeometry, fiberMaterial);
        flagFiberMesh.position.set(-0.03, 1.5, 0);
        flagFiberMesh.rotation.y = Math.PI / 2;
        flagFiberMesh.castShadow = true;
        this.add(flagFiberMesh);

        // Create the flag pole mesh
        const flagPoleMesh = new Mesh(flagPoleGeometry, mineMaterial);
        flagPoleMesh.position.set(0, 1.4, 0);
        flagPoleMesh.castShadow = true;
        this.add(flagPoleMesh);

        // Create the flag base mesh
        const flagBaseMesh = new Mesh(flagBaseGeometry, mineMaterial);
        flagBaseMesh.castShadow = true;
        this.add(flagBaseMesh);

        this.scale.set(0.3, 0.3, 0.3);
    }
}