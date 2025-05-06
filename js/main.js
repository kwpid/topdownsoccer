import { Game } from './modules/game.js';

// Initialize game when window loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const game = new Game(canvas, ctx);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        game.handleResize();
    });

    // Start the game
    game.start();
}); 