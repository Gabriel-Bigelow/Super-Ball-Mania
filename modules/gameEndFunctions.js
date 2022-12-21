import { c, centerX, centerY, changeScene, confetti, height, resScale, width } from "../Main.js";
import { buttonNewGame } from "./buttons.js";
import { image } from "./drawShapes.js";
import { resizePlayers } from "./player functions/playerFunctions.js";
import { pAccelRate, pDecelRate, player, pTopSpeed } from "./players.js";
import { renderBackground } from "./scenes/background/background.js";
import { resetGameBallfWithYourFriends } from "./scenes/Ballf With Your Friends/BallfWithYourFriends.js";
import { resetGameFlappyBalls} from "./scenes/Flappy Balls/playFlappyBalls.js";
import { games, removeFirstGame, removeRandomGame } from "./scenes/gameSelect.js";
import { resetGames, sceneTitle, themeMusic } from "./scenes/titleScreen.js";

let pointsDistributed = false;
let readyToChange = false;
let winner = undefined;
let yay = new Audio('./sounds/yay.mp3');
let playGameEndAudio = true;

export function resetPlayerProperties () {
    for (let i = 0; i < player.length; i++){ 
        player[i].lose = false;
        player[i].xSpeed = 0;
        player[i].ySpeed = 0;
        player[i].topSpeed = pTopSpeed;
        player[i].accelRate = pAccelRate;
        player[i].decelRate = pDecelRate;
        player[i].sprintEnergy = 100;
    }    
    resizePlayers(100);
}

function animatePoints (whichPlayer, howManyTimes) {
    if (whichPlayer[0]) {
        setTimeout(() => {
            for (let i = 0; i < howManyTimes; i++){
                setTimeout(() => {
                    let pointsIncrease = new Audio('./sounds/points.mp3');
                    pointsIncrease.play();
                    player[whichPlayer[0].pid].points += 1;
                }, 500*i)
            }
        }, 1000);
    }
}

export function distributePoints (place1, place2, place3, place4) {
    themeMusic.play();
    if (!pointsDistributed) {
        animatePoints(place1, 4);
        animatePoints(place2, 3);
        if (place3) { animatePoints(place3, 2); }
        if (place4) { animatePoints(place4, 1); }
        pointsDistributed = true;
    }
    for (let i = 0; i < player.length; i++) {
        player[i].lose = false;
        player[i].draw();
        player[i].x = width/player.length/2 + ((width)/player.length)*i; 
        player[i].y = centerY*3/2 - player[i].points*10
        c.fillStyle = player[i].clr;
        c.fillText(`Points: ${player[i].points}`, player[i].x, player[i].y + player[i].size*1.2)
        c.fillRect(player[i].x-player[i].size/2, player[i].y + player[i].size * 1.6 + player[i].points*10, player[i].size, player[i].points*-10)
    }
}

export function nextGame (place1, place2, place3, place4) {
    let changeGame = false;

    resetPlayerProperties();
    c.textAlign = 'center'
    c.fillStyle = "rgb(0, 0, 0)";
    c.fillRect(0, 0, width, height);
    c.font = `${40*resScale(true)}px oswald`;

    distributePoints(place1, place2, place3, place4);
    if (pointsDistributed) {
        setTimeout(() => {
            readyToChange = true;
        }, 4000)
    }
    if (readyToChange) {
        changeGame = true;
        if (readyToChange && changeGame) {
            changeToNextGame();
        }
    }
}


function animatePoints2 (whichPlayer, howManyTimes) {
    if (whichPlayer || whichPlayer === 0) {
        setTimeout(() => {
            for (let i = 0; i < howManyTimes; i++){
                setTimeout(() => {
                    let pointsIncrease = new Audio('./sounds/points.mp3');
                    pointsIncrease.play();
                    player[whichPlayer].points += 1;
                }, 500*i)
            }
        }, 1000);
    }
}

