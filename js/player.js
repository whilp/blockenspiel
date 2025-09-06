class Player {
    constructor() {
        this.position = new Vec2(0, 25); // Initial position, will be adjusted
        this.velocity = new Vec2(0, 0);
        this.speed = 8;
        this.jumpPower = 12;
        this.jetpackPower = 15;
        this.gravity = -25;
        this.onGround = false;
        this.keys = {};
        this.lastMineTime = 0;
        this.direction = 1; // 1 for right, -1 for left
        this.wallMiningEnabled = true; // Toggle for walking through walls
        
        // Touch controls
        this.touchActive = false;
        this.touchPosition = null;
        this.canvas = null; // Will be set by game
        this.renderer = null; // Will be set by game
        
        this.setupEventListeners();
    }
    
    findSafeSpawnPosition(world) {
        // Try multiple x positions to find one without buildings
        const searchRange = 100; // Search within this range
        const spawnY = 55; // Always spawn at Y-level 55
        let bestSpawnX = 0;
        
        for (let testX = -searchRange; testX <= searchRange; testX += 5) {
            // Check if there are any blocks at Y-level 55 (where we want to spawn)
            let hasBlockAtSpawnLevel = world.getBlock(testX, spawnY, 0) > 0;
            
            // If no block at spawn level, this is a good spawn location
            if (!hasBlockAtSpawnLevel) {
                bestSpawnX = testX;
                break;
            }
        }
        
        this.position = new Vec2(bestSpawnX, spawnY);
    }
    
    setCanvasAndRenderer(canvas, renderer) {
        this.canvas = canvas;
        this.renderer = renderer;
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code.toLowerCase()] = true;
            
            // Toggle wall mining with T key
            if (e.code === 'KeyT') {
                this.wallMiningEnabled = !this.wallMiningEnabled;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code.toLowerCase()] = false;
        });
        
        // Touch event listeners
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                this.touchActive = true;
                this.touchPosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0 && this.touchActive) {
                this.touchPosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
        });
        
        document.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchActive = false;
            this.touchPosition = null;
        });
    }
    
    convertTouchToWorldCoords(touchX, touchY) {
        if (!this.canvas || !this.renderer) return null;
        
        const blockSize = this.renderer.blockSize;
        const camera = this.renderer.camera;
        
        const worldX = (touchX + camera.x) / blockSize;
        const worldY = (this.canvas.height - touchY + camera.y) / blockSize;
        
        return new Vec2(worldX, worldY);
    }
    
    update(deltaTime, world) {
        this.velocity.y += this.gravity * deltaTime;
        
        // Handle touch controls
        let touchLeft = false;
        let touchRight = false;
        let touchUp = false;
        let touchMine = false;
        
        if (this.touchActive && this.touchPosition && this.canvas) {
            const worldTouch = this.convertTouchToWorldCoords(this.touchPosition.x, this.touchPosition.y);
            if (worldTouch) {
                // Determine movement direction based on touch position relative to player
                if (worldTouch.x < this.position.x) {
                    touchLeft = true;
                } else if (worldTouch.x > this.position.x) {
                    touchRight = true;
                }
                
                // If touch is in upper half of screen, activate jetpack
                if (this.touchPosition.y < this.canvas.height / 2) {
                    touchUp = true;
                } else {
                    // If touch is in lower half, enable mining
                    touchMine = true;
                }
            }
        }
        
        if (this.keys['keya'] || this.keys['arrowleft'] || touchLeft) {
            this.velocity.x = -this.speed;
            this.direction = -1;
        } else if (this.keys['keyd'] || this.keys['arrowright'] || touchRight) {
            this.velocity.x = this.speed;
            this.direction = 1;
        } else {
            this.velocity.x *= 0.8;
        }
        
        if (this.keys['space'] || this.keys['arrowup'] || touchUp) {
            this.velocity.y = this.jetpackPower;
        } else if ((this.keys['keyw']) && this.onGround) {
            this.velocity.y = this.jumpPower;
            this.onGround = false;
        }
        
        if (this.keys['keys'] || this.keys['arrowdown'] || touchMine) {
            this.mineBlockBelow(world);
        }
        
        const newX = this.position.x + this.velocity.x * deltaTime;
        const newY = this.position.y + this.velocity.y * deltaTime;
        
        // Handle horizontal movement and block breaking
        if (!this.checkCollision(newX, this.position.y, world)) {
            this.position.x = newX;
        } else {
            if (this.wallMiningEnabled) {
                // Break blocks that are in the way of horizontal movement
                this.breakBlocksInPath(newX, this.position.y, world);
                this.position.x = newX; // Continue moving after breaking blocks
            } else {
                // Stop movement when hitting walls (normal collision)
                this.velocity.x = 0;
            }
        }
        
        // Handle vertical movement and block breaking
        if (!this.checkCollision(this.position.x, newY, world)) {
            this.position.y = newY;
            this.onGround = false;
        } else {
            if (this.velocity.y < 0) {
                // Don't auto-break blocks below - only break when S is pressed
                this.onGround = true;
                this.velocity.y = 0;
            } else {
                // Breaking blocks above when going up (jumping into ceiling)
                this.breakBlocksInPath(this.position.x, newY, world);
                this.position.y = newY;
            }
        }
    }
    
    breakBlocksInPath(x, y, world) {
        const playerWidth = 0.8;
        const playerHeight = 1.8;
        
        const minX = Math.floor(x - playerWidth / 2);
        const maxX = Math.floor(x + playerWidth / 2);
        const minY = Math.floor(y);
        const maxY = Math.floor(y + playerHeight);
        
        for (let checkX = minX; checkX <= maxX; checkX++) {
            for (let checkY = minY; checkY <= maxY; checkY++) {
                if (world.getBlock(checkX, checkY, 0) > 0) {
                    world.setBlock(checkX, checkY, 0, 0); // Break the block
                }
            }
        }
    }
    
    checkCollision(x, y, world) {
        const playerWidth = 0.8;
        const playerHeight = 1.8;
        
        const minX = Math.floor(x - playerWidth / 2);
        const maxX = Math.floor(x + playerWidth / 2);
        const minY = Math.floor(y);
        const maxY = Math.floor(y + playerHeight);
        
        for (let checkX = minX; checkX <= maxX; checkX++) {
            for (let checkY = minY; checkY <= maxY; checkY++) {
                if (world.getBlock(checkX, checkY, 0) > 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
    mineBlockBelow(world) {
        if (!this.lastMineTime || Date.now() - this.lastMineTime > 200) {
            const blockX = Math.floor(this.position.x);
            const blockY = Math.floor(this.position.y - 0.1);
            
            if (world.getBlock(blockX, blockY, 0) > 0) {
                world.setBlock(blockX, blockY, 0, 0);
                this.lastMineTime = Date.now();
            }
        }
    }
    
    getRaycastHit(world, canvasX, canvasY, canvas, renderer) {
        const blockSize = renderer.blockSize;
        const camera = renderer.camera;
        
        const worldX = Math.floor((canvasX + camera.x) / blockSize);
        const worldY = Math.floor((canvas.height - canvasY + camera.y) / blockSize);
        
        const blockType = world.getBlock(worldX, worldY, 0);
        
        if (blockType > 0) {
            return {
                hit: true,
                position: new Vec2(worldX, worldY),
                distance: Math.sqrt((worldX - this.position.x) ** 2 + (worldY - this.position.y) ** 2)
            };
        }
        
        return { hit: false, position: new Vec2(worldX, worldY) };
    }
}