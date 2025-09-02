class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.world = new World();
        this.player = new Player();
        this.lastTime = 0;
        this.isRunning = false;
        this.selectedBlockType = 1;
        this.debugClick = null;
        
        // Set safe spawn position after world generation
        this.player.findSafeSpawnPosition(this.world);
        
        this.setupEventListeners();
        this.start();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click only
                // Get exact canvas coordinates
                const rect = this.canvas.getBoundingClientRect();
                const canvasX = e.clientX - rect.left;
                const canvasY = e.clientY - rect.top;
                
                // Show red dot at click position
                this.debugClick = { x: canvasX, y: canvasY };
                
                // Convert canvas coordinates to world block coordinates
                const blockSize = this.renderer.blockSize;
                const camera = this.renderer.camera;
                const worldX = Math.floor((canvasX + camera.x) / blockSize);
                const worldY = Math.floor((this.canvas.height - canvasY + camera.y) / blockSize) + 8;
                
                console.log('Left Click - Breaking Block:', { 
                    canvasX, 
                    canvasY, 
                    worldX, 
                    worldY,
                    redDotX: this.debugClick.x,
                    redDotY: this.debugClick.y
                });
                
                // Break the block at the calculated world position
                const blockType = this.world.getBlock(worldX, worldY, 0);
                if (blockType > 0) {
                    this.world.setBlock(worldX, worldY, 0, 0);
                    console.log('Block broken at:', worldX, worldY);
                } else {
                    console.log('No block to break at:', worldX, worldY);
                }
                
                // Keep red dot visible for 1 second
                setTimeout(() => { this.debugClick = null; }, 1000);
            } else if (e.button === 2) { // Right click - place block
                const rect = this.canvas.getBoundingClientRect();
                const canvasX = e.clientX - rect.left;
                const canvasY = e.clientY - rect.top;
                
                const blockSize = this.renderer.blockSize;
                const camera = this.renderer.camera;
                const worldX = Math.floor((canvasX + camera.x) / blockSize);
                const worldY = Math.floor((this.canvas.height - canvasY + camera.y) / blockSize) + 8;
                
                const blockType = this.world.getBlock(worldX, worldY, 0);
                if (blockType === 0) {
                    this.world.setBlock(worldX, worldY, 0, this.selectedBlockType);
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
        this.player.update(deltaTime, this.world);
        this.updateUI();
    }
    
    render() {
        this.renderer.render(this.world, this.player, this);
    }
    
    updateUI() {
        const coordsElement = document.getElementById('coordinates');
        const biomeElement = document.getElementById('biome');
        
        if (coordsElement) {
            const pos = this.player.position;
            coordsElement.textContent = `X: ${pos.x.toFixed(1)}, Y: ${pos.y.toFixed(1)}, Z: ${pos.z.toFixed(1)}`;
        }
        
        if (biomeElement) {
            biomeElement.textContent = `Block: ${this.selectedBlockType} | On Ground: ${this.player.onGround}`;
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
    window.game = game; // Make game accessible globally for debugging
});