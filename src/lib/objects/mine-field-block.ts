import { Group, Mesh, Material } from "three";
import FieldBlockGeometry from "./geometries/field-block.geometry";
import FieldBlockMaterial from "./materials/field-block.material";
import type { IInteractiveObject } from "../core/interfaces/interactiveObject.interface";
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import Flag from "./flag";
import MineMaterial from "./materials/mine.material";
import NumberGeometry from "./geometries/number.geometry";

export default class MineFieldBlock extends Group implements IInteractiveObject {
    x!: number;
    y!: number;
    value!: number;

    isFlagged: boolean = false;
    isRevealed: boolean = false;
    hasMine: boolean = false;

    private mesh!: Mesh;
    private number?: Mesh;
    private materialNormal!: Material;
    private materialHighlight!: Material;
    private flagMesh!: Group;
    private neighborBlocks: MineFieldBlock[][] = [];

    constructor(x: number, y: number, value: number, neighborBlocks: MineFieldBlock[][]) {
        super();
        this.x = x;
        this.y = y;
        this.hasMine = value === -1;
        this.value = value;
        this.neighborBlocks = neighborBlocks;

        this.create();
    }

    onClick(): void {
        if (this.isRevealed || this.isFlagged)
            return;

        if (this.hasMine) {
            // Show mine
            this.mesh.material = MineMaterial.getInstance().material;
        } else {
            this.reveal();

            if (this.value > 0 && this.number)
                return this.toggleNumber();

            this.revealAdjacentBlocks();
        }
    }

    private revealAdjacentBlocks(): void {
        const directions = [
            { x: -1, y: -1 },
            { x: 0,  y: -1 },
            { x: 1,  y: -1 },
            { x: -1, y: 0 },
            { x: 1,  y: 0 },
            { x: -1, y: 1 },
            { x: 0,  y: 1 },
            { x: 1,  y: 1 }
        ];

        for (const dir of directions) {
            const neighbor = this.getNeighbor(this.x + dir.x, this.y + dir.y);

            if (neighbor && !neighbor.isRevealed)
                neighbor.onClick();
        }
    }

    private getNeighbor(x: number, y: number): MineFieldBlock | null {
        if (x < 0 || y < 0 || x >= this.neighborBlocks.length || y >= this.neighborBlocks[x].length)
            return null;

        return this.neighborBlocks[x][y];
    }

    onRightClick(): void {
        this.toggleFlag();
    }

    onMouseOver(): void {
        if (!this.isRevealed) {
            window.document.body.style.cursor = 'pointer';
            this.mesh.material = this.materialHighlight;
        }
    }

    onMouseOut(): void {
        if (!this.isRevealed) {
            window.document.body.style.cursor = 'auto';
            this.mesh.material = this.materialNormal;
        }
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

    private reveal(): void {
        this.isRevealed = true;
        new TWEEN.Tween(this.mesh.scale)
            .to({ y: 0.5 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();

        new TWEEN.Tween(this.mesh.position)
            .to({ y: -0.05 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();

        this.mesh.material = this.materialHighlight;
    }

    private toggleNumber(): void {
        if (!this.number) return;

        this.number.visible = true;
        this.number.scale.set(0, 0, 0);
        new TWEEN.Tween(this.number.scale)
            .to({ x: 1, y: 1, z: 1 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();
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

        this.number = NumberGeometry.getInstance().createNumberMesh(this.value);
        if (this.number) {
            this.number.position.set(0, 0.5, 0);
            this.number.visible = false;
            this.add(this.number);
        }
    }

    public setPosition(x: number, y: number, z: number): void {
        this.position.set(x, y, z);
    }
}