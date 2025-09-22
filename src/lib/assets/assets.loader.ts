import { LoadingManager, TextureLoader, type Texture as ThreeTexture } from 'three';
import { Assets as PixiLoader, type Texture as PixiTexture, type UnresolvedAsset } from "pixi.js";
import { createNanoEvents, type Emitter } from "nanoevents";
import Singleton from "../core/singleton";
import type { PixiAsset, ThreeAsset } from "./assets";

type Asset = ThreeTexture | PixiTexture;
type LoaderOptions = {
    pixiAssets?: Array<PixiAsset>;
    threeAssets?: Array<ThreeAsset>;
};
type LoadedAssets = Map<string, Asset>;

interface AssetsLoaderEvents {
    progress: (progress: number) => void;
    complete: () => void;
    error: (error: unknown) => void;
}

/**
 * Asset loader class to manage loading of Pixi.js and Three.js assets
 */
export default class AssetsLoader extends Singleton {
    // Total number of assets to load
    private totalAssets: number = 0;

    // Total number of Pixi assets to load
    private totalPixiAssets: number = 0;

    // Event emitter for loader events
    private emitter: Emitter<AssetsLoaderEvents>;

    // Three.js texture loader
    private threeTextureLoader: TextureLoader;

    // Loaded assets
    public assets: LoadedAssets = new Map();

    /**
     * Constructor for the asset loader
     */
    private constructor() {
        super();
        this.emitter = createNanoEvents<AssetsLoaderEvents>();

        const threeLoadingManager = new LoadingManager(this.complete, this.threeAssetsProgress, this.threeAssetsError);
        this.threeTextureLoader = new TextureLoader(threeLoadingManager);
    }

    /**
     * The singleton instance of the AssetsLoader
     */
    static getInstance(): AssetsLoader {
        return this.getSingleton<AssetsLoader>();
    }

    /**
     * Called when all assets are loaded
     */
    private complete = () => {
        if (this.totalAssets === this.assets.size)
            this.emitter.emit('complete');
    }

    /**
     * Called when a Three.js asset fails to load
     */
    private threeAssetsError = (url: string) => {
        this.emitter.emit('error', new Error(`Error loading Three.js asset: ${url}`));
    }

    /**
     * Load Pixi assets
     */
    private async loadPixiAssets(pixiAssets: Array<UnresolvedAsset>) {
        try {
            const aliases: string[] = [];
            pixiAssets.forEach(asset => {
                if (asset.alias) {
                    PixiLoader.add(asset);
                    aliases.push(Array.isArray(asset.alias) ? asset.alias[0] : asset.alias);
                }
            });

            const loaded = await PixiLoader.load<Record<string, Asset>>(pixiAssets.map(asset => asset.alias), this.pixiLoadingProgress);
            aliases.forEach(alias => {
                this.assets.set(alias, loaded[alias] as Asset);
            });

            this.complete();
        } catch (error) {
            this.emitter.emit('error', error);
        }
    }

    /**
     * Load Three.js assets
     */
    private async loadThreeAssets(threeAssets: Array<ThreeAsset>) {
        try {
            threeAssets.filter(a => a.type === 'texture').forEach(asset => {
                this.assets.set(asset.alias, this.threeTextureLoader.load(asset.src) as Asset);
            });
        } catch (error) {
            this.emitter.emit('error', error);
        }
    }

    /**
     * Called during Pixi asset loading to report progress
     */
    private pixiLoadingProgress = (progress: number) => {
        const loadedAssets = progress * this.totalPixiAssets;
        this.emitter.emit('progress', Math.round(100 / this.totalAssets * loadedAssets));
    }

    /**
     * Called during Three.js asset loading to report progress
     */
    private threeAssetsProgress = (_url: string, itemsLoaded: number) => {
        const loadedAssets = itemsLoaded + this.totalPixiAssets;
        this.emitter.emit('progress', Math.round(100 / this.totalAssets * loadedAssets));
    }

    /**
     * Load assets
     */
    async load({ pixiAssets, threeAssets }: LoaderOptions): Promise<LoadedAssets> {
        if (pixiAssets) {
            this.totalPixiAssets = pixiAssets.length;
            this.totalAssets += this.totalPixiAssets;
        }

        if (threeAssets)
            this.totalAssets += threeAssets.length;

        if (pixiAssets)
            await this.loadPixiAssets(pixiAssets);

        if (threeAssets)
            await this.loadThreeAssets(threeAssets);

        return this.assets;
    }

    /**
     * Register an event listener
     */
    on<E extends keyof AssetsLoaderEvents>(event: E, callback: AssetsLoaderEvents[E]) {
        return this.emitter.on(event, callback)
    }
}