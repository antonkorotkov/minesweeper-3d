import {
	AmbientLight,
	DirectionalLight,
	Color,
	Object3D,
	DirectionalLightHelper,
	Vector3
} from "three";
import { Container as PixiContainer, Sprite } from "pixi.js";
import type { IScene } from "../core/interfaces/scene.interface";
import IntroMine from "../objects/intro-mine";
import type MainScene from "./main.scene";
import {
	BUTTON_EASY_COLOR1,
	BUTTON_EASY_COLOR2,
	BUTTON_HARD_COLOR1,
	BUTTON_HARD_COLOR2,
	BUTTON_MEDIUM_COLOR1,
	BUTTON_MEDIUM_COLOR2,
	DIFF_BUTTON_HEIGHT,
	DIFF_BUTTON_WIDTH,
	INTRO_AMBIENT_LIGHT_COLOR,
	INTRO_DIRECTIONAL_LIGHT_COLOR,
	INTRO_DIRECTIONAL_LIGHT_INTENSITY
} from "./const";
import DifficultyButton from "../ui/buttons/difficulty.button";
import Scene from "../core/scene";
import DIFFICULTY from "../core/enums/difficulty";

export default class IntroScene extends Scene implements IScene {
	private dirLight!: DirectionalLight;
	private dirLightHelper!: DirectionalLightHelper;
	private ambientLight!: AmbientLight;
	private lightDistance = 10;
	private damping = 0.05;
	private lightTargetPos = new Vector3(0, 0, 50);
	private difficultyButtonsContainer!: PixiContainer;
	private difficultyButtons: Array<DifficultyButton> = [];
	private mine!: IntroMine;
	private layoutDifficultyButtonsBound: () => void;
	private layoutLogoBound: () => void;
	private logoContainer!: PixiContainer;
	private logoSprite!: Sprite;

	/**
	 * Constructor for the intro scene
	 */
	constructor(mainScene: MainScene) {
        super();
		this.mainScene = mainScene;
		this.layoutDifficultyButtonsBound = this.layoutDifficultyButtons.bind(this);
        this.layoutLogoBound = this.layoutLogo.bind(this);
		this.init();
	}

	/**
	 * Get the singleton instance of the IntroScene
	 */
	static getInstance(mainScene: MainScene): IntroScene {
		return this.getSingleton<IntroScene>(mainScene);
	}

	/**
	 * Initialize the intro scene
	 */
	protected init(): void {
		this.mainScene.scene.background = new Color(0x001d2e);
		this.mainScene.controls.enabled = false;
		this.mainScene.loadingOverlay.hide();
		this.mine = new IntroMine();
		this.mainScene.scene.add(this.mine);

		this.ambientLight = new AmbientLight(INTRO_AMBIENT_LIGHT_COLOR);
		this.mainScene.scene.add(this.ambientLight);

		this.dirLight = new DirectionalLight(
			INTRO_DIRECTIONAL_LIGHT_COLOR,
			INTRO_DIRECTIONAL_LIGHT_INTENSITY
		);
		this.dirLight.castShadow = true;
		this.mainScene.scene.add(this.dirLight);

		const lightTarget = new Object3D();
		lightTarget.position.set(0, 0, 0);
		this.mainScene.scene.add(lightTarget);
		this.dirLight.target = lightTarget;

		this.createDifficultyButtons();
		this.createLogo();

		window.addEventListener("resize", this.layoutDifficultyButtonsBound);
		window.addEventListener("resize", this.layoutLogoBound);

		super.init();
	}

    /**
     * Handle difficulty button clicks
     */
	private onDifficultyButtonClick(
		difficulty: DIFFICULTY
	): void {
		this.mainScene.ui.removeChild(this.difficultyButtonsContainer);
		this.difficultyButtons.forEach((b) => b.dispose());
		this.difficultyButtons = [];
		this.mainScene.loadingOverlay.show(() => {
			this.mainScene.startGame(difficulty);
		});
	}

	/**
	 * Create difficulty selection buttons
	 */
	private createDifficultyButtons(): void {
		this.difficultyButtonsContainer = new PixiContainer();
		this.mainScene.ui.addChild(this.difficultyButtonsContainer);

		const btnEasy = new DifficultyButton({
			label: "Easy",
			width: DIFF_BUTTON_WIDTH,
			height: DIFF_BUTTON_HEIGHT,
			color1: BUTTON_EASY_COLOR1,
			color2: BUTTON_EASY_COLOR2,
			onClick: () => {
				this.onDifficultyButtonClick(DIFFICULTY.EASY);
			}
		});

		const btnMedium = new DifficultyButton({
			label: "Medium",
			width: DIFF_BUTTON_WIDTH,
			height: DIFF_BUTTON_HEIGHT,
			color1: BUTTON_MEDIUM_COLOR1,
			color2: BUTTON_MEDIUM_COLOR2,
			onClick: () => {
				this.onDifficultyButtonClick(DIFFICULTY.MEDIUM);
			}
		});

		const btnHard = new DifficultyButton({
			label: "Hard",
			width: DIFF_BUTTON_WIDTH,
			height: DIFF_BUTTON_HEIGHT,
			color1: BUTTON_HARD_COLOR1,
			color2: BUTTON_HARD_COLOR2,
			onClick: () => {
				this.onDifficultyButtonClick(DIFFICULTY.HARD);
			}
		});

		this.difficultyButtonsContainer.addChild(btnEasy, btnMedium, btnHard);
		this.difficultyButtons.push(btnEasy, btnMedium, btnHard);

		this.layoutDifficultyButtons();
	}

