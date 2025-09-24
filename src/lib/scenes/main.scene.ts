import { Clock, Color, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import {
    Application as PixiApp,
    Ticker as PixiTicker,
    Container as PixiContainer
} from 'pixi.js';
import { Stats } from 'stats.ts';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import AssetsLoader from '../assets/assets.loader';
import { pixiAssets, threeAssets } from '../assets/assets';

import {
    CAMERA_FAR, CAMERA_FOV, CAMERA_NEAR, CONTROLS_DAMPING_FACTOR, CONTROLS_ENABLE_DAMPING,
    CONTROLS_MAX_DISTANCE, CONTROLS_MAX_POLAR_ANGLE, CONTROLS_MIN_DISTANCE, CONTROLS_MIN_POLAR_ANGLE,
    CONTROLS_SCREEN_SPACE_PANNING, DEFAULT_PIXEL_RATIO, SCENE_BACKGROUND_COLOR
} from './const';
import LoadingOverlay from '../ui/loading-overlay';
import Singleton from '../core/singleton';
import IntroScene from './intro.scene';
import GameScene from './game.scene';
import type DIFFICULTY from '../core/enums/difficulty';
import type { IMainScene } from '../core/interfaces/mainScene.interface';
import { isDev } from '../core/utils';

/**
 * Main scene for the game
 */
export default class MainScene extends Singleton implements IMainScene {
    public loader!: AssetsLoader;
    public scene!: Scene;
    public pixiScene!: PixiApp;
    public ui!: PixiContainer;
    public camera!: PerspectiveCamera;
    public renderer!: WebGLRenderer;

    // @TODO: Move to the Scene level abstraction
    public controls!: OrbitControls;

    public loadingOverlay!: LoadingOverlay;
    private introScene?: IntroScene;
    private gameScene?: GameScene;
    private stats?: Stats;

    /**
     * Constructor for the main scene
     */
	constructor() {
        super();

        if (isDev()) {
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
        }

        this.init();
	}

    /**
     * Initialize the main scene
     */
    static init(): MainScene {
        return this.getSingleton<MainScene>();
    }

    /**
     * Initialize the main scene
     */
    private async init(): Promise<void> {
        await this.initPixi();
        this.initLoader();
    }

    /**
     * Initialize the asset loader
     */
    private initLoader(): void {
        this.loadingOverlay = new LoadingOverlay(this.pixiScene);
        this.loader = AssetsLoader.getInstance();

        this.loader.on('progress', (progress) => {
            console.log(`Loading progress: ${progress}%`);
            this.loadingOverlay.setProgress(progress);
        });

        this.loader.on('complete', () => {
            this.initThreeJS();
            this.introScene = IntroScene.getInstance(this);
            this.startAnimation();
        });

        this.loader.on('error', (err) => {
            alert(`Error loading assets: ${err}`);
        });

        this.loader.load({ pixiAssets, threeAssets });
    }

    /**
     * Initialize the Pixi.js application
     */
    private async initPixi(): Promise<void> {
        const canvas = document.getElementById('pixi') as HTMLCanvasElement;
        this.pixiScene = new PixiApp();

        await this.pixiScene.init({
            canvas,
            autoDensity: true,
            width: window.innerWidth,
            height: window.innerHeight,
            resizeTo: window,
            backgroundAlpha: 0,
        });

        PixiTicker.shared.autoStart = false;
        PixiTicker.shared.stop();

        this.ui = new PixiContainer();
        this.pixiScene.stage.addChild(this.ui);
    }

    /**
     * Initialize the Three.js components
     */
	private initThreeJS(): void {
		this.initScene();
		this.initCamera();
		this.initRenderer();
        this.initControls();
	}

    /**
     * Initialize the scene
     */
	private initScene(): void {
		this.scene = new Scene();
        this.scene.background = new Color(SCENE_BACKGROUND_COLOR);
	}

    /**
     * Initialize the camera
     */
	private initCamera(): void {
		this.camera = new PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);
        this.camera.position.set(5, 5, 7);
        window.addEventListener('resize', this.onResize.bind(this));

        this.scene.add(this.camera);
	}

    /**
     * Initialize the renderer
     */
	private initRenderer(): void {
        const container = document.getElementById('three') as HTMLCanvasElement;
		this.renderer = new WebGLRenderer({
            canvas: container,
            antialias: true
        });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        this.setupRenderer();
	}

    /**
     * Initialize the orbit controls
     */
    private initControls(): void {
        this.controls = new OrbitControls(this.camera, this.pixiScene.renderer.canvas);
        this.controls.enableDamping = CONTROLS_ENABLE_DAMPING;
        this.controls.dampingFactor = CONTROLS_DAMPING_FACTOR;
        this.controls.minPolarAngle = CONTROLS_MIN_POLAR_ANGLE;
        this.controls.maxPolarAngle = CONTROLS_MAX_POLAR_ANGLE;
        this.controls.minDistance = CONTROLS_MIN_DISTANCE;
        this.controls.maxDistance = CONTROLS_MAX_DISTANCE;
        this.controls.screenSpacePanning = CONTROLS_SCREEN_SPACE_PANNING;
    }

    /**
     * Handle window resize events
     */
    private onResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.setupRenderer();
    }

    /**
     * Setup the renderer
     */
    private setupRenderer(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, DEFAULT_PIXEL_RATIO));
    }

    /**
     * Start the animation loop
     */
    private startAnimation(): void {
        const clock = new Clock();

        const animate = () => {
            this.stats?.begin();

            const delta = clock.getDelta();
            this.renderer.render(this.scene, this.camera);
            this.controls.update(delta);
            PixiTicker.shared.update(performance.now());
            TWEEN.update();

            if (this.introScene)
                this.introScene.tick(delta);

            if (this.gameScene)
                this.gameScene.tick(delta);

            this.stats?.end();

            window.requestAnimationFrame(animate);
        };

        animate();
    }

    public startGame(difficulty: DIFFICULTY): void {
        this.introScene?.dispose();
        this.gameScene = GameScene.getInstance(this);
        this.gameScene.start(difficulty);
        this.loadingOverlay.hide();
    }
}