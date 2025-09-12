'use strict';

import type { Application, Container } from "pixi.js";
import type { PerspectiveCamera, Scene } from "three";
import type { OrbitControls } from "three/examples/jsm/Addons.js";
import type LoadingOverlay from "../../ui/loading-overlay";
import type AssetsLoader from "../../assets/assets.loader";
import type DIFFICULTY from "../enums/difficulty";

// @TODO: fix interfaces
export interface IMainScene {
    camera: PerspectiveCamera;
    scene: Scene;
    pixiScene: Application;
    ui: Container;
    controls: OrbitControls;
    loadingOverlay: LoadingOverlay;
    loader: AssetsLoader;
    startGame(difficulty: DIFFICULTY): void;
}