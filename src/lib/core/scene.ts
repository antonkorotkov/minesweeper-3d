'use strict';

import type { IScene } from "./interfaces/scene.interface";
import Singleton from "./singleton";

export default abstract class Scene extends Singleton implements IScene {
    constructor() {
        super();
    }

    protected init(): void {
        const isDev =
            typeof import.meta !== "undefined" && import.meta.env.DEV === true;
        if (isDev) this.initDebugHelpers();
    }

    abstract initDebugHelpers(): void;

    abstract tick(delta: number): void;

    abstract dispose(): void;
}