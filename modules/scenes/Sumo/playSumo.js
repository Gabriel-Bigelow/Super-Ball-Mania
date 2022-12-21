import { c, canvas, canvasHeightBeforeResize, centerX, centerY, glassTexture, height, lavaTexture, resScale, width } from "../../../Main.js";
import { ellipse } from "../../drawShapes.js";
import { player } from "../../players.js";
import { forAllPlayers, assignControls, resizePlayers } from "../../player functions/playerFunctions.js"

import { gamepad } from "../../listeners/gamepadListener.js";
import { inputControls } from "../../inputs.js";
import { pauseGame } from "../../pauseGame.js";
import { nextGame } from "../../gameEndFunctions.js";

let bgm = new Audio('./modules/scenes/sumo/sounds/bgm.mp3')
let air = new Audio('./modules/scenes/sumo/sounds/air.mp3')

let gameStart = false;
let endGame = false;
let arenaSize;
let timePassedSincePlayerDied = 0;

let loseMessage = '';
let playersLeft;
let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;



let loopAirSound = setInterval( () => {
    air = new Audio('./modules/scenes/sumo/sounds/air.mp3');
}, 11500);
function startGame () {
    if (gameStart === false){ 
        arenaSize = height*1.1; 
        resizePlayers(75);
        for (let i = 0; i < player.length; i++){
            player[i].x = Math.cos((Math.PI*2*i/player.length))*(arenaSize/2)*0.6 + centerX;
            player[i].y = Math.sin((Math.PI*2*i/player.length))*(arenaSize/2)*0.6 + centerY;
        }
        loopAirSound;
        playersLeft = player.slice(0, player.length);
        gameStart = true;
    }
};

let lavaTextureX = 0;
let lavaTextureY = lavaTextureX * 9/16
function renderLava () {
    for (let i = -3; i < 4; i++){
        for (let j = -2; j < 3; j++){
            c.drawImage(lavaTexture, lavaTextureX+800*i, -lavaTextureY+800*j);
        }
    }
    lavaTextureX+= 0.5;
    lavaTextureY+= 0.5*9/16;
    
    lavaTextureX %= 800;
    lavaTextureY %= 800
}

function renderArena () {
    c.strokeStyle = 'rgb(91, 91, 91)';
    ellipse(centerX, centerY, 100, 'rgb(91, 91, 91)');
    c.lineWidth = 10*resScale();
    c.beginPath();
    c.arc(centerX, centerY, arenaSize/2, 0, Math.PI*2);
    c.closePath();
    c.stroke();
    
    c.save();
    c.beginPath()
    c.arc(centerX, centerY, arenaSize/2-5, 0, Math.PI*2, false);
    c.closePath();
    c.clip();
    for (let i = -6; i < 6; i++){
        for (let j = -6; j < 6; j++){
            c.globalAlpha = 0.85;
            c.drawImage(glassTexture, centerX + 400*i, centerY+400*j);
            c.globalAlpha = 1;
        }
    }
    c.restore();
}
function shrinkArena () {
    timePassedSincePlayerDied++;
    if (timePassedSincePlayerDied >= 900 && arenaSize > 150){
        arenaSize *= 0.9995;
    }
}

