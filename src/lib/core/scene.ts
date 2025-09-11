'use strict';

import { Vector2 } from "three";
import type { IScene } from "./interfaces/scene.interface";
import Singleton from "./singleton";

export default abstract class Scene extends Singleton implements IScene {
    protected mouse = new Vector2(0, 0);

    constructor() {
        super();

        window.addEventListener("mousemove", this.mouseMoveHandler);
    }

    abstract initDebugHelpers(): void;
    abstract tick(delta: number): void;

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