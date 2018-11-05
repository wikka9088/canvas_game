import Point from './Point';
import map from './Map';
// import Life from './Life';
import Particle from './Particle';

const BODYCOLOR = "rgb(30,136,168)";
// let dis = 1; //每个几帧画一个尾巴粒子的计数器

export default class Player extends Point {

    constructor(options) {
        super(options);
        this.enemys = options.enemys;
        this.color = options.color || BODYCOLOR;
        this.radius = 5;
        this.lives = options.lives || 2; //生命值
        // this.livesPoint = [];
        // this.tail = []; //尾巴位置数组
        // this.tailLen = 25; //尾巴长度
        this.particleCount = 30;
        this.particles = [];
        this.binding();
        // this.initLife();
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

    //初始化生命值
    // initLife() {
    //     this.livesPoint = [];
    //     for(let i = 0; i < this.lives; i++) {
    //         this.livesPoint.push(new Life({}));
    //     }
    // }

    //减掉生命值
    minusLife() {
        if (this.lives > 0) {
            // let life = this.livesPoint[this.lives - 1];
            // life.dead = true;
            this.lives--;
        } else {
            //dead
            this.destroy();
        }

        // this.looseTailLength();
    }

    //改变尾巴长度
    // looseTailLength() {
    //     this.tailLen -=5;
    // }
    // changeTailLen() {
    //     if(this.lives > 2) {
    //         this.tailLen = 25 + (this.lives - 2) * 5;
    //     } else {
    //         this.tailLen = 25;
    //     }
    // }

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

    // recordTail() {
    //     let self = this;
    //     if (self.tail.length > self.tailLen) {
    //         self.tail.splice(0, self.tail.length - self.tailLen);
    //     }
    //     self.tail.push({
    //         x: self.x,
    //         y: self.y
    //     });
    // }

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

            // if (dis % 2) self.recordTail();
            // dis++;

            // if (self.tail.length > self.tailLen - 10) {
            //     self.renderTail();
            // }
        }

        //爆炸
        if (self.particles.length) self.renderBoom();
    }

    renderTail() {
        let self = this;
        let tails = self.tail, prevPot, nextPot;
        map.ctx.beginPath();
        map.ctx.lineWidth = 2;
        map.ctx.strokeStyle = self.color;

        for(let i = 0; i < tails.length - 1; i++) {
            prevPot = tails[i];
            nextPot = tails[i + 1];
            if (i === 0) {
                map.ctx.moveTo(prevPot.x, prevPot.y);
            } else {
                map.ctx.quadraticCurveTo(prevPot.x, prevPot.y, prevPot.x + (nextPot.x - prevPot.x) / 2, prevPot.y + (nextPot.y - prevPot.y) / 2);
            }

            //保持尾巴最小长度，并有波浪效果
            prevPot.x -= 1.5;
            prevPot.y += 1.5;
        }

        map.ctx.stroke();
    }
    //渲染生命值节点
    // renderLife() {
    //     let self = this;
    //     for(let j = 1; j <= self.livesPoint.length; j++) {
    //         let tailIndex = j * 5;
    //         let life = self.livesPoint[j - 1];
    //         life.render(self.tail[tailIndex]);
    //     }
    // }

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

