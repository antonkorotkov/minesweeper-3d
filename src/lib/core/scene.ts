import { Raycaster, Vector2 } from "three";
import type { IScene } from "./interfaces/scene.interface";
import Singleton from "./singleton";
import type { IMainScene } from "./interfaces/mainScene.interface";
import type { IInteractiveObject } from "./interfaces/interactiveObject.interface";
import { isDev } from "./utils";

export default abstract class Scene extends Singleton implements IScene {
    protected mainScene!: IMainScene;
    protected mouse = new Vector2(0, 0);
    protected rayCasterEnabled: boolean = false;

    private rayCaster?: Raycaster;
    private interactiveObjects: Set<IInteractiveObject> = new Set();
    private hoveredObject: IInteractiveObject | null = null;

    abstract initDebugHelpers(): void;

    constructor() {
        super();

        window.addEventListener("mousemove", this.mouseMoveHandler);
    }

    private getRayCaster(): Raycaster {
        if (!this.rayCaster)
            this.rayCaster = new Raycaster();

        return this.rayCaster;
    }

    tick(_delta: number): void {};

    protected addInteractiveObject(object: IInteractiveObject): void {
        this.interactiveObjects.add(object);
    }

    protected init(): void {
        if (isDev()) this.initDebugHelpers();
    }

    protected mouseMoveHandler = (event: MouseEvent) => {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (!this.rayCasterEnabled)
            return;

        const rayCaster = this.getRayCaster();
        rayCaster.setFromCamera(this.mouse, this.mainScene.camera);
        const intersects = rayCaster.intersectObjects([...this.interactiveObjects]);

        if (intersects[0]) {
            const obj = intersects[0].object.parent as IInteractiveObject;

            if (this.hoveredObject && this.hoveredObject !== obj)
                this.hoveredObject.onMouseOut();

            if (this.hoveredObject === obj)
                return;

            this.hoveredObject = obj;
            obj.onMouseOver();
        }
        else if (this.hoveredObject) {
            this.hoveredObject.onMouseOut();
            this.hoveredObject = null;
        }
	};

    dispose(): void {
        window.removeEventListener("mousemove", this.mouseMoveHandler);
    }
}