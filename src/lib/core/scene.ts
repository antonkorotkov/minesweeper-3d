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

        window.addEventListener('mousemove', this.mouseMoveHandler);
        window.addEventListener('click', this.mouseClickHandler);
        window.addEventListener('contextmenu', this.mouseContextMenuHandler);
    }

    /**
     * Get the singleton instance of the Raycaster
     */
    private getRayCaster(): Raycaster {
        if (!this.rayCaster)
            this.rayCaster = new Raycaster();

        return this.rayCaster;
    }

    /**
     * Add an interactive object to the scene
     */
    protected addInteractiveObject(object: IInteractiveObject): void {
        this.interactiveObjects.add(object);
    }

    /**
     * Initialize the scene
     */
    protected init(): void {
        if (isDev()) this.initDebugHelpers();
    }

    /**
     * Handle mouse move events
     */
    protected mouseMoveHandler = (event: MouseEvent) => {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (!this.rayCasterEnabled)
            return;

        const rayCaster = this.getRayCaster();
        rayCaster.setFromCamera(this.mouse, this.mainScene.camera);
        const intersects = rayCaster.intersectObjects([...this.interactiveObjects]);

        if (intersects.length > 0) {
            const obj = this.getDeepestInteractiveObject(intersects[intersects.length - 1].object.parent as IInteractiveObject);
            if (!obj) return;

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

    private getDeepestInteractiveObject(object: IInteractiveObject): IInteractiveObject | null {
        let current: IInteractiveObject | null = object;
        while (current) {
            if (this.interactiveObjects.has(current)) {
                return current;
            }
            current = current.parent as IInteractiveObject | null;
        }

        return null;
    }

    /**
     * Handle mouse click events
     */
    protected mouseClickHandler = () => {
        if (this.hoveredObject)
            this.hoveredObject.onClick();
    };

    /**
     * Handle right-click (context menu) events
     */
    protected mouseContextMenuHandler = (event: MouseEvent) => {
        event.preventDefault();

        if (this.hoveredObject)
            this.hoveredObject.onRightClick();
    }

    /**
     * Dispose of the scene and its resources
     */
    dispose(): void {
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        window.removeEventListener('click', this.mouseClickHandler);
        window.removeEventListener('contextmenu', this.mouseContextMenuHandler);
    }

    /**
     * Update the scene each frame (called from the main animation loop)
     */
    tick(_delta: number): void {};
}