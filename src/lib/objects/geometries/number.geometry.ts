import { TextGeometry, type TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { MeshBasicMaterial, Mesh, Color } from 'three';
import f from '../../assets/font/helvetiker_regular.typeface.json';

const fontLoader = new FontLoader();
const font = fontLoader.parse(f);

const textGeometryParams: TextGeometryParameters = {
    font,
    size: 0.4,
    depth: 0.09,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5
};

const numberColors: { [key: number]: number } = {
    1: 0x0000FF, // Blue
    2: 0x008200, // Green
    3: 0xFF0000, // Red
    4: 0x000084, // Dark Blue
    5: 0x840000, // Dark Red
    6: 0x008284, // Cyan
    7: 0x000000, // Black
    8: 0x808080  // Gray
};

class NumberGeometry {
    private static instance: NumberGeometry;
    private geometries: Map<number, TextGeometry> = new Map();

    private constructor() {
        this.createGeometries();
    }

    static getInstance(): NumberGeometry {
        if (!NumberGeometry.instance) {
            NumberGeometry.instance = new NumberGeometry();
        }
        return NumberGeometry.instance;
    }

    private createGeometries(): void {
        for (let i = 1; i <= 8; i++) {
            const geometry = new TextGeometry(i.toString(), textGeometryParams);
            geometry.center();
            this.geometries.set(i, geometry);
        }
    }

    getGeometry(number: number): TextGeometry | undefined {
        return this.geometries.get(number);
    }

    getMaterial(number: number): MeshBasicMaterial {
        const colorHex = numberColors[number] ?? 0x000000;
        return new MeshBasicMaterial({ color: new Color(colorHex) });
    }

    createNumberMesh(number: number): Mesh | undefined {
        const geometry = this.getGeometry(number);
        if (!geometry)
            return undefined;

        const material = this.getMaterial(number);
        const mesh = new Mesh(geometry, material);
        mesh.castShadow = true;
        return mesh;
    }
}

export default NumberGeometry;