function renderPlayers () {
    for (let i = 0; i < player.length; i++) {
        if (!player[i].lose){
            player[i].draw();
            player[i].checkForWallCollision();
            for (let j = i; j < player.length; j++){
                if ( j !== i ){
                    player[i].checkForPlayerCollision(j);
                }    
            }
        }
        //assigns default gamepad controllers to the first 4 players without controls defined, then gives keyboard controls to the next 4 players without controls defined
        for (let j = 0; j < gamepad.length; j++){
            if (!player[i].controllerType && (!inputControls.controllerAssignedTo[j] && inputControls.controllerAssignedTo[j] !== 0)){
                assignControls(i, 'gamepad', j);
                inputControls.controllerAssignedTo[j] = i;
            }
        }
        if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[37] || !inputControls.keysAssignedTo[38] || !inputControls.keysAssignedTo[39] || !inputControls.keysAssignedTo[40] ||  !inputControls.keysAssignedTo[16]) ) { assignControls(i, 'keyboard', undefined, 37, 38, 39, 40, 16, 13, 46, 34); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[65] || !inputControls.keysAssignedTo[87] || !inputControls.keysAssignedTo[68] || !inputControls.keysAssignedTo[83] ||  !inputControls.keysAssignedTo[67]) ){ assignControls(i, 'keyboard', undefined, 65, 87, 68, 83, 67, 88, 81, 69); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[70] || !inputControls.keysAssignedTo[84] || !inputControls.keysAssignedTo[72] || !inputControls.keysAssignedTo[71] ||  !inputControls.keysAssignedTo[78]) ){ assignControls(i, 'keyboard', undefined, 70, 84, 72, 71, 78, 66, 82, 89); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[74] || !inputControls.keysAssignedTo[73] || !inputControls.keysAssignedTo[76] || !inputControls.keysAssignedTo[75] ||  !inputControls.keysAssignedTo[190]) ){ assignControls(i, 'keyboard', undefined, 74, 73, 76, 75, 190, 188, 85, 79); };
        player[i].controls(true);
    }
}
function checkIfPlayerInArena (pNum) {
    if ( Math.sqrt(Math.pow(player[pNum].x - centerX, 2) + Math.pow(player[pNum].y - centerY, 2)) > arenaSize/2 && !player[pNum].lose){
        let crowdAh1 = new Audio('./modules/scenes/sumo/sounds/crowdAh1.mp3')
        let crowdAh2 = new Audio('./modules/scenes/sumo/sounds/crowdAh2.mp3')
        let crowdAh = [crowdAh1, crowdAh2];
        crowdAh[Math.floor(Math.random() * 2)].play();
        let fallingSound = new Audio('./modules/scenes/sumo/sounds/fallingSound.mp3')
        fallingSound.play();
        setTimeout(() => {
            let lavaLanding = new Audio('./modules/scenes/sumo/sounds/lavaLanding.mp3');
            lavaLanding.play();
        }, 1189);

        timePassedSincePlayerDied = 0;
        loseMessage = `${player[pNum].name} fell to their doom!`;
        setTimeout(() => { loseMessage = ''}, 4000);
        placeSecond(pNum);
        placeThird(pNum);
        placeFourth(pNum);
        if (playersLeft > 4) { playersLeft.splice(playersLeft.indexOf(player[pNum]), 1); }
        player[pNum].lose = true;
    }
    loseHandler(pNum);
}

function leaderboard () {
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = `${30*resScale(true)}px oswald`;
    c.textAlign = 'left';
    c.fillText('Still Alive', 50*resScale(), 50*resScale(true));
    c.fillRect(50*resScale(), 55*resScale(true), 105*resScale(), 5*resScale(true))
    for (let i = 0; i < playersLeft.length; i++){
        c.fillText(`${playersLeft[i].name}`, 50*resScale(), 100*resScale(true) + 50*resScale(true)*i);
    }
}
function loseHandler (pNum) {
    if (player[pNum].lose) {
        player[pNum].draw();
        if (player[pNum].size > 10){
            player[pNum].size *= 0.97;
            player[pNum].accelRate = 0;
            player[pNum].xSpeed = player[pNum].xSpeed*0.95;
            player[pNum].ySpeed = player[pNum].ySpeed*0.95;
        } else if (player[pNum].size <= 10) {
            player[pNum].xSpeed = .5;
            player[pNum].ySpeed = -.5*9/16;
        }
    }
}
function displayLoseMessage (pNum) {
    c.font = `${100*resScale(true)}px oswald`;
    c.textAlign = 'center';
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillText(loseMessage, centerX, height/10);
}
function placeFourth (pNum) { if (playersLeft.length === 4) { fourthPlace = playersLeft.splice(playersLeft.indexOf(player[pNum]), 1); } }
function placeThird (pNum) { if (playersLeft.length === 3) { thirdPlace = playersLeft.splice(playersLeft.indexOf(player[pNum]), 1); } }
function placeSecond (pNum) { if (playersLeft.length === 2) { secondPlace = playersLeft.splice(playersLeft.indexOf(player[pNum]), 1); } }
function winHandler () {
    if (playersLeft.length === 1){
        timePassedSincePlayerDied = 0;
        firstPlace = playersLeft.slice(0, 1);

        if (loseMessage === '') { loseMessage = `${firstPlace[0].name} wins!` }
        timePassedSincePlayerDied = 0;
        
        setTimeout(() => {
            air.pause();
            bgm.pause();
            clearInterval(loopAirSound);
            endGame = true;
        }, 4000)
    }
}

export function resetGameSumo () {
    gameStart = false;
    endGame = false;
    arenaSize = undefined;
    timePassedSincePlayerDied = 0;

    loseMessage = '';
    playersLeft = undefined;
    firstPlace = undefined;
    secondPlace = undefined;
    thirdPlace = undefined;
    fourthPlace = undefined;

    lavaTextureX = 0;
    lavaTextureY = lavaTextureX * 9/16
}

export function scenePlaySumo () {
    pauseGame([bgm, air]);
    if (!endGame) {
        air.play();
        bgm.play();
        startGame();
        
        renderLava();
        forAllPlayers(checkIfPlayerInArena);
        renderArena();
        renderPlayers();
        shrinkArena();

        displayLoseMessage();
        winHandler();
        leaderboard();
        
    } else {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace)
        bgm.pause();
    }    
}