function distributeIndividualPoints (pNum, howManyPoints) {
    themeMusic.play();
    if (!pointsDistributed) {
        animatePoints2(pNum, howManyPoints);
        if (pNum === player.length-1) {
            pointsDistributed = true;
        }
    }
    for (let i = 0; i < player.length; i++) {
        player[i].lose = false;
        player[i].draw();
        player[i].x = width/player.length/2 + ((width)/player.length)*i; 
        player[i].y = centerY*3/2 - player[i].points*10
        c.fillStyle = player[i].clr;
        c.fillText(`Points: ${player[i].points}`, player[i].x, player[i].y + player[i].size*1.2)
        c.fillRect(player[i].x-player[i].size/2, player[i].y + player[i].size * 1.6 + player[i].points*10, player[i].size, player[i].points*-10)
    }
}

export function nextGameInd (pNum, howManyPoints) {
    let changeGame = false;

    resetPlayerProperties();
    c.textAlign = 'center'
    c.fillStyle = "rgb(0, 0, 0)";
    c.fillRect(0, 0, width, height);
    c.font = `${40*resScale(true)}px oswald`;

    distributeIndividualPoints(pNum, howManyPoints)
    if (pointsDistributed) {
        setTimeout(() => {
            readyToChange = true;
        }, 4000)
    }
    if (readyToChange) {
        changeGame = true;
        if (readyToChange && changeGame && pNum === player.length-1) {
            changeToNextGame();
        }
    }
}



function changeToNextGame() {
    if (games.length > 0) {
        themeMusic.pause();
        changeScene(games[0])
        removeFirstGame();
        setTimeout(() => {
            pointsDistributed = false;
            readyToChange = false;
        }, 5000)
    } else {
        decideWinner();
        playGameEndAudio = true;
        changeScene(sceneEndGame);
    }
}

function changeToRandomGame() {
    themeMusic.pause();
    let randomNumber = Math.floor(Math.random() * games.length)
    if (games.length > 1) {
        changeScene(games[randomNumber])
        removeRandomGame(randomNumber);
        setTimeout(() => {
            pointsDistributed = false;
            readyToChange = false;
        }, 5000)
    } else {
        decideWinner();
        playGameEndAudio = true;
        changeScene(sceneEndGame);
    }
}

let confettiFrame = 0;
function sceneEndGame () {
    themeMusic.play();    
    c.fillStyle = 'rgb(0, 0, 0)';
    c.fillRect(0, 0, width, height)
    c.font = `${40*resScale(true)}px oswald`;

    if (playGameEndAudio) { yay.play(); }
    
    playGameEndAudio = false;
    image(confetti[Math.floor(confettiFrame)], player[winner].x, player[winner].y, resScale(), resScale(true));
    confettiFrame ++
    if (confettiFrame === confetti.length) {
        confettiFrame = 0;
    }

    for (let i = 0; i < player.length; i++) {
        player[i].draw();
        player[i].x = width/player.length/2 + ((width)/player.length)*i; 
        player[i].y = centerY*3/2 - player[i].points*10
        c.fillStyle = player[i].clr;
        c.fillText(`Points: ${player[i].points}`, player[i].x, player[i].y + player[i].size*1.2)
        c.fillRect(player[i].x-player[i].size/2, player[i].y + player[i].size * 1.6 + player[i].points*10, player[i].size, player[i].points*-10)
    }
    c.font = `${70*resScale(true)}px oswald`;
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillText(`${player[winner].name} wins!`, centerX, height*0.1);

    buttonNewGame.draw(newGame);
}

function decideWinner () {
    let highestScore = 0;
    for (let i = 0; i < player.length; i++) {
        if (player[i].points > highestScore) {
            highestScore = player[i].points
            winner = i;
        }
    }
}

function newGame() {
    changeScene(sceneTitle);
    resetPlayerProperties();
    for(let i = 0; i < player.length; i++) {
        player[i].points = 0;
    }

    setTimeout(() => {
        pointsDistributed = false;
        readyToChange = false;
        winner = undefined;
        confettiFrame = 0;
    }, 5000)
    resetGames();
}