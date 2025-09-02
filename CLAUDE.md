# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blockenspiel is a 2D browser-based block-building game with a futuristic city setting featuring "Blue Steve" with jetpack mechanics. The game runs directly in the browser using vanilla JavaScript and HTML5 Canvas.

## Development Commands

This is a vanilla JavaScript project without a build system. To develop:

1. **Local Development**: Open `index.html` directly in a browser or serve via any HTTP server
2. **Testing**: No automated tests - test manually by opening the game in browser
3. **Live Server**: Use `python -m http.server 8000` or any static server for development

## Architecture

The game follows a modular class-based architecture with clear separation of concerns:

### Core Module Structure

- **`js/game.js`**: Main game controller and entry point
  - Manages game states (PLAYING, LOGO_SCREEN)
  - Coordinates all other systems
  - Handles game loop and event routing

- **`js/world.js`**: World generation and block management
  - Procedural terrain generation with futuristic city elements
  - Block storage using Map with coordinate-based keys
  - City generation with buildings, roads, and vehicles

- **`js/player.js`**: Player mechanics and controls
  - Jetpack physics and movement system
  - Smart spawn position finding
  - Wall mining toggle functionality

- **`js/renderer.js`**: Rendering system
  - Canvas-based 2D isometric-style rendering
  - Camera system following player
  - Block type visual differentiation

- **`js/math.js`**: Vector mathematics utilities
  - Vec3 class for 3D coordinate handling
  - Mathematical operations for game physics

- **`js/logo-patterns.js`**: Interactive logo screen
  - Animated logo display with credit system
  - Pattern-based logo rendering

### Key Architecture Patterns

**Coordinate System**: Uses a 3D coordinate system (x, y, z) with y-axis as height, rendered in 2D isometric view.

**Block Management**: World uses Map-based storage with string keys (`"x,y,z"`) for efficient block lookup and modification.

**Game States**: State machine pattern managing logo screen vs. gameplay modes.

**Event-Driven Input**: Centralized event handling in Player class with key state tracking.

## Block Types

The game supports 18 different block types (1-18):
- Grass (1), Dirt (2), Stone (3), Gold Ore (4), Bedrock (5)
- Sand (6), Snow (7), Water (8), Wood (9), Leaves (10)
- Crystal (11), Default (12), Concrete (13), Glass/Metal (14)
- Interior (15), Window (16), Road (17), Car (18)

## File Structure

```
/
├── index.html          # Main HTML entry point
├── debug.html          # Debug version with additional logging
├── js/
│   ├── game.js         # Main game controller
│   ├── world.js        # World generation and block management
│   ├── player.js       # Player mechanics and controls
│   ├── renderer.js     # Canvas rendering system
│   ├── math.js         # Vector math utilities
│   └── logo-patterns.js # Logo screen functionality
└── public/
    ├── index.html      # GitHub Pages deployment version
    └── js/             # Symlinked JS files for deployment
```

## Development Notes

- **No Build System**: Direct script includes, edit files and refresh browser
- **Vanilla JavaScript**: ES6 classes, no frameworks or external dependencies
- **Canvas Rendering**: Custom 2D isometric renderer without WebGL
- **GitHub Pages**: Deployed automatically from `/public` directory