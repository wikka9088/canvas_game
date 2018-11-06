import map from './Map';

const random = Math.random;

export default class Particle {

    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.vx = -2 + 4 * random(); //speed in X-axis [-2,2]
        this.vy = -2 + 4 * random();
        this.destroy = false;
        this.speed = 0.04;
        this.size = options.size || 2;
        this.color = options.color || "#ffaf14";
        this.width = this.size + random() * 2;
        this.height = this.size + random() * 2;
    }

    update() {
        this.x += this.vx; //move towards X-axis
        this.y += this.vy;

        this.width -= this.speed; // dot becoming smaller
        this.height -= this.speed;

        if (this.width < 0) {
            this.destroy = true;
        }
    }

    render() {
        map.ctx.fillStyle = this.color;
        map.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}