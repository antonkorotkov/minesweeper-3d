import { AmbientLight, AxesHelper, CameraHelper, DirectionalLight, DirectionalLightHelper, GridHelper } from "three";
import type { IScene } from "../core/interfaces/scene.interface";
import type MainScene from "./main.scene";
import { DEBUG_AXES_SIZE, DEBUG_GRID_COLOR1, DEBUG_GRID_COLOR2, DEBUG_GRID_DIVISIONS, DEBUG_GRID_SIZE, GAME_AMBIENT_LIGHT_COLOR, GAME_DIRECTIONAL_LIGHT_COLOR, GAME_DIRECTIONAL_LIGHT_INTENSITY } from "./const";
import Scene from "../core/scene";
import type DIFFICULTY from "../core/enums/difficulty";
import FIELD_SIZE from "../core/enums/fieldSize";
import MINES_COUNT from "../core/enums/minesCount";
import MineFieldBlock from "../objects/mine-field-block";

export default class GameScene extends Scene implements IScene {
    protected rayCasterEnabled = true;
    private ambientLight!: AmbientLight;
    private dirLight!: DirectionalLight;
    private mineField!: number[][];
    private dirLightHelper!: DirectionalLightHelper;
    private shadowCamHelper!: CameraHelper;
    private neighborBlocks: MineFieldBlock[][] = [];

    /**
     * Constructor for the game scene
     */
    constructor(mainScene: MainScene) {
        super();
        this.mainScene = mainScene;

        this.init();
    }

    /**
     * The singleton instance of the GameScene
     */
    static getInstance(mainScene: MainScene): GameScene {
        return this.getSingleton<GameScene>(mainScene);
    }

    /**
     * Generate the minefield based on the selected difficulty level
     */
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
    }

    protected init(): void {
        this.mainScene.controls.enabled = true;

        this.ambientLight = new AmbientLight(GAME_AMBIENT_LIGHT_COLOR);
        this.mainScene.scene.add(this.ambientLight);

        this.dirLight = new DirectionalLight(
            GAME_DIRECTIONAL_LIGHT_COLOR,
            GAME_DIRECTIONAL_LIGHT_INTENSITY
        );
        this.dirLight.castShadow = true;
        this.dirLight.position.set(4, 15, 4);
        this.dirLight.shadow.camera.far = 25;
        this.dirLight.shadow.camera.left = -12;
        this.dirLight.shadow.camera.right = 12;
        this.dirLight.shadow.camera.top = 12;
        this.dirLight.shadow.camera.bottom = -12;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.mainScene.scene.add(this.dirLight);

        super.init();
    }

    start(difficulty: DIFFICULTY): void {
        this.generateMinefield(difficulty);
        this.drawField();
    }

    private drawField(): void {
        const size = this.mineField.length;
        const spacing = 1.01;
        const offset = (size - 1) * spacing / 2;

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const value = this.mineField[r][c];

                const block = new MineFieldBlock(r, c, value, this.neighborBlocks);
                this.neighborBlocks[r] = this.neighborBlocks[r] || [];
                this.neighborBlocks[r][c] = block;
                block.setPosition(r * spacing - offset, 0.05, c * spacing - offset);
                this.mainScene.scene.add(block);
                this.addInteractiveObject(block);
            }
        }
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

        this.dirLightHelper = new DirectionalLightHelper(this.dirLight);
        scene.add(this.dirLightHelper);

        this.shadowCamHelper = new CameraHelper(this.dirLight.shadow.camera);
        scene.add(this.shadowCamHelper);
    }

    tick(delta: number): void {
        super.tick(delta);
    }

    dispose(): void {
        super.dispose();

        if (this.dirLightHelper) {
			this.mainScene.scene.remove(this.dirLightHelper);
			this.dirLightHelper.dispose();
		}

        if (this.shadowCamHelper) {
            this.mainScene.scene.remove(this.shadowCamHelper);
            this.shadowCamHelper.dispose();
        }
    }
}