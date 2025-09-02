class World {
    constructor() {
        this.blocks = new Map();
        this.chunkSize = 16;
        this.worldHeight = 128;
        this.generateTerrain();
    }
    
    getBlockKey(x, y, z) {
        return `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
    }
    
    setBlock(x, y, z, blockType) {
        const key = this.getBlockKey(x, y, z);
        if (blockType === 0) {
            this.blocks.delete(key);
        } else {
            this.blocks.set(key, blockType);
        }
    }
    
    getBlock(x, y, z) {
        const key = this.getBlockKey(x, y, z);
        return this.blocks.get(key) || 0;
    }
    
    generateTerrain() {
        const size = 200;
        
        for (let x = -size; x < size; x++) {
            const groundHeight = Math.floor(20 + 5 * Math.sin(x * 0.02));
            
            for (let y = 0; y <= groundHeight; y++) {
                if (y <= 2) {
                    this.setBlock(x, y, 0, 5); // bedrock
                } else if (y === groundHeight) {
                    this.setBlock(x, y, 0, 13); // concrete
                } else if (y >= groundHeight - 2) {
                    this.setBlock(x, y, 0, 2); // dirt
                } else {
                    this.setBlock(x, y, 0, 3); // stone
                }
            }
        }
        
        this.generateCity();
        this.generateRoads();
        this.generateVehicles();
    }

    generateLogoWorld() {
        // Clear existing blocks
        this.blocks.clear();
        
        // Create a flat platform for the logo
        const platformWidth = 120;
        const platformHeight = 25;
        
        for (let x = -platformWidth/2; x < platformWidth/2; x++) {
            for (let y = 0; y <= platformHeight; y++) {
                if (y <= 2) {
                    this.setBlock(x, y, 0, 5); // bedrock
                } else if (y === platformHeight) {
                    this.setBlock(x, y, 0, 1); // grass
                } else if (y >= platformHeight - 2) {
                    this.setBlock(x, y, 0, 2); // dirt
                } else {
                    this.setBlock(x, y, 0, 3); // stone
                }
            }
        }
        
        // Generate the BLOCKENSPIEL logo
        this.generateLogoText();
        
        // Generate credits display
        this.generateCreditsDisplay();
    }

    generateLogoText() {
        if (typeof LogoPatterns === 'undefined') {
            console.error('LogoPatterns not loaded');
            return;
        }
        
        console.log('Generating logo text...');
        
        const patterns = LogoPatterns.getLetterPatterns();
        const getColor = LogoPatterns.getLetterColors();
        const logoText = 'BLOCKENSPIEL';
        
        let currentX = -50; // Starting position for the logo
        const baseY = 26; // Y position where logo will be placed (just above the platform at 25)
        
        for (let i = 0; i < logoText.length; i++) {
            const letter = logoText[i];
            const pattern = patterns[letter];
            const blockType = getColor(letter, i, logoText);
            
            if (pattern) {
                console.log(`Generating letter ${letter} at position ${currentX} with color ${blockType}`);
                // Place blocks according to pattern
                for (let row = 0; row < pattern.length; row++) {
                    for (let col = 0; col < pattern[row].length; col++) {
                        if (pattern[row][col] === 1) {
                            // Pattern is drawn top-down, so we flip the Y coordinate
                            const blockX = currentX + col;
                            const blockY = baseY + (pattern.length - 1 - row);
                            this.setBlock(blockX, blockY, 0, blockType);
                        }
                    }
                }
                
                // Move to next letter position (letter width + spacing)
                currentX += (pattern[0] ? pattern[0].length : 5) + 2;
            } else {
                console.log(`No pattern found for letter: ${letter}`);
            }
        }
    }

    generateCreditsDisplay() {
        if (typeof LogoPatterns === 'undefined') {
            console.error('LogoPatterns not loaded');
            return;
        }
        
        const credits = LogoPatterns.generateCredits();
        const developers = ['Joe', 'Manu', 'Ev'];
        const creditColors = [4, 11, 16]; // gold, crystal pink, window blue
        
        let startX = -45;
        const creditY = 15; // Below the logo
        
        developers.forEach((dev, devIndex) => {
            const devCredits = credits[dev];
            const color = creditColors[devIndex];
            
            // Create a small title for the developer using blocks
            const devName = dev.toUpperCase();
            let nameX = startX;
            
            // Simple block representation for developer names
            for (let i = 0; i < devName.length; i++) {
                this.setBlock(nameX + i, creditY + 5, 0, color);
                nameX++;
            }
            
            // Create vertical columns of blocks representing their roles
            // Each block represents multiple roles for space efficiency
            const rolesPerColumn = Math.ceil(devCredits.length / 8);
            for (let col = 0; col < 8; col++) {
                const hasRoles = col * rolesPerColumn < devCredits.length;
                if (hasRoles) {
                    for (let row = 0; row < 3; row++) {
                        this.setBlock(startX + col, creditY + row, 0, color);
                    }
                }
            }
            
            startX += 35; // Move to next developer section
        });
    }
    
    generateCity() {
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * 300 - 150);
            const groundHeight = Math.floor(20 + 5 * Math.sin(x * 0.02));
            const buildingHeight = 10 + Math.floor(Math.random() * 30);
            const buildingWidth = 8 + Math.floor(Math.random() * 12);
            
            for (let bx = x; bx < x + buildingWidth; bx++) {
                for (let by = groundHeight + 1; by <= groundHeight + buildingHeight; by++) {
                    if (bx === x || bx === x + buildingWidth - 1 || 
                        by === groundHeight + 1 || by === groundHeight + buildingHeight) {
                        this.setBlock(bx, by, 0, 14); // glass/metal
                    } else if (Math.random() < 0.1) {
                        this.setBlock(bx, by, 0, 15); // interior
                    }
                    
                    if (by % 4 === 0 && (bx - x) % 3 === 1) {
                        this.setBlock(bx, by, 0, 16); // window
                    }
                }
            }
        }
    }
    
    generateRoads() {
        for (let x = -200; x < 200; x += 20) {
            const groundHeight = Math.floor(20 + 5 * Math.sin(x * 0.02));
            this.setBlock(x, groundHeight + 1, 0, 17); // road
            this.setBlock(x + 1, groundHeight + 1, 0, 17);
            this.setBlock(x + 2, groundHeight + 1, 0, 17);
        }
    }
    
    generateVehicles() {
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * 300 - 150);
            const groundHeight = Math.floor(20 + 5 * Math.sin(x * 0.02));
            
            this.setBlock(x, groundHeight + 2, 0, 18); // car body
            this.setBlock(x + 1, groundHeight + 2, 0, 18);
            this.setBlock(x + 2, groundHeight + 2, 0, 18);
            this.setBlock(x + 1, groundHeight + 3, 0, 16); // car window
        }
    }
    
    getHeightAt(x, z, biome) {
        const baseHeight = 32;
        let height = baseHeight;
        
        const continentalNoise = this.noise(x * 0.003, z * 0.003, 0) * 30;
        const erosionNoise = this.noise(x * 0.008, z * 0.008, 500) * 15;
        const ridgeNoise = this.noise(x * 0.02, z * 0.02, 1000) * 8;
        
        height += continentalNoise + erosionNoise + ridgeNoise;
        
        switch (biome) {
            case 'mountains':
                height += this.noise(x * 0.01, z * 0.01, 3000) * 40;
                height += Math.abs(this.noise(x * 0.05, z * 0.05, 4000)) * 20;
                break;
            case 'desert':
                height += this.noise(x * 0.02, z * 0.02, 5000) * 10;
                height -= 5;
                break;
            case 'swamp':
                height = Math.max(28, height - 8);
                break;
            case 'tundra':
                height += this.noise(x * 0.015, z * 0.015, 6000) * 12;
                break;
        }
        
        return Math.floor(Math.max(1, height));
    }
    
    generateColumn(x, z, height, biome) {
        for (let y = 0; y <= height; y++) {
            let blockType = 3; // stone
            
            if (y === height) {
                switch (biome) {
                    case 'desert': blockType = 6; break; // sand
                    case 'swamp': blockType = 2; break; // dirt
                    case 'tundra': blockType = 7; break; // snow
                    case 'mountains': blockType = y > 60 ? 7 : 1; break; // snow on peaks, grass below
                    default: blockType = 1; // grass
                }
            } else if (y >= height - 3) {
                switch (biome) {
                    case 'desert': blockType = 6; break; // sand
                    case 'swamp': blockType = 2; break; // dirt
                    default: blockType = 2; // dirt
                }
            } else if (y > 5 && Math.random() < 0.02) {
                blockType = 4; // ore
            }
            
            this.setBlock(x, y, z, blockType);
        }
        
        if (biome === 'swamp' && height <= 30 && Math.random() < 0.3) {
            for (let y = height + 1; y <= 30; y++) {
                this.setBlock(x, y, z, 8); // water
            }
        }
    }
    
    generateCaves() {
        const size = 100;
        for (let x = -size; x < size; x += 2) {
            for (let z = -size; z < size; z += 2) {
                for (let y = 5; y < 50; y += 2) {
                    const caveNoise = this.noise(x * 0.05, y * 0.05, z * 0.05);
                    if (caveNoise > 0.6) {
                        for (let dx = 0; dx < 3; dx++) {
                            for (let dy = 0; dy < 3; dy++) {
                                for (let dz = 0; dz < 3; dz++) {
                                    this.setBlock(x + dx, y + dy, z + dz, 0);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    generateRivers() {
        for (let t = 0; t < 1000; t++) {
            const x = Math.floor(-50 + Math.sin(t * 0.02) * 30 + this.noise(t * 0.1, 0, 7000) * 10);
            const z = Math.floor(-50 + t * 0.1 + this.noise(t * 0.1, 1000, 7000) * 5);
            
            if (x >= -100 && x < 100 && z >= -100 && z < 100) {
                const height = this.getHeightAt(x, z, 'plains');
                for (let y = Math.max(1, height - 2); y <= height + 1; y++) {
                    this.setBlock(x, y, z, 8); // water
                    this.setBlock(x + 1, y, z, 8);
                    this.setBlock(x - 1, y, z, 8);
                }
            }
        }
    }
    
    generateStructures() {
        for (let i = 0; i < 5; i++) {
            const x = Math.floor(Math.random() * 200 - 100);
            const z = Math.floor(Math.random() * 200 - 100);
            const biome = this.getBiome(x, z);
            const height = this.getHeightAt(x, z, biome);
            
            if (biome === 'desert') {
                this.generatePyramid(x, height + 1, z);
            } else if (biome === 'mountains') {
                this.generateTower(x, height + 1, z);
            }
        }
    }
    
    generateTree(x, y, z) {
        const height = 4 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < height; i++) {
            this.setBlock(x, y + i, z, 9); // wood
        }
        
        for (let dx = -2; dx <= 2; dx++) {
            for (let dz = -2; dz <= 2; dz++) {
                for (let dy = 0; dy < 3; dy++) {
                    if (Math.abs(dx) + Math.abs(dz) + dy < 4 && Math.random() < 0.7) {
                        this.setBlock(x + dx, y + height - 1 + dy, z + dz, 10); // leaves
                    }
                }
            }
        }
    }
    
    generateCrystal(x, y, z) {
        const height = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < height; i++) {
            this.setBlock(x, y + i, z, 11); // crystal
        }
    }
    
    generatePyramid(x, y, z) {
        for (let level = 0; level < 8; level++) {
            const size = 8 - level;
            for (let dx = -size; dx <= size; dx++) {
                for (let dz = -size; dz <= size; dz++) {
                    if (Math.abs(dx) === size || Math.abs(dz) === size) {
                        this.setBlock(x + dx, y + level, z + dz, 6); // sand
                    }
                }
            }
        }
    }
    
    generateTower(x, y, z) {
        for (let i = 0; i < 12; i++) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dz = -1; dz <= 1; dz++) {
                    if (dx === 0 || dz === 0) {
                        this.setBlock(x + dx, y + i, z + dz, 3); // stone
                    }
                }
            }
        }
    }
    
    noise(x, y, z = 0) {
        const a = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
        return 2 * (a - Math.floor(a)) - 1;
    }
    
    getVisibleBlocks(playerPos, renderDistance = 50) {
        const visibleBlocks = [];
        const minX = Math.floor(playerPos.x - renderDistance);
        const maxX = Math.floor(playerPos.x + renderDistance);
        const minY = Math.max(0, Math.floor(playerPos.y - renderDistance));
        const maxY = Math.min(this.worldHeight, Math.floor(playerPos.y + renderDistance));
        const minZ = Math.floor(playerPos.z - renderDistance);
        const maxZ = Math.floor(playerPos.z + renderDistance);
        
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    const blockType = this.getBlock(x, y, z);
                    if (blockType > 0) {
                        visibleBlocks.push({
                            x, y, z,
                            type: blockType,
                            distance: Math.sqrt(
                                (x - playerPos.x) ** 2 + 
                                (y - playerPos.y) ** 2 + 
                                (z - playerPos.z) ** 2
                            )
                        });
                    }
                }
            }
        }
        
        return visibleBlocks.sort((a, b) => b.distance - a.distance);
    }
}