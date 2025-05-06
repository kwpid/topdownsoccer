export class Player {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 20;
        this.speed = 300;
        this.dashSpeed = 600;
        this.dashDuration = 0.2;
        this.dashCooldown = 1.5;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.isDashing = false;
        this.velocity = { x: 0, y: 0 };
        this.kickPower = 800;
        this.kickCooldown = 0.5;
        this.kickTimer = 0;
    }

    update(dt, ball, keys) {
        // Handle dash cooldown
        if (this.dashCooldownTimer > 0) {
            this.dashCooldownTimer -= dt;
        }

        // Handle kick cooldown
        if (this.kickTimer > 0) {
            this.kickTimer -= dt;
        }

        // Handle dashing
        if (this.isDashing) {
            this.dashTimer -= dt;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.dashCooldownTimer = this.dashCooldown;
            }
        }

        // Movement
        let dx = 0;
        let dy = 0;

        if (keys.has('w')) dy -= 1;
        if (keys.has('s')) dy += 1;
        if (keys.has('a')) dx -= 1;
        if (keys.has('d')) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        // Apply movement
        const currentSpeed = this.isDashing ? this.dashSpeed : this.speed;
        this.velocity.x = dx * currentSpeed;
        this.velocity.y = dy * currentSpeed;

        // Update position
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        // Keep player in bounds
        this.x = Math.max(this.radius, Math.min(900 - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(600 - this.radius, this.y));

        // Handle dash
        if (keys.has('e') && this.dashCooldownTimer <= 0 && !this.isDashing) {
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
        }

        // Handle kick
        if (keys.has(' ') && this.kickTimer <= 0) {
            this.kickBall(ball);
            this.kickTimer = this.kickCooldown;
        }

        // Check collision with ball
        this.handleBallCollision(ball);
    }

    kickBall(ball) {
        const dx = ball.x - this.x;
        const dy = ball.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + ball.radius) {
            const angle = Math.atan2(dy, dx);
            ball.velocity.x = Math.cos(angle) * this.kickPower;
            ball.velocity.y = Math.sin(angle) * this.kickPower;
        }
    }

    handleBallCollision(ball) {
        const dx = ball.x - this.x;
        const dy = ball.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + ball.radius) {
            // Calculate collision response
            const angle = Math.atan2(dy, dx);
            const overlap = (this.radius + ball.radius) - distance;
            
            // Move ball out of collision
            ball.x = this.x + Math.cos(angle) * (this.radius + ball.radius);
            ball.y = this.y + Math.sin(angle) * (this.radius + ball.radius);

            // Transfer some velocity to the ball
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > 0) {
                const transferRatio = 0.5;
                ball.velocity.x += this.velocity.x * transferRatio;
                ball.velocity.y += this.velocity.y * transferRatio;
            }
        }
    }

    render(ctx) {
        // Draw player
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw dash effect
        if (this.isDashing) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.kickTimer = 0;
    }
} 