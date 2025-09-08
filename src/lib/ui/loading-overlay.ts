'use strict';

import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class LoadingOverlay extends Container {
    private view!: Graphics;
    private percentText!: Text;
    private scene!: Application;

    constructor(scene: Application) {
        super();
        this.scene = scene;
        this.init();
        this.setProgress(0);
    }

    public hide(): void {
        new TWEEN.Tween(this.percentText)
            .to({ alpha: 0 }, 1000)
            .easing(TWEEN.Easing.Linear.None)
            .start();

        new TWEEN.Tween(this.view)
            .delay(1000)
            .to({ alpha: 0 }, 1000)
            .easing(TWEEN.Easing.Linear.None)
            .start()
            .onComplete(() => {
                this.visible = false;
            });
    }

    public show(callback: () => void): void {
        this.visible = true;
        new TWEEN.Tween(this.view)
            .to({ alpha: 1 }, 1000)
            .easing(TWEEN.Easing.Linear.None)
            .start()
            .onComplete(callback);
    }

    private init(): void {
        this.view = new Graphics();
        this.addChild(this.view);
        this.view.rect(0, 0, window.innerWidth, window.innerHeight)
            .fill({ color: 0x000000, alpha: 1 });

        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fill: '#ffffff',
            fontWeight: 'bold',
            align: 'center',
            dropShadow: true,
        });
        this.percentText = new Text({ text: 'Loading... 0%', style });
        this.percentText.anchor.set(0.5);
        this.percentText.x = window.innerWidth / 2;
        this.percentText.y = window.innerHeight / 2;
        this.addChild(this.percentText);

        this.scene.stage.addChild(this);
    }

    /**
     * Set and update the loading percentage text in the center of the overlay.
     */
    public setProgress(percent: number): void {
        const clamped = Math.max(0, Math.min(100, Math.round(percent)));
        this.percentText.text = `Loading... ${clamped}%`;
        // Re-center in case of window resize or text width change
        this.percentText.x = window.innerWidth / 2;
        this.percentText.y = window.innerHeight / 2;
    }
}