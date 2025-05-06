export class PlayerData {
    constructor() {
        this.stats = this.loadStats();
    }

    loadStats() {
        const defaultStats = {
            wins: 0,
            losses: 0,
            winRate: 0
        };

        try {
            const savedStats = localStorage.getItem('soccerStats');
            return savedStats ? JSON.parse(savedStats) : defaultStats;
        } catch (error) {
            console.error('Error loading stats:', error);
            return defaultStats;
        }
    }

    saveStats() {
        try {
            localStorage.setItem('soccerStats', JSON.stringify(this.stats));
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }

    addWin() {
        this.stats.wins++;
        this.updateWinRate();
        this.saveStats();
    }

    addLoss() {
        this.stats.losses++;
        this.updateWinRate();
        this.saveStats();
    }

    updateWinRate() {
        const total = this.stats.wins + this.stats.losses;
        this.stats.winRate = total > 0 ? Math.round((this.stats.wins / total) * 100) : 0;
    }

    getStats() {
        return { ...this.stats };
    }

    getRank() {
        const winRate = this.stats.winRate;
        
        if (winRate >= 80) return 'Champion';
        if (winRate >= 70) return 'Diamond';
        if (winRate >= 60) return 'Platinum';
        if (winRate >= 50) return 'Gold';
        if (winRate >= 40) return 'Silver';
        return 'Bronze';
    }
} 