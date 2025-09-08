'use strict';

import { AxesHelper, GridHelper } from "three";
import type { IScene } from "../core/interfaces/scene.interface";
import type MainScene from "./main.scene";
import { DEBUG_AXES_SIZE, DEBUG_GRID_COLOR1, DEBUG_GRID_COLOR2, DEBUG_GRID_DIVISIONS, DEBUG_GRID_SIZE } from "./const";
import Scene from "../core/scene";
import type DIFFICULTY from "../core/enums/difficulty";
import FIELD_SIZE from "../core/enums/fieldSize";
import MINES_COUNT from "../core/enums/minesCount";

export default class GameScene extends Scene implements IScene {
    private mainScene: MainScene;
    private mineField!: number[][];

    /**
     * Constructor for the game scene
     */
    constructor(mainScene: MainScene) {
        super();
        this.mainScene = mainScene;

        this.init();
    }

    static getInstance(mainScene: MainScene): GameScene {
        return this.getSingleton<GameScene>(mainScene);
    }

    private generateMinefield(difficulty: DIFFICULTY): void {
        const fieldSize = FIELD_SIZE[difficulty];
        const minesCount = MINES_COUNT[difficulty];

        this.mineField = Array.from({ length: fieldSize }, () =>
            Array(fieldSize).fill(0)
        );

        let placedMines = 0;
        while (placedMines < minesCount) {
            const row = Math.floor(Math.random() * fieldSize);
            const col = Math.floor(Math.random() * fieldSize);
            if (this.mineField[row][col] !== -1) {
                this.mineField[row][col] = -1;
                placedMines++;
            }
        }

        for (let r = 0; r < fieldSize; r++) {
            for (let c = 0; c < fieldSize; c++) {
                if (this.mineField[r][c] === -1) continue;

                let mineCount = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;

                        const x = r + dr;
                        const y = c + dc;

                        if (x < 0 || x >= fieldSize || y < 0 || y >= fieldSize) continue;

                        if (this.mineField[x][y] === -1)
                            mineCount++;
                    }
                }
                this.mineField[r][c] = mineCount;
            }
        }

        console.log("Generated Minefield:", this.mineField);
    }

    protected init(): void {
        this.mainScene.controls.enabled = true;

        super.init();
    }

    start(difficulty: DIFFICULTY): void {
        console.log("Starting game with difficulty:", difficulty);

        this.generateMinefield(difficulty);
    }

    /**
     * Initialize the debug helpers
     */
    public initDebugHelpers(): void {
        const scene = this.mainScene.scene;
        const grid = new GridHelper(DEBUG_GRID_SIZE, DEBUG_GRID_DIVISIONS, DEBUG_GRID_COLOR1, DEBUG_GRID_COLOR2);
        scene.add(grid);

        const axes = new AxesHelper(DEBUG_AXES_SIZE);
        axes.position.y = 0.01;
        scene.add(axes);
    }

    tick(_delta: number): void {}

    dispose(): void {}
}