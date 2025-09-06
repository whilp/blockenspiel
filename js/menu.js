class Menu {
    constructor(game) {
        this.game = game;
        this.isOpen = false;
        this.blockColors = {
            1: '#4CAF50',  // Grass - green
            2: '#8D6E63',  // Dirt - brown
            3: '#757575',  // Stone - gray
            4: '#FFD700',  // Gold Ore - gold
            5: '#424242',  // Bedrock - dark gray
            6: '#FFF176',  // Sand - light yellow
            7: '#E8EAF6',  // Snow - light blue/white
            8: '#2196F3',  // Water - blue
            9: '#795548',  // Wood - brown
            10: '#4CAF50', // Leaves - green
            11: '#E91E63', // Crystal - pink
            12: '#9E9E9E', // Default - medium gray
            13: '#607D8B', // Concrete - blue gray
            14: '#90A4AE', // Glass/Metal - light blue gray
            15: '#FF9800', // Interior - orange
            16: '#03DAC6', // Window - cyan
            17: '#37474F', // Road - dark blue gray
            18: '#F44336'  // Car - red
        };
        
        this.worlds = [
            { id: 'main', name: 'Main Game' },
            { id: 'logo', name: 'Logo/Credits' }
        ];
        
        this.createMenuElements();
        this.setupEventListeners();
    }
    
    createMenuElements() {
        // Create menu button
        this.menuButton = document.createElement('button');
        this.menuButton.id = 'menu-button';
        this.menuButton.innerHTML = '☰';
        this.menuButton.className = 'menu-btn';
        
        // Create menu panel
        this.menuPanel = document.createElement('div');
        this.menuPanel.id = 'menu-panel';
        this.menuPanel.className = 'menu-panel';
        
        // Create menu content
        this.menuPanel.innerHTML = `
            <div class="menu-header">
                <h3>Game Menu</h3>
                <button id="menu-close" class="menu-close">×</button>
            </div>
            
            <div class="menu-section">
                <h4>World Selection</h4>
                <div id="world-selector" class="world-selector">
                    ${this.worlds.map(world => 
                        `<button class="world-btn" data-world="${world.id}">${world.name}</button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="menu-section">
                <h4>Block Selection</h4>
                <div id="block-selector" class="block-selector">
                    ${Array.from({length: 18}, (_, i) => i + 1).map(blockType =>
                        `<button class="block-btn" data-block="${blockType}" style="background-color: ${this.blockColors[blockType]}" title="Block ${blockType}">
                            ${blockType}
                        </button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="menu-section">
                <h4>Settings</h4>
                <div class="toggle-container">
                    <label class="toggle-label">
                        Wall Mining
                        <input type="checkbox" id="wall-mining-toggle" ${this.game.player.wallMiningEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="menu-section">
                <h4>Controls <span id="controls-toggle" class="controls-toggle">▼</span></h4>
                <div id="controls-help" class="controls-help">
                    <div class="controls-group">
                        <strong>Desktop:</strong><br>
                        A/D: Move & Turn | Space: Jetpack | W: Jump<br>
                        S/Down: Mine Below | Click: Mine Block<br>
                        Right Click: Place Block | T: Toggle Wall Mining<br>
                        Keys 1-9: Select Block | L: Logo Screen
                    </div>
                    <div class="controls-group">
                        <strong>Touch:</strong><br>
                        Tap & hold to move Steve toward touch point<br>
                        Upper half: Jetpack | Lower half: Walk/Fall
                    </div>
                </div>
            </div>
        `;
        
        // Add elements to page
        document.body.appendChild(this.menuButton);
        document.body.appendChild(this.menuPanel);
        
        // Update current selections
        this.updateCurrentSelections();
    }
    
    setupEventListeners() {
        // Menu button click
        this.menuButton.addEventListener('click', () => {
            this.toggle();
        });
        
        // Close button click
        document.getElementById('menu-close').addEventListener('click', () => {
            this.close();
        });
        
        // Click outside menu to close
        this.menuPanel.addEventListener('click', (e) => {
            if (e.target === this.menuPanel) {
                this.close();
            }
        });
        
        // Block selection
        document.querySelectorAll('.block-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const blockType = parseInt(btn.dataset.block);
                this.game.selectedBlockType = blockType;
                this.updateCurrentSelections();
            });
        });
        
        // World selection
        document.querySelectorAll('.world-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const worldId = btn.dataset.world;
                this.selectWorld(worldId);
            });
        });
        
        // Wall mining toggle
        document.getElementById('wall-mining-toggle').addEventListener('change', (e) => {
            this.game.player.wallMiningEnabled = e.target.checked;
        });
        
        // Controls help toggle
        document.getElementById('controls-toggle').addEventListener('click', () => {
            const controlsHelp = document.getElementById('controls-help');
            const toggle = document.getElementById('controls-toggle');
            
            if (controlsHelp.style.display === 'none') {
                controlsHelp.style.display = 'block';
                toggle.textContent = '▼';
            } else {
                controlsHelp.style.display = 'none';
                toggle.textContent = '▶';
            }
        });
        
        // ESC key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    selectWorld(worldId) {
        if (worldId === 'main') {
            if (this.game.currentState !== this.game.GAME_STATES.PLAYING) {
                this.game.switchToGame();
            }
        } else if (worldId === 'logo') {
            if (this.game.currentState !== this.game.GAME_STATES.LOGO_SCREEN) {
                this.game.switchToLogoScreen();
            }
        }
        this.updateCurrentSelections();
        this.close();
    }
    
    updateCurrentSelections() {
        // Update block selection highlight
        document.querySelectorAll('.block-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (parseInt(btn.dataset.block) === this.game.selectedBlockType) {
                btn.classList.add('selected');
            }
        });
        
        // Update world selection highlight
        document.querySelectorAll('.world-btn').forEach(btn => {
            btn.classList.remove('selected');
            const worldId = btn.dataset.world;
            const isCurrentWorld = (worldId === 'main' && this.game.currentState === this.game.GAME_STATES.PLAYING) ||
                                 (worldId === 'logo' && this.game.currentState === this.game.GAME_STATES.LOGO_SCREEN);
            if (isCurrentWorld) {
                btn.classList.add('selected');
            }
        });
        
        // Update wall mining toggle
        const toggle = document.getElementById('wall-mining-toggle');
        if (toggle) {
            toggle.checked = this.game.player.wallMiningEnabled;
        }
    }
    
    open() {
        this.isOpen = true;
        this.menuPanel.classList.add('open');
        this.updateCurrentSelections();
    }
    
    close() {
        this.isOpen = false;
        this.menuPanel.classList.remove('open');
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}