/**
 * entry
 */

import '../scss/main.scss';
import map from '../js/class/Map.js';
import Enemy from '../js/class/Enemy.js';
// import Skill from './js/Skill';
import Player from '../js/class/Player.js';
import {draw as drawLoading} from '../js/loading.js';

const enemyCount = 30;
let player;
let enemys = [];
// let skillPoint;
let holdingTime = 0;
let holdingLevel = 0;
let timer;

const startPage = document.getElementById("start-page");
const loadingPage = document.getElementById("loading-page");
const startBtn = document.getElementById("start-button");
const helpBtn = document.getElementById("help-button");
const gameTitle = document.getElementById("game-title");
const gameBtn = document.getElementById("game-btn");
const restartBtn = document.getElementById("restart");
const startInfo = document.getElementById("introduction");
const world = document.getElementById("game");
const gamePanel = document.getElementById("game-panel");
const gameOver = document.getElementById("game-over");
const timeEle = document.getElementById("time");
const levelEle = document.getElementById("level");

const raf = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };


//地图初始化
const canvas = document.getElementById('world');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

map.init({
    canvas,
    width: window.innerWidth,
    height: window.innerHeight
});

//添加红色点
function createEnemy(numEnemy) {
    enemys = [];
    for (let i = 0; i < numEnemy; i++) {
        const x = Math.random() * map.width + map.width;
        const y = Math.random() * map.height;
        enemys.push(new Enemy({x, y}));
    }
}

//添加技能点
// function createSkill() {
//     const x = Math.random() * map.width + map.width;
//     const y = -Math.random() * map.height;
//     const speed = Math.random() * 1 + 1;
//     const type = ['shield', 'gravity', 'time', 'minimize', 'life',''][Math.floor(Math.random() * 5)];
//
//     skillPoint = new Skill({x, y, type});
// }

//碰撞检测
function collision(enemy, player) {
    const disX = player.x - enemy.x;
    const disY = player.y - enemy.y;
    if (player.hasGravity) {
        return Math.hypot(disX, disY) < (player.gravityRadius + enemy.radius);
    } else if (player.hasShield) {
        return Math.hypot(disX, disY) < (player.shieldRadius + enemy.radius);
    }
    return Math.hypot(disX, disY) < (player.radius + enemy.radius);
}

//添加计时器
function initTimer() {
    holdingTime = 0;
    holdingLevel = 0;
    clearTimeout(timer);
    let time = function() {
        timer = setTimeout(function() {
            holdingTime = +timeEle.innerText + 1;
            timeEle.innerText = holdingTime;
            //每隔10秒加速一次
            if (holdingTime % 10 === 0) {
                holdingLevel++;
                levelEle.innerText = holdingLevel;
                for (let i = 0; i < enemys.length; i++) {
                    enemys[i].speedUp();
                }
            }
            clearTimeout(timer);
            time();
        }, 1000)
    };
    time();
}

//循环动画
var enemyIndex;
// var skillId;
var hadCollision = false;
function animate() {
    map.render();

    //红色粒子撞击判断
    for (let i = 0; i < enemys.length; i++) {
        enemys[i].render();
        enemys[i].update();
        if (!player.dead && collision(enemys[i], player)) {
            if (player.hasGravity) {
                enemys[i].escape(player);
            }
            if (i !== enemyIndex) {

                if (player.lives === 0) {
                    player.destroy();
                    finalScore();
                }

                player.collision(
                    enemys[i].x,
                    enemys[i].y
                );

                if (player.hasShield) {
                    enemys.splice(i, 1);
                    enemys.push(new Enemy({
                        x: Math.random() * map.width + map.width,
                        y: Math.random() * map.height
                    }));
                }

                enemyIndex = i;
            }

            hadCollision = true;
        }
    }

    //技能粒子撞击判断
    // if (collision(skillPoint, player)) {
    //     if (!skillPoint.isEated && skillPoint.id !== skillId) {
    //         player.setSkill(skillPoint.type);
    //         skillId = skillPoint.id;
    //         skillPoint.use();
    //     }
    //     hadCollision = true;
    // }

    //碰到墙壁就狗带
    if (player.x < 0 || player.x > map.width || player.y < 0 || player.y > map.height) {
        if (!player.dead) finalScore();
        player.destroy();
    }

    //一个粒子只进行一次撞击判断
    if (hadCollision) {
        hadCollision = false;
    } else {
        enemyIndex = null;
        // skillId = null;
    }

    // skillPoint.render();
    // skillPoint.update();
    player.render();

    raf(animate);
}

//所有角色的初始化
function initRoles() {
    createEnemy(enemyCount);
    player = new Player({
        x: map.width / 5,
        y: map.height * 0.6,
        enemys: enemys //引用用于相互作用
    });
    // createSkill();
}

//最后分数
function finalScore() {
    gamePanel.style.display = "none";
    gameOver.style.display = "block";
    document.getElementById("score-time").innerHTML = 'Time: ' + holdingTime + ' seconds';
}

//开始界面的背景
function renderBackground() {
    createEnemy(enemyCount);
    (function animate() {
        if (gameStart) return;
        map.render();
        //红色粒子撞击判断
        for (let i = 0; i < enemys.length; i++) {
            enemys[i].render();
            enemys[i].update();
        }
        raf(animate);
    })();
}

//重新开始游戏
function resetGame() {
    startInfo.style.display = "none";
    world.style.display = "block";
    gamePanel.style.display = "block";
    gameOver.style.display = "none";
    gameStart = true;
    timeEle.innerText = '0';
    levelEle.innerText = '0';

    initRoles();
    initTimer();
}

//场景交互
let gameStart = false;
function start() {
    renderBackground();
    gameTitle.classList.add('active');
    gameBtn.classList.add('active');
    startBtn.addEventListener('click', () => {
        resetGame();
        animate(); //animate只能调用一次
    });
    startBtn.addEventListener('touchstart', () => {
        resetGame();
        animate(); //animate只能调用一次
    });
    helpBtn.addEventListener('click', () => {
        console.log(document.getElementById("legend").style);
        document.getElementById("legend").style.opacity =
            document.getElementById("legend").style.opacity == '1' ? '0' : '1';
    });
    restartBtn.addEventListener('click', () => resetGame());
    restartBtn.addEventListener('touchstart', () => resetGame());
}

//进度条渲染
let barRatio = 1;
(function loading() {
    console.log(barRatio);
    if (barRatio !== 1) {
        raf(loading);
    } else {
        startPage.style.display = "block";
        loadingPage.style.display = "none";
        start();
    }
})();




// if (module.hot) {
//     module.hot.accept();
// }