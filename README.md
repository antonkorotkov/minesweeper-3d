# 🎮 Minesweeper 3D

A modern, interactive 3D implementation of the classic Minesweeper game built with Three.js and Pixi.js.

![Three.js](https://img.shields.io/badge/Three.js-0.179.1-blue.svg)
![Pixi.js](https://img.shields.io/badge/Pixi.js-8.13.0-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)

## 🎯 Features

- **3D Gameplay**: Interactive 3D minefield with smooth camera controls
- **Multiple Difficulties**: Easy, Medium, and Hard difficulty levels
- **Visual Effects**:
  - Animated mine explosions with particle effects
  - Smooth camera-facing numbers with delayed animations
  - Block reveal animations with elastic easing
  - Flag placement with bouncing effects
  - Win celebration with staggered mine reveals

## 📸 Screenshots

![2025-11-05_10-23-51](https://github.com/user-attachments/assets/2193ccc0-f256-4bf3-82fc-4a84b3531295)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/antonkorotkov/minesweeper-3d.git
cd minesweeper-3d
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

## 🎮 How to Play

1. **Start the Game**: Select a difficulty level (Easy, Medium, or Hard)
2. **Reveal Blocks**: Left-click on blocks to reveal them
3. **Place Flags**: Right-click on blocks to place/remove flags
4. **Win Condition**: Reveal all non-mine blocks
5. **Game Over**: Clicking a mine triggers an explosion effect

### Controls

- **Left Click**: Reveal a block
- **Right Click**: Place/remove flag
- **Mouse Drag**: Rotate camera view
- **Scroll**: Zoom in/out

## 🛠️ Technical Details

### Technologies Used

- **Three.js** (v0.179.1): 3D rendering engine
- **Pixi.js** (v8.13.0): 2D UI overlay
- **TypeScript** (v5.8.3): Type-safe development
- **Vite**: Fast build tool and dev server
- **TWEEN.js**: Smooth animations

### Architecture Patterns

- **Singleton Pattern**: Resource management (materials, geometries, loaders)
- **Event-Driven**: Asset loading with nanoevents
- **Component-Based**: Reusable UI and 3D components
- **Scene Management**: Separate intro and game scenes with lifecycle methods

### Key Features Implementation

#### Raycasting System

- Custom scene-based raycaster for block selection
- Hover detection with onMouseOver/onMouseOut callbacks
- Click prevention during camera drag
- Deep object traversal for interactive elements

#### Animation System

- TWEEN.js for smooth animations
- Elastic easing for block reveals
- Quaternion interpolation for camera-facing numbers
- Particle system for mine explosions

#### Shadow System

- Directional light with shadow mapping
- Dynamic shadow camera configuration
- Shadow helpers for debugging
- Optimized shadow map size (2048x2048)

#### Material Management

- Shared materials via singleton pattern
- Per-block material cloning for hover effects
- Dynamic material switching for game states

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

- GitHub: [@antonkorotkov](https://github.com/antonkorotkov)

## 🙏 Acknowledgments

- Original Minesweeper game concept by Microsoft
- Three.js community for excellent 3D framework
- Pixi.js team for powerful 2D rendering
