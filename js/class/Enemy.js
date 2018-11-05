import map from './Map';
import Point from './Point';

export default class Enemy extends Point {
    
    constructor(options) {
        super(options);
        this.radius = Math.random() * 2 + 3;
        this.color = "red";
        this.vx = 0;
        this.vy = 0;
        this.speed = options.speed || Math.random() * 1 + 0.5;
        this.type = options.type || 'normal';
    }

    update() {
        this.x -= this.speed;
        this.y += this.speed;
        
        if (this.x < -10) {
            this.x = map.width + 10 + Math.random() * 30;
        }
        if (this.y > map.height + 10) {
            this.y = -10 + Math.random() * -30;
        }
    }

    speedUp(speed) {
        this.speed += speed || 0.5;
    }

    render() {
        let self = this;
        map.ctx.beginPath();
        map.ctx.fillStyle = self.color;
        map.ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, false);
        map.ctx.fill();

    }
}