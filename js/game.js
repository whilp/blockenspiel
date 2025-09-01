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
        
        this.setupEventListeners();
        this.start();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = e.clientX - rect.left;
            const canvasY = e.clientY - rect.top;
            
            this.debugClick = { x: canvasX, y: canvasY };
            
            const hit = this.player.getRaycastHit(this.world, e.clientX, e.clientY, this.canvas, this.renderer);
            
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
                this.world.setBlock(hit.position.x, hit.position.y, 0, 0);
            } else if (e.button === 2) { // right click - place block
                if (!hit.hit) {
                    this.world.setBlock(hit.position.x, hit.position.y, 0, this.selectedBlockType);
                }
            }
            
            setTimeout(() => { this.debugClick = null; }, 1000);
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