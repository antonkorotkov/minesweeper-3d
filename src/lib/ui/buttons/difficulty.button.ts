'use strict';

import { Container, Graphics, Text, TextStyle } from 'pixi.js';

type Options = {
    label: string;
    width: number;
    height: number;
    color1: number;
    color2: number;
    onClick: () => void;
};

/**
 * A button component for selecting difficulty levels
 */
export default class DifficultyButton extends Container {
    private g: Graphics = new Graphics();

    /**
     * Constructor for the difficulty button
     */
    constructor(options: Options) {
        super();

        this.interactive = true;
        (this as any).buttonMode = true;

        this.g.roundRect(0, 0, options.width, options.height, 8).fill({ color: options.color1, alpha: 1 });

        this.on('pointerover', () => {
            this.g.clear();
            this.g.roundRect(0, 0, options.width, options.height, 8).fill({ color: options.color2, alpha: 1 });
            try { (this as any).cursor = 'pointer'; } catch {}
        });

        this.on('pointerout', () => {
            this.g.clear();
            this.g.roundRect(0, 0, options.width, options.height, 8).fill({ color: options.color1, alpha: 1 });
            try { (this as any).cursor = 'default'; } catch {}
        });

        const style = new TextStyle({ fontFamily: 'Arial', fontSize: 20, fill: '#ffffff' });
        const t = new Text({ text: options.label, style });
        t.anchor.set(0.5);
        t.x = options.width / 2;
        t.y = options.height / 2;

        this.addChild(this.g);
        this.addChild(t);

        this.on('pointerdown', options.onClick);
    }

    /**
     * Dispose of the button and remove event listeners
     */
    public dispose(): void {
        this.off('pointerdown');
        this.off('pointerover');
        this.off('pointerout');
    }
}