import "./style.css";
import MainScene from "./lib/scenes/main.scene";

MainScene.init();

/** *
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
// --- Core setup ---
const canvas = document.getElementById("three") as HTMLElement;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10131a);

const camera = new THREE.PerspectiveCamera(
	55,
	window.innerWidth / window.innerHeight,
	0.1,
	100
);
camera.position.set(4, 3.5, 4.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight.position.set(5, 10, 2);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

// --- Water (square plane) ---
const size = 4.0; // square size (meters / arbitrary units)
const segments = 200; // more segments -> smoother waves
const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
geometry.rotateX(-Math.PI / 2); // lay flat on XZ plane

// Simple multi-wave Gerstner-ish displacement via ShaderMaterial
const uniforms = {
	uTime: { value: 0 },
	uAmp: { value: 0.022 }, // overall amplitude
	uChop: { value: 0.1 }, // shape/choppiness factor (used for horizontal push)
	uDeepColor: { value: new THREE.Color("#0b4f6c") },
	uShallowColor: { value: new THREE.Color("#3ec5ff") },
	uFresnelColor: { value: new THREE.Color("#ffffff") },
	uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.2).normalize() },
	uEnvStrength: { value: 0.25 },
	uSpecular: { value: 0.8 }
};

const vertexShader = `
      uniform float uTime;
      uniform float uAmp;
      uniform float uChop;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying float vHeight;

      // 3 directional waves
      vec3 wave(in vec3 p, vec2 dir, float steep, float lambda, float speed) {
        float k = 6.28318530718 / lambda; // 2π / wavelength
        float phase = speed * uTime * k;
        float f = dot(dir, p.xz) * k + phase;
        float a = steep * uAmp;
        // vertical displacement
        float y = a * sin(f);
        // horizontal displacement for choppy crests
        vec2 d = dir * (a * uChop * cos(f));
        return vec3(p.x + d.x, p.y + y, p.z + d.y);
      }

      void main() {
        vec3 p = position; // plane already rotated to XZ
        // Normalize directions
        vec2 d1 = normalize(vec2( 1.0,  0.2));
        vec2 d2 = normalize(vec2(-0.6,  1.0));
        vec2 d3 = normalize(vec2( 0.3, -1.0));

        // apply three waves with different wavelengths & speeds
        p = wave(p, d1, 1.00, 1.50, 0.35);
        p = wave(p, d2, 0.65, 0.80, 0.55);
        p = wave(p, d3, 0.45, 0.45, 0.90);

        vHeight = p.y;
        vec4 worldPos = modelMatrix * vec4(p, 1.0);
        vWorldPos = worldPos.xyz;

        // Recompute normal via partial derivatives (screen-space derivatives)
        // Requires OES_standard_derivatives in WebGL1 (handled by three.js)
        // We approximate by sampling neighboring positions in object space
        float eps = 0.001;
        vec3 px = position + vec3(eps, 0.0, 0.0);
        vec3 pz = position + vec3(0.0, 0.0, eps);
        px = wave(px, d1, 1.00, 1.50, 0.35);
        px = wave(px, d2, 0.65, 0.80, 0.55);
        px = wave(px, d3, 0.45, 0.45, 0.90);
        pz = wave(pz, d1, 1.00, 1.50, 0.35);
        pz = wave(pz, d2, 0.65, 0.80, 0.55);
        pz = wave(pz, d3, 0.45, 0.45, 0.90);

        vec3 dx = px - p;
        vec3 dz = pz - p;
        vec3 n = normalize(cross(dz, dx));
        vNormal = normalize((modelMatrix * vec4(n, 0.0)).xyz);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

const fragmentShader = `
      precision highp float;
      uniform vec3 uDeepColor;
      uniform vec3 uShallowColor;
      uniform vec3 uFresnelColor;
      uniform vec3 uLightDir;
      uniform float uEnvStrength;
      uniform float uSpecular;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      varying float vHeight;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 L = normalize(uLightDir);
        vec3 V = normalize(cameraPosition - vWorldPos);
        vec3 H = normalize(L + V);

        // simple diffuse + specular
        float diff = max(dot(N, L), 0.0);
        float spec = pow(max(dot(N, H), 0.0), 64.0) * uSpecular;

        // color blend by height (shallower crests are lighter)
        float h = clamp(vHeight * 4.0 + 0.5, 0.0, 1.0);
        vec3 base = mix(uDeepColor, uShallowColor, h);

        // Fake fresnel rim
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        vec3 fres = uFresnelColor * fresnel * 0.5;

        // Environment tint (cheap): brighten based on upward-facing normal
        float sky = pow(max(N.y, 0.0), 2.0) * uEnvStrength;

        vec3 color = base * (0.15 + 0.85 * diff + sky) + fres + spec;
        gl_FragColor = vec4(color, 0.95);
      }
    `;

const material = new THREE.ShaderMaterial({
	uniforms,
	vertexShader,
	fragmentShader,
	transparent: true
});

const water = new THREE.Mesh(geometry, material);
water.receiveShadow = false;
water.castShadow = false;
scene.add(water);

// Add a subtle rim so it looks like a square "object"
const rimGeo = new THREE.BoxGeometry(size, 0.05, size);
const rimMat = new THREE.MeshStandardMaterial({
	color: 0x0b1730,
	metalness: 0.1,
	roughness: 0.9
});
const rim = new THREE.Mesh(rimGeo, rimMat);
rim.position.y = -0.05;
scene.add(rim);

// Ground for contrast
const ground = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({ color: 0x0a0c12, roughness: 1.0 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.051;
scene.add(ground);

// Resize
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
const clock = new THREE.Clock();
function tick() {
	uniforms.uTime.value = clock.getElapsedTime() / 4;
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}
tick();
*/

// import * as THREE from 'three';

// // Scene setup
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);

// const camera = new THREE.PerspectiveCamera(
//   45,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.set(3, 3, 5);
// camera.lookAt(0, 1, 0);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Lighting
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(5, 10, 5);
// scene.add(light);
// scene.add(new THREE.AmbientLight(0x888888));

// // Materials
// const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
// const redMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });

// // --- Flag parts ---

// // Base - top level
// const baseTop = new THREE.Mesh(
//   new THREE.BoxGeometry(0.6, 0.2, 0.4),
//   blackMat
// );
// baseTop.position.y = 0;
// scene.add(baseTop);

// // Pole
// const pole = new THREE.Mesh(
//   new THREE.BoxGeometry(0.08, 2.8, 0.08),
//   blackMat
// );
// pole.position.set(0, 1.4, 0);
// scene.add(pole);

// // Flag (red triangle)
// const flagShape = new THREE.Shape();
// flagShape.moveTo(0, 0);
// flagShape.lineTo(0, 1.2);
// flagShape.lineTo(1.4, 0.6);
// flagShape.lineTo(0, 0);

// const flagGeom = new THREE.ExtrudeGeometry(flagShape, { depth: 0.05, bevelEnabled: false });
// const flag = new THREE.Mesh(flagGeom, redMat);

// // Align and attach flag to the top of the pole
// flag.position.set(-0.03, 1.5, 0);
// flag.rotation.y = Math.PI / 2;
// scene.add(flag);

// // Animation loop
// function animate() {
//   requestAnimationFrame(animate);
//   scene.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }
// animate();

// // Handle resize
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });