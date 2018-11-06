import '../scss/main.scss';
import map from '../js/class/Map.js';
import Enemy from '../js/class/Enemy.js';
import Player from '../js/class/Player.js';

const enemyCount = 200;
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


const canvas = document.getElementById('world');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

map.init({
    canvas,
    width: window.innerWidth,
    height: window.innerHeight
});

function createEnemy(numEnemy) {
    enemys = [];
    for (let i = 0; i < numEnemy; i++) {
        const x = Math.random() * map.width + map.width;
        const y = Math.random() * map.height;
        enemys.push(new Enemy({x, y}));
    }
}

function collision(enemy, player) {
    const disX = player.x - enemy.x;
    const disY = player.y - enemy.y;
    return Math.hypot(disX, disY) < (player.radius + enemy.radius);
}

function initTimer() {
    holdingTime = 0;
    clearTimeout(timer);
    let time = function() {
        timer = setTimeout(function() {
            holdingTime = +timeEle.innerText + 1;
            timeEle.innerText = holdingTime;
            //every 10s, speed up
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

let enemyIndex;
let hadCollision = false;
function animate() {
    map.render();

    for (let i = 0; i < enemys.length; i++) {
        enemys[i].render();
        enemys[i].update();
        if (!player.dead && collision(enemys[i], player)) {
            if (i !== enemyIndex) {
                player.collision();
                if (player.lives === 0) {
                    player.destroy();
                    gameOverModal();
                } else {
                    lifeEle.innerText = player.lives;
                }
                enemyIndex = i;
            }
            hadCollision = true;
        }
    }


    if (player.x < 0 || player.x > map.width || player.y < 0 || player.y > map.height) {
        if (!player.dead) gameOverModal();
        player.destroy();
    }

    //one enemy only collision once at a time
    if (hadCollision) {
        hadCollision = false;
    } else {
        enemyIndex = null;
    }
    player.render();

    window.requestAnimationFrame(animate);
}

function initRoles() {
    createEnemy(enemyCount);
    player = new Player({
        x: map.width / 5,
        y: map.height * 0.6,
        lives: 3,
    });
}

function gameOverModal() {
    gamePanel.style.display = "none";
    gameOver.style.display = "block";
    document.getElementById("game-time").innerHTML = 'Time: ' + holdingTime + ' seconds';
}

function renderBackground() {
    createEnemy(enemyCount);
    //SEAF
    (function mainPageAnimate() {
        if (gameStart) return;
        map.render();

        for (let i = 0; i < enemys.length; i++) {
            enemys[i].render();
            enemys[i].update();
        }
        window.requestAnimationFrame(mainPageAnimate);
    })();
}

function resetGame() {
    startPage.style.display = "none";
    world.style.display = "block";
    gamePanel.style.display = "block";
    gameOver.style.display = "none";
    gameStart = true;
    timeEle.innerText = '0';
    lifeEle.innerText = '3';

    initRoles();
    initTimer();
}

function start() {
    renderBackground();
    gameTitle.classList.add('active');
    startBtnContainer.classList.add('active');
    startBtn.addEventListener('click', () => {
        resetGame();
        animate();
    });
    restartBtn.addEventListener('click', () => resetGame());
}


(function loading() {
    mainPage.style.display = "block";
    start();
})();

