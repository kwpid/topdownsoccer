import { Player } from './player.js';
import { AIPlayer } from './ai.js';
import { Ball } from './ball.js';
import { UI } from './ui.js';
import { PlayerData } from './playerData.js';

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.state = 'menu'; // menu, matchmaking, playing, end
        this.player = null;
        this.ai = null;
        this.ball = null;
        this.ui = new UI(this);
        this.playerData = new PlayerData();
        this.score = { player: 0, ai: 0 };
        this.timer = 180; // 3 minutes
        this.matchmakingTime = 0;
        this.matchResult = null;
        this.lastTime = 0;
        this.keys = new Set();
        
        // Set up input handlers
        this.setupInputHandlers();
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.key.toLowerCase());
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });
    }

    start() {
        this.showMenu();
        this.gameLoop();
    }

    showMenu() {
        this.state = 'menu';
        this.ui.showMenu();
    }

    startMatchmaking() {
        this.state = 'matchmaking';
        this.matchmakingTime = 0;
        this.ui.showMatchmaking();
    }

    startGame() {
        this.state = 'playing';
        this.score = { player: 0, ai: 0 };
        this.timer = 180;
        this.player = new Player(150, this.canvas.height / 2, 'blue');
        this.ai = new AIPlayer(this.canvas.width - 150, this.canvas.height / 2, 'red');
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2);
        this.ui.showGameUI();
    }

    endGame(result) {
        this.state = 'end';
        this.matchResult = result;
        if (result === 'win') this.playerData.addWin();
        if (result === 'loss') this.playerData.addLoss();
        this.ui.showEndScreen(result);
    }

    update(dt) {
        if (this.state === 'playing') {
            // Update timer
            this.timer -= dt;
            if (this.timer <= 0) {
                this.timer = 0;
                this.endGame(this.score.player > this.score.ai ? 'win' : 'loss');
                return;
            }

            // Update game objects
            this.player.update(dt, this.ball, this.keys);
            this.ai.update(dt, this.ball, this.player);
            this.ball.update(dt, this.player, this.ai);

            // Check for goals
            if (this.ball.x < 0) {
                this.score.ai++;
                this.resetPositions();
            } else if (this.ball.x > this.canvas.width) {
                this.score.player++;
                this.resetPositions();
            }

            // Check win condition
            if (this.score.player >= 7) this.endGame('win');
            if (this.score.ai >= 7) this.endGame('loss');
        } else if (this.state === 'matchmaking') {
            this.matchmakingTime += dt;
            if (this.matchmakingTime > 2) this.startGame();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === 'playing') {
            this.drawField();
            this.player.render(this.ctx);
            this.ai.render(this.ctx);
            this.ball.render(this.ctx);
            this.ui.renderGameUI(this.score, this.timer, this.player);
        }
    }

    gameLoop(timestamp = 0) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    resetPositions() {
        this.player.reset(150, this.canvas.height / 2);
        this.ai.reset(this.canvas.width - 150, this.canvas.height / 2);
        this.ball.reset(this.canvas.width / 2, this.canvas.height / 2);
    }

    drawField() {
        // Draw field background
        this.ctx.fillStyle = '#2d2d2d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw field markings
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 4;

        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 80, 0, Math.PI * 2);
        this.ctx.stroke();

        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();

        // Goals
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(-10, this.canvas.height / 2 - 60, 20, 120);
        this.ctx.fillRect(this.canvas.width - 10, this.canvas.height / 2 - 60, 20, 120);
    }

    handleResize() {
        // Maintain aspect ratio and scale
        const aspectRatio = 900 / 600;
        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 40;
        
        let width = maxWidth;
        let height = width / aspectRatio;
        
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }
} 