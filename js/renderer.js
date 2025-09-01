class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.blockSize = 32;
        this.camera = { x: 0, y: 0 };
        
        this.blockColors = {
            1: '#4CAF50', // grass - green
            2: '#8D4B28', // dirt - brown
            3: '#666666', // stone - gray
            4: '#FFD700', // ore - gold
            5: '#2C2C2C', // bedrock - dark gray
            6: '#F4A460', // sand - sandy brown
            7: '#FFFFFF', // snow - white
            8: '#4169E1', // water - royal blue
            9: '#8B4513', // wood - saddle brown
            10: '#228B22', // leaves - forest green
            11: '#FF69B4', // crystal - hot pink
            12: '#D2B48C', // default - tan
            13: '#C0C0C0', // concrete - silver
            14: '#4A90E2', // glass/metal - blue
            15: '#F5F5DC', // interior - beige
            16: '#87CEEB', // window - sky blue
            17: '#2F2F2F', // road - dark gray
            18: '#FF4444'  // car - red
        };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    clear() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB'); // sky blue
        gradient.addColorStop(0.7, '#98D8E8'); // lighter blue
        gradient.addColorStop(1, '#B0E0E6'); // powder blue
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    updateCamera(player) {
        this.camera.x = player.position.x * this.blockSize - this.width / 2;
        this.camera.y = -player.position.y * this.blockSize + this.height / 2;
    }
    
    drawBlock(x, y, blockType) {
        const screenX = x * this.blockSize - this.camera.x;
        const screenY = this.height - (y + 1) * this.blockSize - this.camera.y;
        
        if (screenX < -this.blockSize || screenX > this.width || 
            screenY < -this.blockSize || screenY > this.height) {
            return;
        }
        
        const color = this.blockColors[blockType] || this.blockColors[12];
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(screenX, screenY, this.blockSize, this.blockSize);
        
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX, screenY, this.blockSize, this.blockSize);
        
        if (blockType === 1) {
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(screenX + 2, screenY + 2, this.blockSize - 4, 8);
        } else if (blockType === 9) {
            this.ctx.fillStyle = '#654321';
            for (let i = 0; i < 3; i++) {
                this.ctx.fillRect(screenX + 4 + i * 8, screenY + 4, 4, this.blockSize - 8);
            }
        } else if (blockType === 8) {
            this.ctx.fillStyle = 'rgba(65, 105, 225, 0.8)';
            this.ctx.fillRect(screenX, screenY, this.blockSize, this.blockSize);
        }
    }
    
    drawPlayer(player) {
        const screenX = player.position.x * this.blockSize - this.camera.x - 8;
        const screenY = this.height - (player.position.y + 1.8) * this.blockSize - this.camera.y;
        
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(screenX, screenY, 16, 32);
        
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(screenX + 4, screenY, 8, 8);
        
        this.ctx.fillStyle = '#000';
        if (player.direction === 1) {
            this.ctx.fillRect(screenX + 6, screenY + 2, 2, 2);
            this.ctx.fillRect(screenX + 10, screenY + 2, 2, 2);
        } else {
            this.ctx.fillRect(screenX + 4, screenY + 2, 2, 2);
            this.ctx.fillRect(screenX + 8, screenY + 2, 2, 2);
        }
        
        this.ctx.fillRect(screenX + 6, screenY + 5, 4, 1);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(screenX + 2, screenY + 16, 4, 12);
        this.ctx.fillRect(screenX + 10, screenY + 16, 4, 12);
    }
    
    render(world, player, game) {
        this.clear();
        this.updateCamera(player);
        
        const viewWidth = Math.ceil(this.width / this.blockSize) + 2;
        const viewHeight = Math.ceil(this.height / this.blockSize) + 2;
        const startX = Math.floor(player.position.x - viewWidth / 2);
        const startY = Math.floor(player.position.y - viewHeight / 2);
        
        for (let x = startX; x < startX + viewWidth; x++) {
            for (let y = startY; y < startY + viewHeight; y++) {
                const blockType = world.getBlock(x, y, 0);
                if (blockType > 0) {
                    this.drawBlock(x, y, blockType);
                }
            }
        }
        
        this.drawPlayer(player);
        this.drawCrosshair();
        
        if (game.debugClick) {
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc(game.debugClick.x, game.debugClick.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawCrosshair() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const size = 8;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - size, centerY);
        this.ctx.lineTo(centerX + size, centerY);
        this.ctx.moveTo(centerX, centerY - size);
        this.ctx.lineTo(centerX, centerY + size);
        this.ctx.stroke();
    }
}