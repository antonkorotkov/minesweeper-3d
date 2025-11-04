import { Group, Mesh, Material, Vector3, Quaternion } from "three";
import FieldBlockGeometry from "./geometries/field-block.geometry";
import FieldBlockMaterial from "./materials/field-block.material";
import type { IInteractiveObject } from "../core/interfaces/interactiveObject.interface";
import TWEEN, { type Tween } from 'three/examples/jsm/libs/tween.module.js';
import Flag from "./flag";
import NumberGeometry from "./geometries/number.geometry";
import MainScene from "../scenes/main.scene";
import IntroMine from "./intro-mine";

/**
 * Class representing a single block in the minefield
 */
export default class MineFieldBlock extends Group implements IInteractiveObject {
    x!: number;
    y!: number;
    value!: number;

    isFlagged: boolean = false;
    isRevealed: boolean = false;
    hasMine: boolean = false;

    private mesh!: Mesh;
    private number?: Mesh;
    private mine?: IntroMine;
    private materialNormal!: Material;
    private materialHighlight!: Material;
    private flagMesh!: Group;
    private neighborBlocks: MineFieldBlock[][] = [];
    private lastCameraPosition = new Vector3();
    private rotationTween?: Tween<any>;
    private rotationDelay = 300;
    private onReveal: () => void;

    constructor(x: number, y: number, value: number, neighborBlocks: MineFieldBlock[][], onReveal: () => void) {
        super();
        this.x = x;
        this.y = y;
        this.hasMine = value === -1;
        this.value = value;
        this.neighborBlocks = neighborBlocks;
        this.onReveal = onReveal;

        this.create();
    }

    /**
     * Handle mouse click event
     */
    onClick(): void {
        if (this.isRevealed || this.isFlagged)
            return;

        if (this.hasMine) {
            // game over
        } else {
            this.reveal();

            if (this.value > 0 && this.number)
                return this.toggleNumber();

            this.revealAdjacentBlocks();
        }
    }

    /**
     * Reveal adjacent blocks if they are not revealed yet
     */
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

    /**
     * Get neighbor block at specified coordinates
     */
    private getNeighbor(x: number, y: number): MineFieldBlock | null {
        if (x < 0 || y < 0 || x >= this.neighborBlocks.length || y >= this.neighborBlocks[x].length)
            return null;

        return this.neighborBlocks[x][y];
    }

    /**
     * Handle mouse right-click event
     */
    onRightClick(): void {
        this.toggleFlag();
    }

    /**
     * Handle mouse over event
     */
    onMouseOver(): void {
        if (!this.isRevealed) {
            window.document.body.style.cursor = 'pointer';
            this.mesh.material = this.materialHighlight;
        }
    }

    /**
     * Handle mouse out event
     */
    onMouseOut(): void {
        if (!this.isRevealed) {
            window.document.body.style.cursor = 'auto';
            this.mesh.material = this.materialNormal;
        }
    }

    /**
     * Toggle the flagged state of the block
     */
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

    /**
     * Reveal the block visually
     */
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
        this.onReveal();
    }

    /**
     * Toggle the visibility of the number mesh
     */
    private toggleNumber(): void {
        if (!this.number) return;

        this.number.visible = true;
        this.number.lookAt(MainScene.init().camera.position);
        new TWEEN.Tween(this.number.scale)
            .to({ x: 1, y: 1, z: 1 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();
    }

    /**
     * Create the minefield block components
     */
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
            this.number.scale.set(0, 0, 0);
            this.number.position.set(0, 0.3, 0);
            this.number.visible = false;
            this.add(this.number);
        }

        if (this.hasMine) {
            this.mine = new IntroMine();
            this.mine.position.set(0, 0, 0);
            this.mine.scale.set(0, 0, 0);
            this.add(this.mine);
        }
    }

    /**
     * Set the position of the block
     */
    public setPosition(x: number, y: number, z: number): void {
        this.position.set(x, y, z);
    }

    /**
     * Update the object's state
     */
    public tick(): void {
        const mainScene = MainScene.init();

        if (this.number && this.number.visible) {
            const cameraPosition = mainScene.camera.position;
            const distanceMoved = this.lastCameraPosition.distanceTo(cameraPosition);

            if (distanceMoved > 0.01) {
                this.lastCameraPosition.copy(cameraPosition);
                this.startDelayedRotation();
            }
        }
    }

    /**
     * Start delayed smooth rotation to face camera
     */
    private startDelayedRotation(): void {
        if (!this.number)
            return;

        if (this.rotationTween)
            this.rotationTween.stop();

        setTimeout(() => {
            this.animateToFaceCamera();
        }, this.rotationDelay);
    }

    /**
     * Smoothly animate number to face camera
     */
    private animateToFaceCamera(): void {
        if (!this.number) return;

        const mainScene = MainScene.init();
        const startQuat = new Quaternion().copy(this.number.quaternion);
        const tempVector = new Vector3();
        tempVector.copy(mainScene.camera.position);
        this.number.lookAt(tempVector);

        const targetQuat = new Quaternion().copy(this.number.quaternion);
        this.number.quaternion.copy(startQuat);

        const progress = { value: 0 };
        this.rotationTween = new TWEEN.Tween(progress)
            .to({ value: 1 }, 400)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                if (this.number) {
                    this.number.quaternion.slerpQuaternions(startQuat, targetQuat, progress.value);
                }
            })
            .start();
    }

    /**
     * Show mine with celebration effect when game is won
     */
    celebrateMine(): void {
        if (!this.mine) return;

        new TWEEN.Tween(this.mine.scale)
            .to({ x: 0.12, y: 0.12, z: 0.12 }, 300)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();

        new TWEEN.Tween(this.mine.position)
            .to({ y: 0.5 }, 300)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();
    }
}