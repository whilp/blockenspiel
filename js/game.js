class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.world = new World();
        this.logoWorld = null; // Will be initialized when needed
        this.player = new Player();
        this.lastTime = 0;
        this.isRunning = false;
        this.selectedBlockType = 1;
        this.debugClick = null;
        

        // Game states
        this.GAME_STATES = {
            PLAYING: 'playing',
            LOGO_SCREEN: 'logo_screen'
        };
        this.currentState = this.GAME_STATES.PLAYING;
        this.savedPlayerPosition = null; // To restore player position when returning from logo
        // Set safe spawn position after world generation
        this.player.findSafeSpawnPosition(this.world);
        
        this.setupEventListeners();
        this.start();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {

            const rect = this.canvas.getBoundingClientRect();
            const canvasX = e.clientX - rect.left;
            const canvasY = e.clientY - rect.top;
            
            this.debugClick = { x: canvasX, y: canvasY };
            
            const currentWorld = this.currentState === this.GAME_STATES.PLAYING ? this.world : (this.logoWorld || this.world);
            const hit = this.player.getRaycastHit(currentWorld, e.clientX, e.clientY, this.canvas, this.renderer);
            
            console.log('Click:', { 
                clientX: e.clientX, 
                clientY: e.clientY, 
                canvasX, 
                canvasY, 
                worldX: hit.position.x, 
                worldY: hit.position.y,
                camera: this.renderer.camera
            });
            
            if (e.button === 0 && hit.hit) { // left click - remove block
                currentWorld.setBlock(hit.position.x, hit.position.y, 0, 0);
            } else if (e.button === 2) { // right click - place block
                if (!hit.hit) {
                    currentWorld.setBlock(hit.position.x, hit.position.y, 0, this.selectedBlockType);
                }
            }
        });
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.code >= 'Digit1' && e.code <= 'Digit9') {
                this.selectedBlockType = parseInt(e.code.slice(-1));
            }
            
            // Toggle between game and logo screen with 'L' key
            if (e.code === 'KeyL') {
                this.toggleLogoScreen();
            }
            
            // ESC key to return to main game from logo screen
            if (e.code === 'Escape' && this.currentState === this.GAME_STATES.LOGO_SCREEN) {
                this.switchToGame();
            }
        });
    }
    
    getPlacePosition(hitPosition) {
        const directions = [
            new Vec3(1, 0, 0), new Vec3(-1, 0, 0),
            new Vec3(0, 1, 0), new Vec3(0, -1, 0),
            new Vec3(0, 0, 1), new Vec3(0, 0, -1)
        ];
        
        for (const dir of directions) {
            const placePos = hitPosition.add(dir);
            if (this.world.getBlock(placePos.x, placePos.y, placePos.z) === 0) {
                const playerPos = this.player.position;
                const distance = Math.sqrt(
                    (placePos.x - playerPos.x) ** 2 +
                    (placePos.y - playerPos.y) ** 2 +
                    (placePos.z - playerPos.z) ** 2
                );
                
                if (distance > 0.5) {
                    return placePos;
                }
            }
        }
        
        return null;
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        if (this.currentState === this.GAME_STATES.PLAYING) {
            this.player.update(deltaTime, this.world);
        } else if (this.currentState === this.GAME_STATES.LOGO_SCREEN && this.logoWorld) {
            this.player.update(deltaTime, this.logoWorld);
        }
        this.updateUI();
    }
    
    render() {
        if (this.currentState === this.GAME_STATES.PLAYING) {
            this.renderer.render(this.world, this.player, this);
        } else if (this.currentState === this.GAME_STATES.LOGO_SCREEN && this.logoWorld) {
            this.renderer.render(this.logoWorld, this.player, this);
        }
    }
    
    toggleLogoScreen() {
        if (this.currentState === this.GAME_STATES.PLAYING) {
            this.switchToLogoScreen();
        } else {
            this.switchToGame();
        }
    }
    
    switchToLogoScreen() {
        // Save current player position
        this.savedPlayerPosition = {
            x: this.player.position.x,
            y: this.player.position.y,
            z: this.player.position.z
        };
        
        // Initialize logo world if not already done
        if (!this.logoWorld) {
            this.logoWorld = new World();
            this.logoWorld.generateLogoWorld();
        }
        
        // Position player in logo world above the letters (logo is at Y=26-33, so spawn at Y=35)
        this.player.position.x = 0;
        this.player.position.y = 35;
        this.player.position.z = 0;
        this.player.velocity.x = 0;
        this.player.velocity.y = 0;
        this.player.velocity.z = 0;
        this.player.onGround = false; // Let physics determine ground state
        
        this.currentState = this.GAME_STATES.LOGO_SCREEN;
    }
    
    switchToGame() {
        // Restore player position
        if (this.savedPlayerPosition) {
            this.player.position.x = this.savedPlayerPosition.x;
            this.player.position.y = this.savedPlayerPosition.y;
            this.player.position.z = this.savedPlayerPosition.z;
        }
        
        this.player.velocity.x = 0;
        this.player.velocity.y = 0;
        this.player.velocity.z = 0;
        this.player.onGround = false; // Let physics determine ground state
        
        this.currentState = this.GAME_STATES.PLAYING;
    }
    
    updateUI() {
        const coordsElement = document.getElementById('coordinates');
        const biomeElement = document.getElementById('biome');
        
        if (coordsElement) {
            const pos = this.player.position;
            coordsElement.textContent = `X: ${pos.x.toFixed(1)}, Y: ${pos.y.toFixed(1)}, Z: ${pos.z.toFixed(1)}`;
        }
        
        if (biomeElement) {
            if (this.currentState === this.GAME_STATES.LOGO_SCREEN) {
                biomeElement.textContent = `LOGO SCREEN | Press 'L' or ESC to return | Block: ${this.selectedBlockType}`;
            } else {
                const wallMiningStatus = this.player.wallMiningEnabled ? 'ON' : 'OFF';
                biomeElement.textContent = `Block: ${this.selectedBlockType} | On Ground: ${this.player.onGround} | Wall Mining: ${wallMiningStatus}  | Press 'L' for Logo`;
            }
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
    window.game = game; // Make game accessible globally for debugging
});