import { c, centerX, centerY, height, width } from "../../../Main.js";
import {  ellipse } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { pauseGame } from "../../pauseGame.js";
import { resizePlayers } from "../../player functions/playerFunctions.js";
import { renderPlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";
import { renderBackground } from "../background/background.js";

let bgm0 = new Audio('./modules/scenes/Color Clash/sounds/bgm0.mp3')
let bgm1 = new Audio('./modules/scenes/Color Clash/sounds/bgm1.mp3')
let musicStarted = false;

let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;

function playBGM () {
    if (!musicStarted){
        bgm0.play();
        setTimeout(() => {
            musicStarted = true;
        }, bgm0.duration * 900);
    } else {
        bgm1.play();
    }
}

let gameStarted = false;
let endGame = false;

function startGame () {
    if (!gameStarted) {
        resizePlayers(75);
        for (let i = 0; i < player.length; i++){
            player[i].x = width/(player.length+1) + width/(player.length+1)*i
            player[i].y = centerY;
            gameStarted = true;
        }
    }
}

let frame = 0;
let second = 30;
function renderTimer () {
    c.beginPath();
    c.font = '40px oswald';
    c.fillStyle = 'rgb(255, 255, 255)'; 
    c.textAlign = 'center'
    if (second > 0){
        if (frame === 60){
            second--;
            frame = 0;
        }
        frame++;
        
        c.lineWidth = 2.5;
        c.rect(centerX-35, height*0.05 - 50, 70, 70);
        c.stroke();
    }
    c.fillText(second, centerX, Math.max(height*0.05, 55));
    c.closePath();
}

let paintedArea = [];
function paint () {    
    let splat = [];
    function pressButtonOnce (pNum) {
        if (player[pNum].buttonA || player[pNum].action) {
            if (player[pNum].ccp.buttonHeld === 0) {
                for (let i = 0; i < 3; i++) {
                    splat[i] = new Audio(`./modules/scenes/Color Clash/sounds/splat${i}.mp3`);
                }
                paintedArea.push( {x: player[pNum].x, y: player[pNum].y, size: player[pNum].size, color: player[pNum].clr});
                splat[Math.floor(Math.random() * 3)].play();
                player[pNum].ccp.buttonHeld++;
            }
        } else { player[pNum].ccp.buttonHeld = 0}
    }

    

    
    for (let i = 0; i < paintedArea.length; i++) {
        ellipse(paintedArea[i].x, paintedArea[i].y, paintedArea[i].size, paintedArea[i].color);
    }
    if (second > 0) {
        for (let i = 0; i < player.length; i++){
            ellipse(player[i].x, player[i].y, player[i].size+2.5, 'rgb(0, 0, 0)');
            pressButtonOnce(i);
        }
    }
}

let readyToEndGame = false;
let readyToGoToNextGame = false;
let pixel = [];
let readyToCalculateCoverage = false;
function calculateCoverage () {
    if (readyToCalculateCoverage) {
        for (let i = 0; i < width; i++){
            pixel[i] = [];
        }

        for (let i = paintedArea.length - 1; i >= 0; i--){
            for (let j = Math.max(Math.floor(paintedArea[i].x - player[0].size/2), 0); j <= Math.max(Math.floor(paintedArea[i].x + player[0].size/2), 1919); j++) {
                for (let k = Math.min(Math.floor(paintedArea[i].y - player[0].size/2), 0); k <= Math.max(Math.floor(paintedArea[i].y + player[0].size/2), 1079); k++){
                    if (Math.pow(j - Math.floor(paintedArea[i].x), 2) + Math.pow(k - Math.floor(paintedArea[i].y), 2) <= Math.pow(player[0].size/2, 2) && !pixel[Math.min(Math.max(0, j), 1919)][Math.min(Math.max(0, k), 1079)]) {
                        pixel[j][k] = paintedArea[i].color;
                    }
                }
            }
        }

        for (let i = 0; i < player.length; i++) {
            for (let j = 0; j < width; j++){
                for (let k = 0; k < height; k++){
                    if (pixel[j][k] === player[i].clr){
                        player[i].ccp.pixelsCovered++;
                    }
                }
            }
        }
        winHandler();
        second = "Time's up!"
        if (player.length === 2) { thirdPlace = undefined; fourthPlace = undefined; }
        if (player.length === 3) { fourthPlace = undefined; }
        readyToEndGame = true;
    }
}

function winHandler () {
    let playerCopy = player.slice(0, player.length);
    while (!firstPlace || !secondPlace || !thirdPlace || !fourthPlace) {
        let highestCoverage = -1;
        let highestPlayer;

        for (let i = 0; i < playerCopy.length; i++) {
            if (playerCopy[i].ccp.pixelsCovered > highestCoverage) {
                highestCoverage = playerCopy[i].ccp.pixelsCovered;
                highestPlayer = playerCopy[i];
            }
        }
        playerCopy.splice(playerCopy.indexOf(highestPlayer), 1);

        if (!firstPlace) { firstPlace = player.slice(player.indexOf(highestPlayer), highestPlayer.pid + 1); }
        else if (!secondPlace) { secondPlace = player.slice(player.indexOf(highestPlayer), highestPlayer.pid + 1); }
        else if (!thirdPlace ) { thirdPlace = player.slice(player.indexOf(highestPlayer), highestPlayer.pid + 1); }
        else if (!fourthPlace) { fourthPlace = player.slice(player.indexOf(highestPlayer), highestPlayer.pid + 1); }
    }
}

let playerPixelPercent = [];
let ascending = new Audio('./modules/scenes/Color Clash/sounds/ascending.mp3')
function scoreScreen () {
    let playersLeftToScore = player.length;
    for (let i = 0; i < player.length; i++){
        if (playerPixelPercent[i] >= player[i].ccp.pixelsCovered/(width*height)*100) {
            playersLeftToScore -= 1;
        }
    }

    if (playersLeftToScore > 0){
        ascending.play();
        ascending = new Audio('');
        renderBackground();
        for (let i = 0; i < player.length; i++) {
            if (!playerPixelPercent[i]) {
                playerPixelPercent[i] = 0.1;
            }
        }
        for (let i = 0; i < player.length; i++){
            c.fillStyle = player[i].clr;
            c.fillRect(width/(player.length+1)-50 + width/(player.length+1)*i, height*0.95, 100, -playerPixelPercent[i]*20);
            c.fillText(`${playerPixelPercent[i].toFixed(1)}%`, width/(player.length+1)-150 + width/(player.length+1)*i, height*0.95 - playerPixelPercent[i]*10,)
            if (playerPixelPercent[i] < player[i].ccp.pixelsCovered/(width*height)*100) {
                playerPixelPercent[i] += 0.1
            }
        }
    } else {
        setTimeout(() => {
            readyToGoToNextGame = true;
        }, 4000)
    }
    if (readyToGoToNextGame) {
        bgm0.pause();
        bgm1.pause();
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace);
    }
}



export function scenePlayColorClash () {
    pauseGame();
    if (!endGame) {
        startGame();
        playBGM();

        renderBackground();
        paint();
        if (second > 0) {
            renderPlayers();
        }
        
        renderTimer();
        calculateCoverage();
        if (second === 0) {
            readyToCalculateCoverage = true;
            c.fillText('Calculating paint coverage...', centerX, centerY)
        }
        if (readyToEndGame === true) {
            endGame = true;
        }
        console.log(player[1].boundAction)
    } else {
        scoreScreen();
    }    
}

