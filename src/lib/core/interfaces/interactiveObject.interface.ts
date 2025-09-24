import type { Group } from "three";

export interface IInteractiveObject extends Group {
    onClick(): void;
    onRightClick(): void;
    onMouseOver(): void;
    onMouseOut(): void;
};