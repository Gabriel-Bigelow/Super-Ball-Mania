import { birdAnimation, c, centerX, centerY, height, rowRaceTrack, waterTexture, width } from "../../../Main.js";
import { centerRect, ellipse, image } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { keys } from "../../listeners/keyListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, resizePlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";



let gameStart = false;
let endGame = false;

let bgm = new Audio('./modules/scenes/Row Race/sounds/Nauticalities.mp3')
let waves = new Audio('./modules/scenes/Row Race/sounds/waves.mp3')
let gull = new Audio('./modules/scenes/Row Race/sounds/gull.mp3')
let checkpoint1Color = 'rgb(0, 0, 0)';
let checkpoint2Color = 'rgb(0, 0, 0)';

let playersRacing;
let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;
let numPlayersRacing;

class Bird {
    constructor() {
        this.speed = Math.max(Math.random()*5, 2);
        this.angle = Math.random()*Math.PI*2;
        if (Math.cos(this.angle) * this.speed < 0) { this.x = width*1.01} else {
            this.x = -10
        }
        if (Math.sin(this.angle) * this.speed < 0) { this.y = height*1.01} else {
            this.y = -10
        }
        this.animationFrame = 0;
    }
    draw () {
        this.animationFrame += 0.1
        if (this.animationFrame >= 7) { this.animationFrame = 0 }
        c.save()
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        image(birdAnimation[this.animationFrame.toFixed(0)], 0, 0, 0.3, 0.3)
        c.restore();
        this.momentum();
    }

    momentum () {
        this.x += this.translateSpeedToXSpeed();
        this.y += this.translateSpeedToYSpeed();
    }
    translateSpeedToXSpeed () {
        return Math.cos(this.angle) * this.speed; 
    }
    translateSpeedToYSpeed () {
        return Math.sin(this.angle) * this.speed;
    }
}
let birds = []

function startGame () {
    if (gameStart === false){
        playersRacing = player.slice(0, player.length);
        resizePlayers(15);
        numPlayersRacing = player.length;
        for (let i = 0; i < player.length; i++){
            player[i].x = width/10;
            player[i].y = height*0.4/player.length + 25*i;
            crash[i] = 0;
        }
        gameStart = true;
    }
};


let waterTextureX = 0;
let waterTextureY = 0;

let t = 0
let swayWavesRight = 1
function renderWater () {
    for (let i = 0; i < 4; i++){
        for (let j = -1; j < 2; j++){
            c.drawImage(waterTexture, waterTextureX+800*i, waterTextureY+800*j);
        }
    }
    waterTextureX -= 0.5;
    waterTextureX %= 800
    if (swayWavesRight > 0) { waterTextureY = -0.005*t*t + 0.5*t; }
    if (swayWavesRight < 0) { waterTextureY = 0.005*t*t - 0.5*t; } 
    
    t++;
    if (t%100 === 0) {
        swayWavesRight *= -1;
        t=0;
    }
}
function renderCheckpoints () {
    c.font = '20px oswald';
    c.fillStyle = 'rgb(100, 40, 0)';
    c.save();
    c.translate(width*0.85, height*0.23)
    c.rotate(30*(Math.PI/180))
    centerRect(320/2, 0, 320, 5);
    ellipse(0, 0, 12, 'rgb(0, 0, 0)');
    ellipse(320, 0, 12);
    c.fillStyle = checkpoint1Color;
    c.moveTo(105, 0);
    c.lineTo(155, -50);
    c.lineTo(195, 0);
    c.fill();
    ellipse(0, 0, 10, 'rgb(255, 255, 255)');
    c.fillText('C1', 150, -10);
    ellipse(320, 0, 10);
    c.restore();

    c.save();
    c.translate(width*0.6, height*0.1)
    c.rotate(10*(Math.PI/180))
    centerRect(400/2, 0, 400, 5);;
    ellipse(0, 0, 12, 'rgb(0, 0, 0)');
    ellipse(400, 0, 12);
    c.fillStyle = checkpoint2Color;
    c.moveTo(150, 0);
    c.lineTo(200, 50);
    c.lineTo(250, 0);
    c.fill();
    ellipse(0, 0, 10, 'rgb(255, 255, 255)');
    c.fillText('C2', 200, 30);
    ellipse(400, 0, 10);
    c.restore();
    if (checkpoint1Color !== 'rgb(0, 0, 0)'){ setTimeout(() => { checkpoint1Color = 'rgb(0, 0, 0)' }, 1000) }
    if (checkpoint2Color !== 'rgb(0, 0, 0)'){ setTimeout(() => { checkpoint2Color = 'rgb(0, 0, 0)' }, 1000) }
}
function renderFinishLine () {
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillRect(500, height*0.005, 100, 300);
    c.fillStyle = 'rgb(0, 0, 0)';
    for (let i = 0; i < 6; i++){
        for (let j = 0; j < 4; j++){
            let k = i;
            if (j % 2 !== 0){c.fillRect(500 + 25*j, height*0.005 + 50 * i + 25, 25, 25); }
            else { c.fillRect(500 + 25*j, height*0.005 + 50 * k, 25, 25); }
        }
    }
}
function renderBird () {
    for (let i = 0; i < birds.length; i++){
        birds[i].draw();
        if (birds[i].x < -100 || birds[i].x > width*1.1 || birds[i].y < -100 || birds[i].y > height*1.1) {birds.splice(i, 1); i--;}
    }
    let interval = Math.floor(Math.random() * 1000);
    if (interval === 10){
        birds.push(new Bird());
        if (Math.floor(Math.random() * 3) === 2) { setTimeout(() => { gull.play(); }, Math.floor(Math.random()*300)); };    
    }
}

