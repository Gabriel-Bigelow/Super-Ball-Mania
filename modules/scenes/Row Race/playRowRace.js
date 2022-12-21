import { birdAnimation, boatSprite, buttonPic, c, centerX, centerY, height, resScale, rowRaceTrack, splashAnimation, waterTexture, width } from "../../../Main.js";
import { centerRect, dImage, ellipse, image } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { keys } from "../../listeners/keyListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, resizePlayers } from "../../player functions/playerFunctions.js";
import { player, resScalePlayers } from "../../players.js";


let accelRate = 1;
let angleChangeRate = Math.PI/90;
let splashFrame = [];
let angle = [];
let speed = [];
let checkpoint = [];
let highestLTValue = [];
let highestRTValue = [];
let rowDownL = [];
let rowDownR = [];
let rowSound = [];

let gameStarted = false;
let endGame = false;
let startTime;
let raceTime;

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

let playerReady = [];
let controls = [];
let rules1 = 'Players race around an island. Go down the straight, circle around the rock, and complete a lap around the island.';
let rules2 = 'Press LT and/or RT repeatedly to row your boat. Hold LT to turn left. Hold RT to turn right.';
let rules3 = 'Visit "Controls" on the main menu for keyboard controls.'

function pregameScreen (title, rules1, rules2, startGameFunction) {
    c.fillStyle =  'rgb(0, 0, 0)';
    c.fillRect(0, 0, width, height);

    c.textAlign = 'center';
    c.fillStyle = 'rgb(255, 255, 255)';
    for (let i = 0; i < player.length; i++) {
        if (playerReady.length < player.length) {
            playerReady[i] = false;
        }
        /*
        if (playerReady[i]) {
            c.fillText(`P${player[i].pid+1}: ✔`, width/(player.length+1)+ width/(player.length+1)*(i), height*0.95);
        } else {
            c.fillText(`P${player[i].pid+1}: X`, width/(player.length+1)+ width/(player.length+1)*(i), height*0.95);
        }*/

        c.fillText(`Press the A Button or "ENTER" on your keyboard to start the game.`, centerX, height*0.9)
        if (gamepad[0]) {
            if (gamepad[0].buttons[0].pressed) {
                playerReady[i] = true;
            }
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
    if (gameStarted === false){
        playersRacing = player.slice(0, player.length);
        resizePlayers(15);
        numPlayersRacing = player.length;
        for (let i = 0; i < player.length; i++){
            player[i].x = width/10;
            player[i].y = height/15 + 25*resScale(true)*i;
            crash[i] = 0;
            splashFrame[i] = 0;
            angle[i] = 0;
            speed[i] = 0;
            checkpoint[i] = [false, false, 1];

            highestLTValue[i] = 0;
            rowDownL[i] = false;
            highestRTValue[i] = 0;
            rowDownR[i] = false;
            rowSound[i] = [];
            
        }
        for (let i = 0; i < 7; i++){
            rowSound[i] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${i+1}.mp3`);
        }
        startTime = Date.now();
        gameStarted = true;
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
    c.font = `${20*resScale(true)}px oswald`;
    c.textAlign = 'center';
    c.fillStyle = 'rgb(100, 40, 0)';
    c.save();
    c.translate(width*0.85, height*0.23)
    c.rotate(30*(Math.PI/180))
    centerRect((320*resScale())/2, 0, 320*resScale(), 5*resScale(true));
    ellipse(0, 0, 12*resScale(), 'rgb(0, 0, 0)');
    ellipse(320*resScale(), 0, 12*resScale());
    c.fillStyle = checkpoint1Color;
    c.moveTo(105*resScale(), 0);
    c.lineTo(155*resScale(), -50*resScale(true));
    c.lineTo(195*resScale(), 0);
    c.fill();
    ellipse(0, 0, 10*resScale(), 'rgb(255, 255, 255)');
    c.fillText('C1', 150*resScale(), -10*resScale(true));
    ellipse(320*resScale(), 0, 10*resScale());
    c.restore();

    c.save();
    c.translate(width*0.6, height*0.1)
    c.rotate(10*(Math.PI/180))
    centerRect(400*resScale()/2, 0, 400*resScale(), 5*resScale(true));;
    ellipse(0, 0, 12, 'rgb(0, 0, 0)');
    ellipse(400*resScale(), 0, 12*resScale());
    c.fillStyle = checkpoint2Color;
    c.moveTo(150*resScale(), 0);
    c.lineTo(200*resScale(), 50*resScale(true));
    c.lineTo(250*resScale(), 0);
    c.fill();
    ellipse(0, 0, 10*resScale(), 'rgb(255, 255, 255)');
    c.fillText('C2', 200*resScale(), 30*resScale(true));
    ellipse(400*resScale(), 0, 10*resScale());
    c.restore();
    if (checkpoint1Color !== 'rgb(0, 0, 0)'){ setTimeout(() => { checkpoint1Color = 'rgb(0, 0, 0)' }, 1000) }
    if (checkpoint2Color !== 'rgb(0, 0, 0)'){ setTimeout(() => { checkpoint2Color = 'rgb(0, 0, 0)' }, 1000) }
}
function renderFinishLine () {
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillRect(500*resScale(), height*0.005, 100*resScale(), 300*resScale(true));
    c.fillStyle = 'rgb(0, 0, 0)';
    for (let i = 0; i < 6; i++){
        for (let j = 0; j < 4; j++){
            let k = i;
            if (j % 2 !== 0){c.fillRect(500*resScale() + 25*resScale()*j, height*0.005 + 50*resScale(true) * i + 25*resScale(true), 25*resScale(), 25*resScale(true)); }
            else { c.fillRect(500*resScale() + 25*resScale()*j, height*0.005 + 50*resScale(true) * k, 25*resScale(), 25*resScale(true)); }
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
        speed[pNum] = -1;
    }

    for (let i = 0; i < player.length; i++){
        //top sandbar
        if (player[i].y < 30*resScale(true) && player[i].x <= centerX+170*resScale()) {
            player[i].y += 5;
            playerCrash(sandCrashSound, i);
        }
        //top sandbar peninsula
        if (Math.pow((centerX+170*resScale()) - player[i].x, 2) + Math.pow(30*resScale(true) - player[i].y, 2) < Math.pow(90*((resScale()+resScale(true))/2), 2)){
            if (player[i].x <=  centerX + 170*resScale()){
                player[i].x -= 2.5;
                player[i].y += 2.5;
            } else { 
                player[i].x > centerX + 170*resScale()
                player[i].x += 2.5;
                player[i].y += 2.5;
            }
            playerCrash(sandCrashSound, i);
        }

        //top right rock
        if (Math.pow(width*4/5 - player[i].x, 2) + Math.pow(250*resScale(true) - player[i].y, 2) < Math.pow(140*((resScale()+resScale(true))/2), 2)){
            if (player[i].x <=  width*4/5){
                player[i].x -= 2.5;
            } else { 
                player[i].x > width*4/5
                player[i].x += 2.5;
            }
            playerCrash(rockCrashSound, i);
        }

        //right peninsula
        if (player[i].x > width*97.5/100 && player[i].y >= centerY-300*resScale(true) && player[i].y <= centerY - 100*resScale(true)){
            if ( (player[i].x - width*0.975) / (player[i].y - (centerY-100*resScale(true))) <= width*(1-0.975) / -200*resScale() ) {
                player[i].x -= 2;
                player[i].y += 1;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x > width*92.5/100 && player[i].y >= centerY-135*resScale(true)){
            if (Math.sqrt(Math.pow(player[i].x - width*92.5/100, 2) + Math.pow(player[i].y - (centerY-135*resScale(true)),2)) > Math.pow(10*((resScale() + resScale(true))/2 ), 2) && player[i].y < centerY-35*resScale(true)){
                player[i].x -= 2;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x < width*94.5 && player[i].y >= centerY-40*resScale(true)) {
            if (Math.sqrt(Math.pow(width*94.5/100 - player[i].x, 2) + Math.pow(centerY - player[i].y, 2)) < Math.pow(Math.sqrt(40)* ((resScale()+resScale(true))/2), 2) ) {
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x > width*94.5/100 && player[i].y >= centerY+40*resScale(true) && player[i].y <= centerY + 100*resScale(true)){
            if ( (player[i].x - width*0.945) / (player[i].y - (centerY+40*resScale(true))) > width*(1-0.945) / 60*resScale() ) {
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
        if (Math.pow((centerX+150*resScale()) - player[i].x, 2) + Math.pow(height*9/10 - player[i].y, 2) < Math.pow(225*((resScale()+resScale(true))/2), 2)){
            if (player[i].x <=  centerX+150*resScale()) {
                player[i].x -= 2.5;
                player[i].y -= 2.5;
            } else { 
                player[i].x > centerX+150*resScale()
                player[i].x += 2.5;
                player[i].y -= 2.5
            }
            playerCrash(rockCrashSound, i);
        }

        //left sandbar
        if (player[i].x <= 200*resScale() && player[i].y >= 410*resScale(true)){
            if ((player[i].y-430*resScale(true))/(player[i].x) > (30*resScale(true))/(200*resScale()) && player[i].y <= 460*resScale(true)) {
                playerCrash(sandCrashSound, i);
                player[i].y -=2;                
            }
            if (Math.sqrt(Math.pow(player[i].x - 170*resScale(), 2) + Math.pow(player[i].y - 620*resScale(true), 2)) >= 150 && player[i].y > 460*resScale(true) && player[i].y <= 620*resScale(true)){
                player[i].y += 2;
                playerCrash(sandCrashSound, i);
            }
            if (player[i].x <= width/96){
                player[i].x += 2;
                playerCrash(sandCrashSound, i);
            }
        }

        //island top && right
        if (player[i].x >= 320*resScale() && player[i].y >= 290*resScale(true) && player[i].x < 1140*resScale() && player[i].y < 325*resScale(true)){
            if ( (player[i].y - 290*resScale(true))/(player[i].x-320*resScale()) > (35*resScale(true))/(820*resScale())) {
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1140*resScale() && player[i].y >= 325*resScale(true) && player[i].x < 1250*resScale() && player[i].y < 500*resScale(true)){
            if ( (player[i].y - 325*resScale(true))/(player[i].x-1140*resScale()) > (175*resScale(true))/(110*resScale())) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        //split the boundary below into 2 to fix invisible wall intersecting with ellipse on bottom of island DO NOT COMBINE, EVEN THOUGH THE SLOPE IS THE SAME
        if (player[i].x >= 1250*resScale() && player[i].y >= 500*resScale(true) && player[i].x < 1350*resScale() && player[i].y < 550*resScale(true)){
            if ( (player[i].y - 500*resScale(true))/(player[i].x-1250*resScale()) > (50*resScale(true))/(100*resScale())) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1350*resScale() && player[i].y >= 550*resScale(true) && player[i].x < 1450*resScale() && player[i].y < 600*resScale(true)){
            if ( (player[i].y - 550*resScale(true))/(player[i].x-1350*resScale()) > (50*resScale(true))/(100*resScale())) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1450*resScale() && player[i].y >= 600*resScale(true) && player[i].x < 1550*resScale() && player[i].y < 680*resScale(true)){
            if ( (player[i].y - 600*resScale(true))/(player[i].x-1450*resScale()) > (80*resScale(true))/(100*resScale())) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 1550*resScale() && player[i].y >= 680*resScale(true) && player[i].x < 1620*resScale() && player[i].y < 780*resScale(true)){
            if ( (player[i].y - 680*resScale(true))/(player[i].x-1550*resScale()) > (100*resScale(true))/(70*resScale())) {
                player[i].x += 2.5;
                player[i].y -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        //island bottom and left
        if (player[i].x > 1440*resScale() && player[i].y >= 750*resScale(true) && player[i].x <= 1620*resScale() && player[i].y <= 780*resScale(true)){
            player[i].y += 2.5;
            playerCrash(sandCrashSound, i);
        }
        if (player[i].x >= 1308*resScale() && player[i].y >= 612*resScale(true) && player[i].x < 1440*resScale() && player[i].y < 780*resScale(true)){
            if ( (player[i].y - 612*resScale(true))/(player[i].x-1308*resScale()) < (140*resScale(true))/(110*resScale())) {
                player[i].x -= 2.5;
                player[i].y += 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 720*resScale() && player[i].y > 550*resScale(true) && player[i].x < 1400*resScale() && player[i].y < 780*resScale(true)){
            if (Math.sqrt(Math.pow(player[i].x - (centerX+(150*resScale())), 2) + Math.pow(player[i].y - 1050*resScale(true), 2)) > 475*resScale(true)){
                player[i].y += 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x > 490*resScale() && player[i].y <= 780*resScale(true) && player[i].x < 720*resScale() && player[i].y > 770*resScale(true)){
            player[i].y += 2.5;
            playerCrash(sandCrashSound, i);
        }
        if (player[i].x >= 300*resScale() && player[i].y >= 640*resScale(true) && player[i].x < 490*resScale() && player[i].y < 780*resScale(true)){
            if ( (player[i].y - 640*resScale(true))/(player[i].x-300*resScale()) < (140*resScale(true))/(190*resScale())) {
                player[i].x -= 2.5;
                player[i].y += 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
        if (player[i].x >= 300*resScale() && player[i].y > 290*resScale(true) && player[i].x < 495*resScale() && player[i].y < 650*resScale(true)){
            if (Math.sqrt(Math.pow(player[i].x - 330*resScale(), 2) + Math.pow(player[i].y - 470*resScale(true), 2)) > Math.pow(Math.sqrt(165)*((resScale()+resScale(true))/2), 2)){
                player[i].x -= 2.5;
                playerCrash(sandCrashSound, i);
            }
        }
    }
}
function checkpointPassedCheck() {
    for (let i = 0; i < player.length; i++){
        if (player[i].x > width*0.85 && player[i].y > height*0.23 && player[i].y < height*0.23 + 160*resScale(true)){
            if ((player[i].x- width*0.85)/(player[i].y - height*0.23) >= (width-width*0.85)/(160*resScale(true)) && !checkpoint[i][0]) {
                let soundCheckpoint = new Audio ('./sounds/menu/save.mp3');
                soundCheckpoint.play();
                checkpoint1Color = player[i].clr;
                checkpoint[i][0] = true;
            }
        }
        if (player[i].x >= width*0.6 && player[i].y > height*0.1 && player[i].x < width*0.85 && player[i].y < height*0.1 + 70*resScale(true)){
            if ((player[i].x-width*0.6)/(player[i].y-height*0.1) >= (width*0.6-width*0.85)/(70*resScale(true)) && !checkpoint[i][1] && checkpoint[i][0]) {
                let soundCheckpoint = new Audio ('./sounds/menu/save.mp3');
                soundCheckpoint.play();
                checkpoint2Color = player[i].clr;
                checkpoint[i][1] = true;
            }
        }
        if (player[i].x >= 500*resScale() && player[i].y > height*0.005 && player[i].x < 600*resScale() && player[i].y < height*0.005 + 300*resScale(true) && checkpoint[i][0] && checkpoint[i][1]){
            checkpoint[i][2] += 1;
            let soundCheckpoint = new Audio ('./sounds/menu/save.mp3');
            soundCheckpoint.play();
            checkpoint[i][0] = false;
            checkpoint[i][1] = false;
        }
        if (checkpoint[i][2] === 4) { 
            checkpoint[i][2] = `${raceTime} seconds`;
            if (!firstPlace) { firstPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
            else if (firstPlace && !secondPlace) { secondPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
            else if (firstPlace && secondPlace && !thirdPlace) { thirdPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
            else if (firstPlace && secondPlace && thirdPlace && !fourthPlace) { fourthPlace = playersRacing.splice(playersRacing.indexOf(player[i]), 1); numPlayersRacing-- }
        }
    }
}
function leaderboard () {
    c.globalAlpha = '0.5';
    c.fillStyle = 'rgb(105, 105, 105)';
    c.fillRect(width*0.3, height*0.30, width*0.25, height*0.23);
    c.globalAlpha = '1';

    raceTime = (Date.now() - startTime)/1000;
    c.font = `${20*resScale(true)}px oswald`;
    c.textAlign = 'left';
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillText(`${raceTime.toFixed(2)}`, width*0.51, height*0.435);

    let j = 0;
    for (let i = -player.length/2; i < player.length/2; i++){
        c.fillStyle = player[j].clr;
        if (typeof checkpoint[j][2] === 'number') { c.fillText(`${player[j].name}: Lap ${checkpoint[j][2]}/3`, width*0.31, height*0.435 + 30*i); } 
        else { c.fillText(`${player[j].name}: ${checkpoint[j][2]}`, width*0.31, height*0.435 + 30*i); }
        finishRace(j);
        j += 1;
    }
}
function finishRace (pNum) {
    for (let i = 0; i < player.length; i++) {
        if (checkpoint[pNum][2][checkpoint[pNum][2].length-1] === 's') {
            player[pNum].x = width*0.3 + width*.2*pNum/(player.length-1)
            player[pNum].y = height*0.33;
            speed[pNum] = 0;
        }
    }
    if (numPlayersRacing === 1 || fourthPlace) { 
        setTimeout (() => { 
            if (!secondPlace) { secondPlace = playersRacing.splice(0, 1); numPlayersRacing-- }
            else if (!thirdPlace) { thirdPlace = playersRacing.splice(0, 1); numPlayersRacing--}
            else if (!fourthPlace) { fourthPlace = playersRacing.splice(0, 1); numPlayersRacing--}
            endGame = true; 
            bgm.pause(); 
            waves.pause(); 
        }, 2000 )
    }
}

function renderPlayers () {
    for (let i = 0; i < player.length; i++) {
        if (!player[i].lose){
            drawPlayers(i);
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
        boatControls(i);
    }
}
function bobWithWaves (pNum) {
    if (swayWavesRight > 0) { player[pNum].y += -0.0002*t*t + 0.02*t; }
    if (swayWavesRight < 0) { player[pNum].y += 0.0002*t*t - 0.02*t; } 
}

function boatControls (pNum) {
    if (player[pNum].controllerType === 'keyboard'){
        player[pNum].keyControlsListener();
        momentum(pNum);

        if (player[pNum].fakeLT) {
            rowDownL[pNum] = true;
            angle[pNum] -= angleChangeRate;
        } else {
            if (rowDownL[pNum]) {
                let randomSound = Math.floor(Math.random() * rowSound.length);
                rowSound[randomSound].play();
                rowSound[randomSound] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${randomSound+1}.mp3`);
                speed[pNum] += accelRate*Math.max(0.85, Math.random());
                rowDownL[pNum] = false;
            }
        }
        if (player[pNum].fakeRT) {
            rowDownR[pNum] = true;
            angle[pNum] += angleChangeRate;
        } else {
            if (rowDownR[pNum]) {
                let randomSound = Math.floor(Math.random() * rowSound.length);
                rowSound[randomSound].play();
                rowSound[randomSound] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${randomSound+1}.mp3`);
                speed[pNum] += accelRate*Math.max(0.85, Math.random());
                rowDownR[pNum] = false;
            }
        }
    } else if (player[pNum].controllerType === 'gamepad'){
        player[pNum].gamepadControlsListener();
        momentum(pNum);

        if (player[pNum].leftTrigger > 0) {
            if (player[pNum].leftTrigger > highestLTValue[pNum]) { 
                highestLTValue[pNum] = player[pNum].leftTrigger;
            }
            if (highestLTValue[pNum] >= 0.8) {
                rowDownL[pNum] = true;
            }
            angle[pNum] -= angleChangeRate;
        }
        if (rowDownL[pNum] && player[pNum].leftTrigger < 0.1) { 
            speed[pNum] += accelRate*highestLTValue[pNum];
            highestLTValue[pNum] = 0;

            let randomSound = Math.floor(Math.random() * rowSound.length);
            rowSound[randomSound].play();
            rowSound[randomSound] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${randomSound+1}.mp3`);
            rowDownL[pNum] = false;
        }
        if (player[pNum].rightTrigger > 0 ) {
            if (player[pNum].rightTrigger > highestRTValue[pNum]) { 
                highestRTValue[pNum] = player[pNum].rightTrigger;
            }
            if (highestRTValue[pNum] >= 0.8) {
                rowDownR[pNum] = true;
            }            
            angle[pNum] += angleChangeRate;
        }
        if (rowDownR[pNum] && player[pNum].rightTrigger < 0.1) { 
            speed[pNum] += accelRate*highestRTValue[pNum];
            highestRTValue[pNum] = 0;

            let randomSound = Math.floor(Math.random() * rowSound.length);
            rowSound[randomSound].play();
            rowSound[randomSound] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${randomSound+1}.mp3`);
            rowDownR[pNum] = false;
        }
    }
}


function momentum (pNum) {
    player[pNum].x += translateSpeedToXSpeed(pNum);
    player[pNum].y += translateSpeedToYSpeed(pNum);
    if (speed[pNum] > 0) { speed[pNum] -= 0.1 }
    if (speed[pNum] < 0) { speed[pNum] += 0.01 }
    if ( Math.abs(speed[pNum]) < 0.01 ) { speed[pNum] = 0 };

    if (player[pNum].xSpeed > 0) { player[pNum].xSpeed -= 0.3 }
    if (player[pNum].xSpeed < 0) { player[pNum].ySpeed += 0.3 }
    if ( Math.abs(player[pNum].xSpeed) < 0.5 && player[pNum].xSpeed > -0.5 ) { player[pNum].xSpeed = 0 };
    if (player[pNum].ySpeed > 0) { player[pNum].ySpeed -= 0.3 }
    if (player[pNum].ySpeed < 0) { player[pNum].ySpeed += 0.3 }
    if ( Math.abs(player[pNum].ySpeed) < 0.5 && player[pNum].ySpeed > -0.5 ) { player[pNum].ySpeed = 0 };
    player[pNum].x += player[pNum].xSpeed;
    player[pNum].y += player[pNum].ySpeed;
}
function translateSpeedToXSpeed (pNum) {
    return Math.cos(angle[pNum]) * speed[pNum]; 
}

function translateSpeedToYSpeed (pNum) {
    return Math.sin(angle[pNum]) * speed[pNum];
}

function animateSplash (pNum) {
    image(splashAnimation[splashFrame[pNum].toFixed(0)], 0, 0, player[pNum].size/100*3.2, player[pNum].size/100*1.2);
    splashFrame[pNum] += 0.2;
    if (splashFrame[pNum] > 26) { splashFrame[pNum] = 0; }
}

function drawPlayers (pNum) {
    c.save();
    c.translate(player[pNum].x, player[pNum].y)
    c.rotate(angle[pNum]);
    animateSplash(pNum)
    image(boatSprite, 0, 0, player[pNum].size/100, player[pNum].size/100)
    c.restore();
    player[pNum].draw();
}


export function resetGameRowRace () {
    if (gameStarted) {
        bgm = new Audio('./modules/scenes/Row Race/sounds/Nauticalities.mp3')
        gameStarted = false;
        endGame = false;
        startTime = undefined;
        raceTime = undefined;
    
        checkpoint1Color = 'rgb(0, 0, 0)';
        checkpoint2Color = 'rgb(0, 0, 0)';
    
        playersRacing = undefined;
        firstPlace = undefined;
        secondPlace = undefined;
        thirdPlace = undefined;
        fourthPlace = undefined;
        numPlayersRacing = undefined;
    
        playerReady = [];
        controls = [];
        crash = [];
        waterTextureX = 0;
        waterTextureY = 0;
    
        t = 0
        swayWavesRight = 1
    
        for (let i = 0; i < player.length; i++) {
            checkpoint[i][0] = false;
            checkpoint[i][1] = false;
            checkpoint[i][2] = 1;
            speed[i] = 0;
            angle[i] = 0;
        }
    }
}

export function scenePlayRowRace () {
    pauseGame([bgm, waves, gull]);
    if (!gameStarted) {
        controls = [buttonPic[6], buttonPic[7]]
        pregameScreen('Row Race', rules1, rules2, startGame)
    }
    if (!endGame && gameStarted){
        bgm.play();
        waves.play()
        c.fillStyle = 'rgb(50, 186, 255)';
        c.fillRect(0, 0, width, height);

        renderWater();
        dImage(rowRaceTrack, 0, 0, resScale(), resScale(true));
        renderFinishLine();
        renderPlayers();
        renderCheckpoints();
        renderBird();
        checkpointPassedCheck();
        wallCollisionCheck();
        leaderboard();
    } else if (endGame) {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace)
    }
}