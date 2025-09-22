import type { UnresolvedAsset } from "pixi.js";

type AssetDefinition = { alias: string, src: string };
export type PixiAsset = UnresolvedAsset<AssetDefinition>;
export type ThreeAsset = AssetDefinition & { type: 'texture' };

export const pixiAssets: Array<PixiAsset> = [
    {
        alias: 'logo',
        src: 'assets/logo.png'
    }
];

export const threeAssets: Array<ThreeAsset> = [
    
];