let crash = [];
function wallCollisionCheck () {
    let rockCrashSound = `./modules/scenes/Row Race/sounds/crash/boatCrashOnRocks.mp3`;
    let sandCrashSound = './modules/scenes/Row Race/sounds/crash/boatCrashOnSand.mp3';

    function playerCrash (source, pNum){
        if (crash[pNum] === 0){
            let crashSound = new Audio(source)
            crashSound.play()
            crash[pNum] += 1;
            setTimeout(() => {
                crash[pNum] = 0;
            }, 1000);
        }
        player[pNum].rrp.speed = -1;
    }

    for (let i = 0; i < player.length; i++){
        //top sandbar
        if (player[i].y < 30 && player[i].x <= centerX+170) {
            player[i].y += 5;
            playerCrash(sandCrashSound, i);
        }
        //top sandbar peninsula
        if (Math.pow((centerX+170) - player[i].x, 2) + Math.pow(30 - player[i].y, 2) < Math.pow(90, 2)){
            if (player[i].x <=  centerX + 170){
                player[i].x -= 2.5;
                player[i].y += 2.5;
            } else { 
                player[i].x > centerX + 170
                player[i].x += 2.5;
                player[i].y += 2.5;
            }
            playerCrash(sandCrashSound, i);
        }

        //top right rock
        if (Math.pow(width*4/5 - player[i].x, 2) + Math.pow(250 - player[i].y, 2) < Math.pow(140, 2)){
            if (player[i].x <=  width*4/5){
                player[i].x -= 2.5;
            } else { 
                player[i].x > width*4/5
                player[i].x += 2.5;
            }
            playerCrash(rockCrashSound, i)
        }

        //right peninsula
        if (player[i].x > width*97.5/100 && player[i].y >= centerY-300 && player[i].y <= centerY - 100){
            if ( (player[i].x - width*0.975) / (player[i].y - (centerY-100)) <= width*(1-0.975) / -200 ) {
                player[i].x -= 2;
                player[i].y += 1;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x > width*92.5/100 && player[i].y >= centerY-135){
            if (Math.sqrt(Math.pow(player[i].x - width*92.5/100, 2) + Math.pow(player[i].y - (centerY-135),2)) > 100 && player[i].y < centerY-35){
                player[i].x -= 2;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x < width*94.5 && player[i].y >= centerY-40) {
            if (Math.sqrt(Math.pow(width*94.5/100 - player[i].x, 2) + Math.pow(centerY - player[i].y, 2)) < 40) {
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x > width*94.5/100 && player[i].y >= centerY+40 && player[i].y <= centerY + 100){
            if ( (player[i].x - width*0.945) / (player[i].y - (centerY+40)) > width*(1-0.945) / 60 ) {
                player[i].x -= 2;
                player[i].y += 1;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x > width*0.995 && player[i].y > centerY && player[i].y < centerY*1.45){
            player[i].x -= 2;
            playerCrash(sandCrashSound, i);
        }

        //bottom sandbar
        if (player[i].y > height*0.93){
            player[i].y -= 2;
            playerCrash(sandCrashSound, i)
        }
        //bottom rock
        if (Math.pow((centerX+150) - player[i].x, 2) + Math.pow(height*9/10 - player[i].y, 2) < Math.pow(225, 2)){
            if (player[i].x <=  centerX+150){
                player[i].x -= 2.5;
                player[i].y -= 2.5;
            } else { 
                player[i].x > centerX+150
                player[i].x += 2.5;
                player[i].y -= 2.5
            }
            playerCrash(rockCrashSound, i);
        }

        //left sandbar
        if (player[i].x <= 200 && player[i].y >= 410){
            if ((player[i].y-430)/(player[i].x) > 30/200 && player[i].y <= 460) {
                playerCrash(sandCrashSound, i);
                player[i].y -=2;                
            }
            if (Math.sqrt(Math.pow(player[i].x - 170, 2) + Math.pow(player[i].y - 620,2)) >= 150 && player[i].y > 460 && player[i].y <= 620){
                player[i].y += 2;
                playerCrash(sandCrashSound, i);
            }
            if (player[i].x <= width/96){
                player[i].x += 2;
                playerCrash(sandCrashSound, i);
            }
        }

        //island top && right
        if (player[i].x >= 320 && player[i].y >= 290 && player[i].x < 1140 && player[i].y < 325){
            if ( (player[i].y - 290)/(player[i].x-320) > 35/820) {
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1140 && player[i].y >= 325 && player[i].x < 1250 && player[i].y < 500){
            if ( (player[i].y - 325)/(player[i].x-1140) > 175/110) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        //split the boundary below into 2 to fix invisible wall intersecting with ellipse on bottom of island DO NOT COMBINE, EVEN THOUGH THE SLOPE IS THE SAME
        if (player[i].x >= 1250 && player[i].y >= 500 && player[i].x < 1350 && player[i].y < 550){
            if ( (player[i].y - 500)/(player[i].x-1250) > 50/100) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1350 && player[i].y >= 550 && player[i].x < 1450 && player[i].y < 600){
            if ( (player[i].y - 550)/(player[i].x-1350) > 50/100) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1450 && player[i].y >= 600 && player[i].x < 1550 && player[i].y < 680){
            if ( (player[i].y - 600)/(player[i].x-1450) > 80/100) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1550 && player[i].y >= 680 && player[i].x < 1620 && player[i].y < 780){
            if ( (player[i].y - 680)/(player[i].x-1550) > 100/70) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        //island bottom and left
        if (player[i].x > 1440 && player[i].y >= 750 && player[i].x <= 1620 && player[i].y <= 780){
            player[i].y += 2.5;
            playerCrash(sandCrashSound, i);
        }
        if (player[i].x >= 1308 && player[i].y >= 612 && player[i].x < 1440 && player[i].y < 780){
            if ( (player[i].y - 612)/(player[i].x-1308) < 140/110) {
                player[i].x -= 2.5;
                player[i].y += 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 720 && player[i].y > 550 && player[i].x < 1400 && player[i].y < 780){
            if (Math.sqrt(Math.pow(player[i].x - (centerX+150), 2) + Math.pow(player[i].y - 1050, 2)) > 475){
                player[i].y += 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x > 490 && player[i].y <= 780 && player[i].x < 720 && player[i].y > 770){
            player[i].y += 2.5;
            playerCrash(sandCrashSound, i);
        }
        if (player[i].x >= 300 && player[i].y >= 640 && player[i].x < 490 && player[i].y < 780){
            if ( (player[i].y - 640)/(player[i].x-300) < 140/190) {
                player[i].x -= 2.5;
                player[i].y += 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 300 && player[i].y > 290 && player[i].x < 495 && player[i].y < 650){
            if (Math.sqrt(Math.pow(player[i].x - 330, 2) + Math.pow(player[i].y - 470, 2)) > 165){
                player[i].x -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
    }
}
function checkpointPassedCheck() {
    for (let i = 0; i < player.length; i++){
        if (player[i].x > width*0.85 && player[i].y > height*0.23 && player[i].y < height*0.23 + 160){
            if ((player[i].x- width*0.85)/(player[i].y - height*0.23) >= (width-width*0.85)/160 && !player[i].rrp.checkpoint[0]) {
                let soundCheckpoint = new Audio ('./sounds/menu/save.mp3');
                soundCheckpoint.play();
                checkpoint1Color = player[i].clr;
                player[i].rrp.checkpoint[0] = true;
            }
        }
        if (player[i].x >= width*0.6 && player[i].y > height*0.1 && player[i].x < width*0.85 && player[i].y < height*0.1 + 70){
            if ((player[i].x-width*0.6)/(player[i].y-height*0.1) >= (width*0.6-width*0.85)/70 && !player[i].rrp.checkpoint[1] && player[i].rrp.checkpoint[0]) {
                let soundCheckpoint = new Audio ('./sounds/menu/save.mp3');
                soundCheckpoint.play();
                checkpoint2Color = player[i].clr;
                player[i].rrp.checkpoint[1] = true;
            }
        }
        if (player[i].x >= 500 && player[i].y > height*0.005 && player[i].x < 600 && player[i].y < height*0.005 + 300 && player[i].rrp.checkpoint[0] && player[i].rrp.checkpoint[1]){
            player[i].rrp.checkpoint[2] += 1;
            let soundCheckpoint = new Audio ('./sounds/menu/save.mp3');
            soundCheckpoint.play();
            player[i].rrp.checkpoint[0] = false;
            player[i].rrp.checkpoint[1] = false;
        }
        if (player[i].rrp.checkpoint[2] === 5) { 
            player[i].rrp.checkpoint[2] = 'Finished';
            if (!firstPlace) { firstPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
            else if (firstPlace && !secondPlace) { secondPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
            else if (firstPlace && secondPlace && !thirdPlace) { thirdPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
            else if (firstPlace && secondPlace && thirdPlace && !fourthPlace) { fourthPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
        }
    }
}
function leaderboard () {
    c.font = '20px oswald';
    c.textAlign = 'center'
    c.globalAlpha = '0.5';
    c.fillStyle = 'rgb(105, 105, 105)';
    c.fillRect(width*0.3, height*0.33, width*0.2, height*0.2);
    c.globalAlpha = '1';
    let j = 0;
    for (let i = -player.length/2; i < player.length/2; i++){
        c.fillStyle = player[j].clr;
        if (typeof player[j].rrp.checkpoint[2] === 'number') { c.fillText(`${player[j].name}: Lap ${player[j].rrp.checkpoint[2]}/4`, width*0.4, height*0.45 + 30*i); } 
        else { c.fillText(`${player[j].name}: ${player[j].rrp.checkpoint[2]}`, width*0.4, height*0.45 + 30*i); }
        finishRace(j);
        j += 1;
    }
}
function finishRace (pNum) {
    for (let i = 0; i < player.length; i++) {
        if (player[pNum].rrp.checkpoint[2] === 'Finished') {
            player[pNum].x = width*0.3 + width*.2*pNum/(player.length-1)
            player[pNum].y = height*0.33;
            player[pNum].rrp.speed = 0;
        }
    }
    if (numPlayersRacing === 0 || fourthPlace) { setTimeout (() => { endGame = true; bgm.pause(); waves.pause(); }, 2000 )}
}

function renderPlayers () {
    for (let i = 0; i < player.length; i++) {
        if (!player[i].lose){
            player[i].rrp.draw();
            player[i].checkForWallCollision();
            bobWithWaves(i)
        }
        //assigns default gamepad controllers to the first 4 players without controls defined, then gives keyboard controls to the next 4 players without controls defined
        for (let j = 0; j < gamepad.length; j++){
            if (!player[i].controllerType && (!inputControls.controllerAssignedTo[j] && inputControls.controllerAssignedTo[j] !== 0)){
                assignControls(i, 'gamepad', j, undefined, undefined, undefined, undefined, undefined);
                inputControls.controllerAssignedTo[j] = i;
            }
        }
        if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[37] || !inputControls.keysAssignedTo[38] || !inputControls.keysAssignedTo[39] || !inputControls.keysAssignedTo[40] ||  !inputControls.keysAssignedTo[16]) ) { assignControls(i, 'keyboard', undefined, 37, 38, 39, 40, 16, 13, 46, 34); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[65] || !inputControls.keysAssignedTo[87] || !inputControls.keysAssignedTo[68] || !inputControls.keysAssignedTo[83] ||  !inputControls.keysAssignedTo[67]) ){ assignControls(i, 'keyboard', undefined, 65, 87, 68, 83, 67, 88, 81, 69); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[70] || !inputControls.keysAssignedTo[84] || !inputControls.keysAssignedTo[72] || !inputControls.keysAssignedTo[71] ||  !inputControls.keysAssignedTo[78]) ){ assignControls(i, 'keyboard', undefined, 70, 84, 72, 71, 78, 66, 82, 89); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[74] || !inputControls.keysAssignedTo[73] || !inputControls.keysAssignedTo[76] || !inputControls.keysAssignedTo[75] ||  !inputControls.keysAssignedTo[190]) ){ assignControls(i, 'keyboard', undefined, 74, 73, 76, 75, 190, 188, 85, 79); };
        player[i].boatControls();
    }
}
function bobWithWaves (pNum) {
    if (swayWavesRight > 0) { player[pNum].y += -0.0002*t*t + 0.02*t; }
    if (swayWavesRight < 0) { player[pNum].y += 0.0002*t*t - 0.02*t; } 
}

export function scenePlayRowRace () {
    pauseGame([bgm, waves, gull]);
    startGame();
    if (!endGame){
        bgm.play();
        waves.play()
        c.fillStyle = 'rgb(0, 0, 0)';
        c.fillRect(0, 0, width, height);

        renderWater();
        c.drawImage(rowRaceTrack, 0, 0);
        renderFinishLine();
        renderPlayers();
        renderCheckpoints();
        renderBird();
        checkpointPassedCheck();
        wallCollisionCheck();
        leaderboard();
    } else {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace)
    }
}