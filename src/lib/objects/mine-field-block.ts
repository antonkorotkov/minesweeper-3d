import { Group, Mesh, Material } from "three";
import FieldBlockGeometry from "./geometries/field-block.geometry";
import FieldBlockMaterial from "./materials/field-block.material";
import type { IInteractiveObject } from "../core/interfaces/interactiveObject.interface";

export default class MineFieldBlock extends Group implements IInteractiveObject {
    x!: number;
    y!: number;

    isFlagged: boolean = false;
    isRevealed: boolean = false;
    hasMine: boolean = false;

    private mesh!: Mesh;
    private materialNormal!: Material;
    private materialHighlight!: Material;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;

        this.create();
    }

    onClick(): void {
        console.log("Block clicked:", this.x, this.y);
    }

    onRightClick(): void {
        console.log("Block right-clicked:", this.x, this.y);
    }

    onMouseOver(): void {
        window.document.body.style.cursor = 'pointer';
        this.mesh.material = this.materialHighlight;
    }

    onMouseOut(): void {
        window.document.body.style.cursor = 'auto';
        this.mesh.material = this.materialNormal;
    }

    private create(): void {
        const geometry = FieldBlockGeometry.getInstance().geometry;
        this.materialNormal = FieldBlockMaterial.getInstance().materialNormal;
        this.materialHighlight = FieldBlockMaterial.getInstance().materialHighlight;
        this.mesh = new Mesh(geometry, this.materialNormal);
        this.mesh.receiveShadow = true;
        this.add(this.mesh);
    }

    public setPosition(x: number, y: number, z: number): void {
        this.position.set(x, y, z);
    }
}