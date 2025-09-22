import { Group, Mesh } from "three";
import FieldBlockGeometry from "./geometries/field-block.geometry";
import FieldBlockMaterial from "./materials/field-block.material";

export default class MineFieldBlock extends Group {
    x!: number;
    y!: number;

    isFlagged: boolean = false;
    isRevealed: boolean = false;
    hasMine: boolean = false;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;

        this.create();
    }

    private create(): void {
        const geometry = FieldBlockGeometry.getInstance().geometry;
        const material = FieldBlockMaterial.getInstance().material;
        const block = new Mesh(geometry, material);
        block.receiveShadow = true;
        this.add(block);
    }

    public setPosition(x: number, y: number, z: number): void {
        this.position.set(x, y, z);
    }
}