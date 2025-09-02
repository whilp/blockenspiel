class Player {
    constructor() {
        this.position = new Vec3(0, 25, 0); // Initial position, will be adjusted
        this.velocity = new Vec3(0, 0, 0);
        this.speed = 8;
        this.jumpPower = 12;
        this.jetpackPower = 15;
        this.gravity = -25;
        this.onGround = false;
        this.keys = {};
        this.lastMineTime = 0;
        this.direction = 1; // 1 for right, -1 for left
        
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
                console.log('Found safe spawn location at x =', testX, 'y = 55');
                break;
            }
        }
        
        this.position = new Vec3(bestSpawnX, spawnY, 0);
        console.log('Player spawned at:', this.position);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code.toLowerCase()] = false;
        });
    }
    
    update(deltaTime, world) {
        this.velocity.y += this.gravity * deltaTime;
        
        if (this.keys['keya'] || this.keys['arrowleft']) {
            this.velocity.x = -this.speed;
            this.direction = -1;
        } else if (this.keys['keyd'] || this.keys['arrowright']) {
            this.velocity.x = this.speed;
            this.direction = 1;
        } else {
            this.velocity.x *= 0.8;
        }
        
        if (this.keys['space'] || this.keys['arrowup']) {
            this.velocity.y = this.jetpackPower;
        } else if ((this.keys['keyw']) && this.onGround) {
            this.velocity.y = this.jumpPower;
            this.onGround = false;
        }
        
        if (this.keys['keys'] || this.keys['arrowdown']) {
            this.mineBlockBelow(world);
        }
        
        const newX = this.position.x + this.velocity.x * deltaTime;
        const newY = this.position.y + this.velocity.y * deltaTime;
        
        if (!this.checkCollision(newX, this.position.y, world)) {
            this.position.x = newX;
        } else {
            this.velocity.x = 0;
        }
        
        if (!this.checkCollision(this.position.x, newY, world)) {
            this.position.y = newY;
            this.onGround = false;
        } else {
            if (this.velocity.y < 0) {
                this.onGround = true;
            }
            this.velocity.y = 0;
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
                position: new Vec3(worldX, worldY, 0),
                distance: Math.sqrt((worldX - this.position.x) ** 2 + (worldY - this.position.y) ** 2)
            };
        }
        
        return { hit: false, position: new Vec3(worldX, worldY, 0) };
    }
}