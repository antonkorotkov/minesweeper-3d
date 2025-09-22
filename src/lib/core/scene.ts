import { Raycaster, Vector2 } from "three";
import type { IScene } from "./interfaces/scene.interface";
import Singleton from "./singleton";
import type { IMainScene } from "./interfaces/mainScene.interface";

export default abstract class Scene extends Singleton implements IScene {
    protected mainScene!: IMainScene;
    protected mouse = new Vector2(0, 0);
    protected rayCasterEnabled: boolean = false;
    private rayCaster: Raycaster = new Raycaster();

    constructor() {
        super();

        window.addEventListener("mousemove", this.mouseMoveHandler);
    }

    abstract initDebugHelpers(): void;

    tick(_delta: number): void {
        if (this.rayCasterEnabled) {
            this.rayCaster.setFromCamera(this.mouse, this.mainScene.camera);
            this.rayCaster.intersectObjects(this.mainScene.scene.children, true);
        }
    };

    protected init(): void {
        const isDev =
            typeof import.meta !== "undefined" && import.meta.env.DEV === true;
        if (isDev) this.initDebugHelpers();
    }

    protected mouseMoveHandler = (event: MouseEvent) => {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	};

    dispose(): void {
        window.removeEventListener("mousemove", this.mouseMoveHandler);
    }
}