import { buttonPic, c, centerX, centerY, height, resScale, width } from "../../../Main.js";
import {  ellipse, image } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { keys } from "../../listeners/keyListener.js";
import { pauseGame } from "../../pauseGame.js";
import { forAllPlayers, resizePlayers } from "../../player functions/playerFunctions.js";
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

let playerReady = [];
let controls = []
let rules1 = 'Players compete to cover the largest percentage of the screen by laying down paint.'
let rules2 = 'Move with the left stick. Drop paint with the A button.';
let rules3 = 'Visit "Controls" on the main menu for keyboard controls.';
function pregameScreen (title, rules1, rules2, startGameFunction) {
    c.fillStyle =  'rgb(0, 0, 0)';
    c.fillRect(0, 0, width, height);

    c.textAlign = 'center';
    c.fillStyle = 'rgb(255, 255, 255)';
    for (let i = 0; i < player.length; i++) {
        if (playerReady.length < player.length) {
            playerReady[i] = false;
        }

        
        if (gamepad[0]) {
            c.fillText(`Press the A Button or "ENTER" on your keyboard to start the game.`, centerX, height*0.9)
            if (gamepad[0].buttons[0].pressed) {
                playerReady[i] = true;
            }
        } else {
            c.fillText(`Press "ENTER" on your keyboard to start the game.`, centerX, height*0.9)
        }
        if (keys[13].returnValue) {
            playerReady[i] = true
        }
    }
    
    c.font = `${60*resScale(true)}px oswald`;
    c.fillText(title, centerX, height*0.15);
    c.font = `${40*resScale(true)}px oswald`;
    c.fillText(rules1, centerX, height*0.3);
    c.fillText(rules2, centerX, height*0.4);
    c.fillText(rules3, centerX, height*0.75);

    for (let i = 0; i < controls.length; i++) {
        image(controls[i], centerX, centerY + 100*i);
    }

    if (playerReady.every(element => element === true)) {
        startGameFunction();
    }
}

function startGame () {
    if (!gameStarted) {
        resizePlayers(75);
        for (let i = 0; i < player.length; i++){
            player[i].x = width/(player.length+1) + width/(player.length+1)*i
            player[i].y = centerY;
            buttonHeld[i] = 0;
            pixelsCovered[i] = 0;
        }
        gameStarted = true;
    }
}

let frame = 0;
let second = 30;
function renderTimer () {
    c.beginPath();
    c.font = `${40*resScale(true)}px oswald`;
    c.fillStyle = 'rgb(255, 255, 255)'; 
    c.textAlign = 'center'
    if (second > 0){
        if (frame === 60){
            second--;
            frame = 0;
        }
        frame++;
        
        c.lineWidth = 2.5;
        c.rect(centerX-35*resScale(), height*0.05 - 50*resScale(true), 70*resScale(), 70*resScale(true));
        c.stroke();
    }
    c.fillText(second, centerX, Math.max(height*0.05, 55*resScale(true)));
    c.closePath();
}

let paintedArea = [];
let buttonHeld = [];
function paint () {    
    let splat = [];

    function pressButtonOnce (pNum) {
        if (player[pNum].buttonA || player[pNum].action) {
            if (buttonHeld[pNum] === 0) {
                for (let i = 0; i < 3; i++) {
                    splat[i] = new Audio(`./modules/scenes/Color Clash/sounds/splat${i}.mp3`);
                }
                paintedArea.push( {x: player[pNum].x, y: player[pNum].y, size: player[pNum].size, color: player[pNum].clr});
                splat[Math.floor(Math.random() * 3)].play();
                buttonHeld[pNum]++;
            }
        } else { buttonHeld[pNum] = 0}
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
let pixelsCovered = [];
function calculateCoverage () {
    if (readyToCalculateCoverage) {
        for (let i = 0; i < width; i++){
            pixel[i] = [];
        }

        for (let i = paintedArea.length - 1; i >= 0; i--){
            for (let j = Math.max(Math.floor(paintedArea[i].x - player[0].size/2), 0); j <= Math.max(Math.floor(paintedArea[i].x + player[0].size/2), width-1); j++) {
                for (let k = Math.min(Math.floor(paintedArea[i].y - player[0].size/2), 0); k <= Math.max(Math.floor(paintedArea[i].y + player[0].size/2), height-1); k++){
                    if (Math.pow(j - Math.floor(paintedArea[i].x), 2) + Math.pow(k - Math.floor(paintedArea[i].y), 2) <= Math.pow(player[0].size/2, 2) && !pixel[Math.min(Math.max(0, j), width-1)][Math.min(Math.max(0, k), height-1)]) {
                        pixel[j][k] = paintedArea[i].color;
                    }
                }
            }
        }

        for (let i = 0; i < player.length; i++) {
            for (let j = 0; j < width; j++){
                for (let k = 0; k < height; k++){
                    if (pixel[j][k] === player[i].clr){
                        pixelsCovered[i]++;
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
            if (pixelsCovered[i] > highestCoverage) {
                highestCoverage = pixelsCovered[i];
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
let ascending = new Audio('./modules/scenes/Color Clash/sounds/ascending.mp3');
function scoreScreen () {
    let playersLeftToScore = player.length;
    for (let i = 0; i < player.length; i++){
        if (playerPixelPercent[i] >= pixelsCovered[i]/(width*height)*100) {
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
            c.fillRect(width/(player.length+1)-50 + width/(player.length+1)*i, height*0.95, 100*resScale(), -playerPixelPercent[i]*20*resScale(true));
            c.fillText(`${playerPixelPercent[i].toFixed(1)}%`, width/(player.length+1)-150 + width/(player.length+1)*i, height*0.95 - playerPixelPercent[i]*10,)
            if (playerPixelPercent[i] < pixelsCovered[i]/(width*height)*100) {
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

export function resetGameColorClash () {
    bgm0 = new Audio('./modules/scenes/Color Clash/sounds/bgm0.mp3');
    bgm1 = new Audio('./modules/scenes/Color Clash/sounds/bgm1.mp3');
    ascending = new Audio('./modules/scenes/Color Clash/sounds/ascending.mp3');

    pixelsCovered = [];
    buttonHeld = [];
    musicStarted = false;
    firstPlace = undefined;
    secondPlace = undefined;
    thirdPlace = undefined;
    fourthPlace = undefined;
    frame = 0;
    second = 30;
    pixel = [];
    playerPixelPercent = [];
    paintedArea = [];
    readyToCalculateCoverage = false;
    readyToEndGame = false;
    readyToGoToNextGame = false;
    gameStarted = false;
    endGame = false;
}

export function scenePlayColorClash () {
    pauseGame([bgm1]);

    if (!gameStarted){
        controls = [buttonPic[10], buttonPic[0]]
        pregameScreen('Color Clash', rules1, rules2, startGame);
    }
    if (!endGame && gameStarted) {
        playBGM();
        startGame();

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
    } else if (endGame) {
        scoreScreen();
    }    
}

