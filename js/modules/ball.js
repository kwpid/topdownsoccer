export class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 12;
        this.velocity = { x: 0, y: 0 };
        this.friction = 0.98;
        this.maxSpeed = 1000;
        this.trail = [];
        this.maxTrailLength = 10;
    }

    update(dt, player, ai) {
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update position
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        // Keep ball in bounds with bounce
        if (this.x < this.radius) {
            this.x = this.radius;
            this.velocity.x = -this.velocity.x * 0.8;
        } else if (this.x > 900 - this.radius) {
            this.x = 900 - this.radius;
            this.velocity.x = -this.velocity.x * 0.8;
        }

        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocity.y = -this.velocity.y * 0.8;
        } else if (this.y > 600 - this.radius) {
            this.y = 600 - this.radius;
            this.velocity.y = -this.velocity.y * 0.8;
        }

        // Update trail
        this.trail.unshift({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }

        // Limit speed
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            const ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
    }

    render(ctx) {
        // Draw trail
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = 1 - (i / this.trail.length);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.radius * (1 - i / this.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw ball pattern
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw ball highlight
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.trail = [];
    }
} 