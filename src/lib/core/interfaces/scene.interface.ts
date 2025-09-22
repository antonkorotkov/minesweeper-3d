export interface IScene {
    initDebugHelpers(): void;
    tick(delta: number): void;
    dispose(): void;
}