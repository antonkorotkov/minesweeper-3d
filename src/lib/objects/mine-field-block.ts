import { Group, Mesh, Material } from "three";
import FieldBlockGeometry from "./geometries/field-block.geometry";
import FieldBlockMaterial from "./materials/field-block.material";
import type { IInteractiveObject } from "../core/interfaces/interactiveObject.interface";
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import Flag from "./flag";

export default class MineFieldBlock extends Group implements IInteractiveObject {
    x!: number;
    y!: number;

    isFlagged: boolean = false;
    isRevealed: boolean = false;
    hasMine: boolean = false;

    private mesh!: Mesh;
    private materialNormal!: Material;
    private materialHighlight!: Material;
    private flagMesh!: Group;

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
        this.toggleFlag();
    }

    onMouseOver(): void {
        window.document.body.style.cursor = 'pointer';
        this.mesh.material = this.materialHighlight;
    }

    onMouseOut(): void {
        window.document.body.style.cursor = 'auto';
        this.mesh.material = this.materialNormal;
    }

    private toggleFlag(): void {
        this.isFlagged = !this.isFlagged;
        if (this.isFlagged) {
            this.flagMesh.scale.set(0, 0, 0);
            this.flagMesh.visible = this.isFlagged;
            new TWEEN.Tween(this.flagMesh.scale)
                .to({ x: 0.3, y: 0.3, z: 0.3 }, 500)
                .easing(TWEEN.Easing.Elastic.Out)
                .start();
        }
        else {
            new TWEEN.Tween(this.flagMesh.scale)
                .to({ x: 0, y: 0, z: 0 }, 500)
                .easing(TWEEN.Easing.Elastic.In)
                .onComplete(() => {
                    this.flagMesh.visible = false;
                })
                .start();
        }
    }

    private create(): void {
        const geometry = FieldBlockGeometry.getInstance().geometry;
        this.materialNormal = FieldBlockMaterial.getInstance().materialNormal;
        this.materialHighlight = FieldBlockMaterial.getInstance().materialHighlight;
        this.mesh = new Mesh(geometry, this.materialNormal);
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.flagMesh = new Flag();
        this.flagMesh.position.set(0, 0.1, 0);
        this.flagMesh.visible = false;
        this.flagMesh.scale.set(0, 0, 0);
        this.add(this.flagMesh);
    }

    public setPosition(x: number, y: number, z: number): void {
        this.position.set(x, y, z);
    }
}