    /**
     * Layout the difficulty buttons centered in the bottom third of the screen
     */
	private layoutDifficultyButtons(): void {
		const spacing = 24;
		const totalWidth =
			this.difficultyButtons.length * DIFF_BUTTON_WIDTH +
			(this.difficultyButtons.length - 1) * spacing;

		const startX = (window.innerWidth - totalWidth) / 2;
		const bottomThirdTop = window.innerHeight * (2 / 3);
		const bottomThirdHeight = window.innerHeight / 3;
		const y = Math.round(
			bottomThirdTop + bottomThirdHeight / 2 - DIFF_BUTTON_HEIGHT / 2
		);

		this.difficultyButtons.forEach((btn, i) => {
			btn.x = startX + i * (DIFF_BUTTON_WIDTH + spacing);
			btn.y = y;
		});
	}

    /**
     * Create logo sprite from loaded assets (alias 'logo') and add to Pixi UI
     */
	private createLogo(): void {
		const asset = this.mainScene.loader.assets.get("logo");
		if (!asset) return;

		this.logoContainer = new PixiContainer();
		this.logoSprite = new Sprite(asset as any);
		this.logoContainer.addChild(this.logoSprite);
		this.mainScene.ui.addChild(this.logoContainer);
		this.layoutLogo();
	}

    /**
     * Layout the logo centered in the top third of the screen
     */
	private layoutLogo(): void {
		const topThirdHeight = window.innerHeight / 3;
		const tex = this.logoSprite.texture;
		const texW = (tex && (tex.width as number)) || this.logoSprite.width || 1;
		const texH = (tex && (tex.height as number)) || this.logoSprite.height || 1;

		const scale = Math.min(1, window.innerWidth / texW, topThirdHeight / texH);
		this.logoSprite.scale.set(scale, scale);

		const centerX = Math.round(window.innerWidth / 2 - this.logoSprite.width / 2);
		const centerY = Math.round(topThirdHeight / 2 - this.logoSprite.height / 2);

		this.logoContainer.x = centerX;
		this.logoContainer.y = centerY;
	}

	/**
	 * Calculate the target position for the directional light based on mouse position
	 * and camera orientation.
	 */
	private getLightTargetPosition() {
		const camDir = new Vector3();
		this.mainScene.camera.getWorldDirection(camDir);

		const camRight = camDir.clone().cross(this.mainScene.camera.up).normalize();
		const camUp = this.mainScene.camera.up.clone().normalize();

		const mouseOffsetX = camRight
			.clone()
			.multiplyScalar(this.mouse.x * this.lightDistance);
		const mouseOffsetY = camUp
			.clone()
			.multiplyScalar(this.mouse.y * this.lightDistance);

		const baseTarget = this.mainScene.camera.position
			.clone()
			.add(camDir.clone().multiplyScalar(5));

		return baseTarget.add(mouseOffsetX).add(mouseOffsetY);
	}

	/**
	 * Update the scene each frame (called from the main animation loop)
	 */
	public tick(delta: number): void {
		this.mine.rotation.y += 0.002;
        this.mine.rotation.x += 0.002;
		const targetPos = this.getLightTargetPosition();
		this.lightTargetPos.lerp(targetPos, this.damping);
		this.dirLight.position.copy(this.lightTargetPos);
		this.dirLight.target.position.set(0, 0, 0);

		if (this.dirLightHelper) this.dirLightHelper.update();

        super.tick(delta);
	}

	/**
	 * Dispose of the intro scene and its resources
	 */
	public dispose(): void {
		window.removeEventListener("resize", this.layoutDifficultyButtonsBound);
		window.removeEventListener("resize", this.layoutLogoBound);

		if (this.dirLightHelper) {
			this.mainScene.scene.remove(this.dirLightHelper);
			this.dirLightHelper.dispose();
		}

		if (this.dirLight) {
			this.mainScene.scene.remove(this.dirLight);
			this.dirLight.dispose();
		}

		if (this.ambientLight) {
			this.mainScene.scene.remove(this.ambientLight);
			this.ambientLight.dispose();
		}

		if (this.mine)
            this.mainScene.scene.remove(this.mine);

		if (this.logoContainer && this.mainScene.ui)
			this.mainScene.ui.removeChild(this.logoContainer);

        super.dispose();
	}

	/**
	 * Initialize debug helpers (if in development mode)
	 */
	public initDebugHelpers(): void {
		this.dirLightHelper = new DirectionalLightHelper(this.dirLight);
		this.mainScene.scene.add(this.dirLightHelper);
	}
}
