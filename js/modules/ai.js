export class AIPlayer {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 20;
        this.speed = 280; // Slightly slower than player
        this.dashSpeed = 550;
        this.dashDuration = 0.2;
        this.dashCooldown = 1.5;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.isDashing = false;
        this.velocity = { x: 0, y: 0 };
        this.kickPower = 750;
        this.kickCooldown = 0.5;
        this.kickTimer = 0;
        this.decisionTimer = 0;
        this.decisionInterval = 0.1;
        this.targetX = x;
        this.targetY = y;
    }

    update(dt, ball, player) {
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

        // Make decisions
        this.decisionTimer -= dt;
        if (this.decisionTimer <= 0) {
            this.makeDecision(ball, player);
            this.decisionTimer = this.decisionInterval;
        }

        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            const currentSpeed = this.isDashing ? this.dashSpeed : this.speed;
            this.velocity.x = Math.cos(angle) * currentSpeed;
            this.velocity.y = Math.sin(angle) * currentSpeed;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        // Update position
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        // Keep AI in bounds
        this.x = Math.max(this.radius, Math.min(900 - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(600 - this.radius, this.y));

        // Check collision with ball
        this.handleBallCollision(ball);
    }

    makeDecision(ball, player) {
        const ballToGoal = this.isBallMovingTowardsGoal(ball);
        const isBallInDangerZone = this.isBallInDangerZone(ball);
        const distanceToBall = this.getDistanceTo(ball.x, ball.y);
        const distanceToPlayer = this.getDistanceTo(player.x, player.y);

        // Decide whether to dash
        if (this.dashCooldownTimer <= 0 && !this.isDashing) {
            if (ballToGoal && distanceToBall < 150) {
                this.isDashing = true;
                this.dashTimer = this.dashDuration;
            }
        }

        // Set target position
        if (isBallInDangerZone) {
            // Defend goal
            this.targetX = 800;
            this.targetY = ball.y;
        } else if (ballToGoal) {
            // Chase ball
            this.targetX = ball.x;
            this.targetY = ball.y;
        } else {
            // Position between ball and goal
            this.targetX = (ball.x + 800) / 2;
            this.targetY = ball.y;
        }

        // Kick ball if close enough
        if (distanceToBall < this.radius + ball.radius + 10 && this.kickTimer <= 0) {
            this.kickBall(ball);
            this.kickTimer = this.kickCooldown;
        }
    }

    isBallMovingTowardsGoal(ball) {
        return ball.velocity.x > 0;
    }

    isBallInDangerZone(ball) {
        return ball.x > 600;
    }

    getDistanceTo(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
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
        // Draw AI player
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
        this.targetX = x;
        this.targetY = y;
    }
} 