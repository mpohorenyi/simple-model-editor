# Simple Model Editor

A simple web editor for importing, editing, and configuring 3D models in the browser.

[Live Demo](https://simple-model-editor.vercel.app/)

## ✨ Key Features

- **Import 3D models** in GLB, GLTF, FBX formats
- **Edit object properties**:
  - Position
  - Rotation
  - Scale
- **Material management**:
  - Color
  - Opacity
  - Texture support (diffuse and normal maps)
- **Various rendering environments**
- **Option to use environment as background**

## 🔧 Technologies

- [Three.js](https://threejs.org/) - 3D WebGL library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vite](https://vitejs.dev/) - Modern frontend build tool

## 🏗️ Project Architecture

The project is built on a modular architecture using the Singleton pattern for core services:

```
App/
├─ Managers/
│  ├─ ImportManager      # Import of 3D models (GLB, GLTF, FBX)
│  ├─ MaterialManager    # Management of object materials, colors, and textures
│  ├─ ControlsManager    # Three.js transform controls (translation, rotation, scaling)
│  └─ EnvMapsManager     # Management of HDRI environment maps
│
├─ Singletons/
│  ├─ SceneManager       # Three.js scene and rendering management
│  ├─ EventBus           # Event system for communication between components
│  └─ LoadingManager     # Resource loading process management
│
└─ UI/
   ├─ UIManager          # Management of all UI components
   ├─ ObjectPanel        # Panel for editing object properties
   ├─ MaterialPanel      # Panel for editing materials
   └─ EnvMapsPanel       # Panel for selecting HDRI environment maps
```

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mpohorenyi/simple-model-editor.git
cd simple-model-editor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run format` - Format code
- `npm run type-check` - Run TypeScript type checking

## 🛠️ Usage

1. **Import model**: Click the "Import Model" button and select a model file (GLB, GLTF, FBX formats supported)
2. **Edit position, rotation and scale**: Use the corresponding fields in the "OBJECT" tab
3. **Edit materials**: Switch to the "MATERIAL" tab to change color, opacity, and textures
4. **Change environment**: Select one of the available HDRI environments and activate the "Use as background" option if needed
5. **Transform controls shortcuts**:
   - Click on an object to select it
   - Press `W` to switch to translation mode
   - Press `E` to switch to rotation mode
   - Press `R` to switch to scaling mode
   - Use the transform handles to manipulate the selected object
