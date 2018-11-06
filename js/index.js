import '../scss/main.scss';
import map from '../js/class/Map.js';
import Enemy from '../js/class/Enemy.js';
import Player from '../js/class/Player.js';

const enemyCount = 100;
let player;
let enemys = [];
let holdingTime = 0;
let timer;
let gameStart = false;

const mainPage = document.getElementById("main-page");
const startBtnContainer = document.getElementById("start-btn-container");
const startBtn = document.getElementById("start-button");
const gameTitle = document.getElementById("game-title");
const restartBtn = document.getElementById("restart");
const startPage = document.getElementById("game-start");
const world = document.getElementById("game");
const gamePanel = document.getElementById("game-panel");
const gameOver = document.getElementById("game-over");
const timeEle = document.getElementById("time");
const lifeEle = document.getElementById("life");

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

//碰撞检测
function collision(enemy, player) {
    const disX = player.x - enemy.x;
    const disY = player.y - enemy.y;
    return Math.hypot(disX, disY) < (player.radius + enemy.radius);
}

//添加计时器
function initTimer() {
    holdingTime = 0;
    clearTimeout(timer);
    let time = function() {
        timer = setTimeout(function() {
            holdingTime = +timeEle.innerText + 1;
            timeEle.innerText = holdingTime;
            //每隔10秒加速一次
            if (holdingTime % 10 === 0) {
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
let enemyIndex;
let hadCollision = false;
function animate() {
    map.render();

    //红色粒子撞击判断
    for (let i = 0; i < enemys.length; i++) {
        enemys[i].render();
        enemys[i].update();
        if (!player.dead && collision(enemys[i], player)) {
            if (i !== enemyIndex) {

                if (player.lives === 0) {
                    player.destroy();
                    gameOverModal();
                } else {
                    lifeEle.innerText = player.lives;
                }

                player.collision();

                enemyIndex = i;
            }

            hadCollision = true;
        }
    }

    //碰到墙壁就狗带
    if (player.x < 0 || player.x > map.width || player.y < 0 || player.y > map.height) {
        if (!player.dead) gameOverModal();
        player.destroy();
    }

    //一个粒子只进行一次撞击判断
    if (hadCollision) {
        hadCollision = false;
    } else {
        enemyIndex = null;
    }
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
}

//最后分数
function gameOverModal() {
    gamePanel.style.display = "none";
    gameOver.style.display = "block";
    document.getElementById("game-time").innerHTML = 'Time: ' + holdingTime + ' seconds';
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
    startPage.style.display = "none";
    world.style.display = "block";
    gamePanel.style.display = "block";
    gameOver.style.display = "none";
    gameStart = true;
    timeEle.innerText = '0';

    initRoles();
    initTimer();
}

//场景交互
function start() {
    renderBackground();
    gameTitle.classList.add('active');
    startBtnContainer.classList.add('active');
    startBtn.addEventListener('click', () => {
        resetGame();
        animate(); //animate只能调用一次
    });
    restartBtn.addEventListener('click', () => resetGame());
}


(function loading() {
    mainPage.style.display = "block";
    start();
})();

