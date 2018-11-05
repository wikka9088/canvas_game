import Point from './Point';
import map from './Map';
import Particle from './Particle';

const BODYCOLOR = "rgb(30,136,168)";

export default class Player extends Point {

    constructor(options) {
        super(options);
        this.enemys = options.enemys;
        this.color = options.color || BODYCOLOR;
        this.radius = 10;
        this.lives = options.lives || 2;
        this.particleCount = 30;
        this.particles = [];
        this.binding();
    }

    binding() {
        let self = this;
        window.addEventListener('mousemove', (e = window.event) => {
            self.moveTo(e.clientX - 10, e.clientY - 30);
        });
    }

    moveTo(posX, posY) {
        this.x = posX;
        this.y = posY;
    }

    //爆炸方法
    boom(x, y, color, size) {
        let self = this;
        let eachPartical = [];
        for (let i = 0; i < self.particleCount; i++) {
            eachPartical.push(new Particle({x, y, color, size}));
        }
        self.particles.push(eachPartical);
    }

    //撞击
    collision() {
        this.minusLife();
        this.boom(this.x, this.y);
        this.flash();
    }

    //减掉生命值
    minusLife() {
        if (this.lives > 0) {
            this.lives--;
        } else {
            //dead
            this.destroy();
        }
    }

    //失去生命的时候身体闪烁
    flash() {
        let self = this;

        self.flashing = true;
        let timeout = setTimeout(function() {
            self.flashing = false;
            self.color = BODYCOLOR;
            clearTimeout(timeout);
        }, 500);
    }

    destroy() {
        this.dead = true;
        this.lives = -1;
    }

    render() {
        let self = this;

        if (!self.dead) {
            map.ctx.beginPath();

            //闪烁效果
            if (self.flashing) {
                self.color = ["#fff", BODYCOLOR][Math.round(Math.random())];
            }

            map.ctx.fillStyle = self.color;
            map.ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, false);
            map.ctx.fill();
        }

        //爆炸
        if (self.particles.length) self.renderBoom();
    }

    renderBoom() {
        for (let i = 0; i < this.particles.length; i++) {
            let eachPartical = this.particles[i];
            for (let j = 0; j < eachPartical.length; j++) {
                if (eachPartical[j].destroy) {
                    eachPartical.splice(j, 1);
                } else {
                    eachPartical[j].render();
                    eachPartical[j].update();
                }
            }
        }
    }
 }

