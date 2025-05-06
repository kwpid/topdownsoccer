export class UI {
    constructor(game) {
        this.game = game;
        this.gameUI = document.getElementById('gameUI');
    }

    showMenu() {
        this.gameUI.innerHTML = `
            <div class="menu">
                <h2>Top-Down Soccer</h2>
                <button class="button" onclick="game.startMatchmaking()">Queue for Ranked</button>
                <button class="button" onclick="game.showStats()">View Stats</button>
            </div>
        `;
    }

    showStats() {
        const stats = this.game.playerData.getStats();
        const rank = this.game.playerData.getRank();
        
        this.gameUI.innerHTML = `
            <div class="menu">
                <h2>Player Stats</h2>
                <div class="stats">
                    <div class="rank">${rank}</div>
                    <div>Wins: ${stats.wins}</div>
                    <div>Losses: ${stats.losses}</div>
                    <div>Win Rate: ${stats.winRate}%</div>
                </div>
                <button class="button" onclick="game.showMenu()">Back to Menu</button>
            </div>
        `;
    }

    showMatchmaking() {
        this.gameUI.innerHTML = `
            <div class="matchmaking">
                <h2>Finding Match...</h2>
                <div class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>
        `;
    }

    showGameUI() {
        this.gameUI.innerHTML = `
            <div class="score">0 - 0</div>
            <div class="timer">3:00</div>
            <div class="dash-cooldown">
                <div class="dash-cooldown-fill"></div>
            </div>
        `;
    }

    renderGameUI(score, timer, player) {
        // Update score
        const scoreElement = this.gameUI.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = `${score.player} - ${score.ai}`;
        }

        // Update timer
        const timerElement = this.gameUI.querySelector('.timer');
        if (timerElement) {
            const minutes = Math.floor(timer / 60);
            const seconds = Math.floor(timer % 60);
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // Update dash cooldown
        const dashFill = this.gameUI.querySelector('.dash-cooldown-fill');
        if (dashFill) {
            const cooldownProgress = 1 - (player.dashCooldownTimer / player.dashCooldown);
            dashFill.style.width = `${cooldownProgress * 100}%`;
        }
    }

    showEndScreen(result) {
        const stats = this.game.playerData.getStats();
        const rank = this.game.playerData.getRank();
        
        this.gameUI.innerHTML = `
            <div class="end-screen">
                <h2>Match Complete</h2>
                <div class="result ${result}">${result.toUpperCase()}</div>
                <div class="stats">
                    <div class="rank">${rank}</div>
                    <div>Wins: ${stats.wins}</div>
                    <div>Losses: ${stats.losses}</div>
                    <div>Win Rate: ${stats.winRate}%</div>
                </div>
                <button class="button" onclick="game.showMenu()">Back to Menu</button>
            </div>
        `;
    }
} 