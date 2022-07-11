import { c, centerX, centerY, golfBallTextureW, golfBallTextureB, height, width, grassTexture, cup, flag, woodTexture } from "../../../Main.js";
import { colorChanger } from "../../colors.js";
import { image } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, forAllPlayers, resizePlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";
import { renderBackground } from "../background/background.js";

let bgm = new Audio('./modules/scenes/Ballf With Your Friends/sounds/Carnival Fun.mp3')

let gameStart = false;
let endGame = false;
let course = [];
let hole = 0;

let finishedMessage = '';
let playersLeft;
let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;


function startGame () {
    if (gameStart === false){  
        resizePlayers(15);
        playersLeft = player.slice(0, player.length);
        createHoles();
        for (let i = 0; i < player.length; i++){
            player[i].x = centerX + player[i].size*2 *(i-player.length/2);
            player[i].y = height*0.9;
            player[i].accelRate = 0.1


            golfTexturePosition[i] = {x: player[i].x - player[i].size, y: player[i].y - player[i].size}
            inHole[i] = false;
            inHoleSound[i] = new Audio('./modules/scenes/Ballf With Your Friends/sounds/inHole.mp3')
            power[i] = 10;
            angle[i] = 0;
            strokes[i] = 0;
        }
        playersLeft = player.slice(0, player.length);
        gameStart = true;
    }
};

function renderPlayers() {
    for (let i = 0; i < player.length; i++) {
        if (!inHole[i]) {
            player[i].draw();
            player[i].checkForWallCollision();
            if (Math.pow(cupPos.x - player[i].x, 2) + Math.pow(cupPos.y - player[i].y, 2) >= Math.pow(player[i].size, 2)) {
                renderShotLine(i);
                playerControlsListener(i);
            }
            player[i].momentum();
            player[i].resetAccelX();
            player[i].resetAccelY();     
        }

        for (let j = i; j < player.length; j++){
            if ( j !== i ){
                player[i].checkForPlayerCollision(j);
            }    
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
    }
};

let golfTexturePosition = [];
function renderGolfBallTexture (pNum) {
    c.save();
    c.beginPath();
    c.arc(player[pNum].x - player[pNum].xSpeed*2, player[pNum].y-player[pNum].ySpeed*2, player[pNum].size/2, 0, Math.PI*2);
    c.closePath();
    c.clip()
    for (let i = -2; i < 2; i++) {
        for (let j = -2; j < 2; j++) {
            if (colorChanger(player[pNum].clr, 0, 0, 0, false, true) > 180){
                image(golfBallTextureB, golfTexturePosition[pNum].x+50*i, golfTexturePosition[pNum].y+50*j, 0.5, 0.5);
            } else { 
                image(golfBallTextureW, golfTexturePosition[pNum].x+50*i, golfTexturePosition[pNum].y+50*j, 0.5, 0.5);
            }
            if (golfTexturePosition[pNum].x + 50 < player[pNum].x || golfTexturePosition[pNum].x - 50 > player[pNum].x || golfTexturePosition[pNum].y + 50 < player[pNum].y || golfTexturePosition[pNum].y - 50 > player[pNum].y) {
                golfTexturePosition[pNum] = {x: player[pNum].x, y: player[pNum].y }
            }
        }
    }
    golfTexturePosition[pNum].x += player[pNum].xSpeed*Math.PI;
    golfTexturePosition[pNum].y += player[pNum].ySpeed*Math.PI;
    c.restore();
}

let power = [];
let angle = [];
function renderShotLine (pNum) {
    if (player[pNum].xSpeed === 0 && player[pNum].ySpeed === 0) {
        c.save();
        c.strokeStyle = player[pNum].clr
        c.lineWidth = 2;
        c.translate(player[pNum].x, player[pNum].y);
        c.rotate(angle[pNum]);
        c.beginPath();
        c.moveTo(0, 0)
        c.lineTo(player[pNum].size/2 + power[pNum]*2.5, 0);
        c.stroke();
        c.restore();
    }

}

let hitButtonHeld = [];

function playerControlsListener(pNum) {
    if (player[pNum].controllerType === 'keyboard'){
        player[pNum].keyControlsListener();
        player[pNum].momentum();
        if (player[pNum].action) {
            hitButtonHeld[pNum]++;
        } else {
            hitButtonHeld[pNum] = 0;
        }

        if(power[pNum] < 100 && player[pNum].up) {
            power[pNum]++;
        }
        if(power[pNum] > 0 && player[pNum].down) {
            power[pNum]--;
        }
        
    } else if (player[pNum].controllerType === 'gamepad'){
        player[pNum].gamepadControlsListener();
        player[pNum].momentum();
        if (player[pNum].buttonA) {
            hitButtonHeld[pNum]++;
        } else {
            hitButtonHeld[pNum] = 0;
        }

        if (power[pNum] < 100 && player[pNum].up < -0.8) {
            power[pNum] += 1;
        }
        if (power[pNum] > 0 && player[pNum].up > 0.8) {
            power[pNum] -= 1;
        }        
    }

    changeAngle(pNum);
    hitBall(pNum);
}

function changeAngle(pNum) {
    if ((player[pNum].right || player[pNum].fakeRT) && player[pNum].controllerType === 'keyboard') {
        angle[pNum] += (Math.PI/180)
    }
    if ((player[pNum].left || player[pNum].fakeLT) && player[pNum].controllerType === 'keyboard') {
        angle[pNum] -= (Math.PI/180)
    }

    if (player[pNum].rightTrigger && player[pNum].controllerType === 'gamepad') {
        angle[pNum] += (Math.PI/180)
    }
    if (player[pNum].leftTrigger && player[pNum].controllerType === 'gamepad') {
        angle[pNum] -= (Math.PI/180)
    }
}

let strokes = [];
function hitBall (pNum) {
    if (hitButtonHeld[pNum] === 1 && player[pNum].xSpeed === 0 && player[pNum].ySpeed === 0) {
        strokes[pNum]++
        player[pNum].xSpeed = (power[pNum] * 0.2) * Math.cos(angle[pNum])
        player[pNum].ySpeed = (power[pNum] * 0.2) * Math.sin(angle[pNum])
        let soundSwing = new Audio('./modules/scenes/Ballf With Your Friends/sounds/swing.mp3')
        soundSwing.play();
    }
}



let cupPos = {x: 0, y: 0};
let inHole = [];
let inHoleSound = [];
let playersPlaced = false;
let playerSpawn;
function renderArena () {
    course[hole]();

    if (!playersPlaced) { 
        for (let i = 0; i < player.length; i++) {
            player[i].x = playerSpawn.x;
            player[i].y = playerSpawn.y + player[i].size*2 * i
        }
        playersPlaced = true;
    }
}

function renderFlag () {
    image(flag, cupPos.x, cupPos.y, 0.5, 0.5);
}

function leaderboard () {
    c.font = '30px oswald';
    c.fillStyle = 'rgb(255, 255, 255)';
    c.textAlign = 'left';
    for (let i = 0; i < player.length; i++){
        c.fillText(`${player[i].name} strokes: ${strokes[i]}`, 50, 100 + 50*i)
    }
}

function wall (x, y, wallWidth, wallHeight) {
    let brokenIntoXPieces = Math.ceil(wallWidth/woodTexture.naturalWidth);
    let brokenIntoYPieces = Math.ceil(wallHeight/woodTexture.naturalHeight);
    c.save();
    c.rect(x, y, wallWidth, wallHeight);
    c.clip()
    for (let i = 0; i < brokenIntoXPieces; i++) {
        for (let j = 0; j < brokenIntoYPieces; j++) {
            image(woodTexture, x+wallWidth/2/brokenIntoXPieces+wallWidth*i/brokenIntoXPieces, y+wallHeight/2/brokenIntoYPieces+wallHeight*j/brokenIntoYPieces, wallWidth/woodTexture.naturalWidth/brokenIntoXPieces, wallHeight/woodTexture.naturalHeight/brokenIntoYPieces)
        }
    }
    //image(woodTexture, x+wallWidth/2, y+wallHeight/2, wallWidth/woodTexture.naturalWidth, wallHeight/woodTexture.naturalHeight)
    c.restore();
    for (let i = 0; i < player.length; i++) {
        //top left corner
        let xdbpatlc = x - player[i].x;
        let ydbpatlc = y - player[i].y;

        //top right corner
        let xdbpatrc = player[i].x - (x+wallWidth);

        //bottom left corner
        let ydbpablc = player[i].y - (y+wallHeight);
        
        if (    (xdbpatlc - player[i].size/2 < 0 || xdbpatrc - player[i].size/2 < 0) && ydbpablc - player[i].size/2 < 0 && ydbpatlc - player[i].size/2 < 0 ) {
            player[i].ySpeed *= -1
        }
        if (    (ydbpatlc - player[i].size/2 < -50 || ydbpablc - player[i].size/2 < -50) && xdbpatlc - player[i].size/2 < 0 && xdbpatrc - player[i].size/2 < 0 ) {
            player[i].xSpeed *= -1
        }
    }
}

function createHoles () {
    course[0] = () => {
        for (let i = 0; i < 14; i++) {
            for (let j = -2; j < 1; j++) {
                c.drawImage(grassTexture, width*0.1 + grassTexture.naturalWidth*i, centerY+grassTexture.naturalHeight/2 + grassTexture.naturalHeight*j )
            }
        }
        cupPos = {x: width*0.7, y: centerY};
        playerSpawn = {x: width*0.15, y: centerY+grassTexture.naturalHeight/2 + grassTexture.naturalHeight*-1 }
        image(cup, cupPos.x, cupPos.y, 0.5, 0.5);
    
        for (let i = 0; i < player.length; i++) {
            if (Math.pow(cupPos.x - player[i].x, 2) + Math.pow(cupPos.y - player[i].y, 2) <= Math.pow(player[i].size, 2) && Math.abs(player[i].xSpeed) + Math.abs(player[i].ySpeed) <= 3) {
                if (player[i].size > 10) { player[i].size *= 0.95;}
                
                player[i].xSpeed *= 0.8;
                player[i].ySpeed *= 0.8;
                if (player[i].x > cupPos.x) { player[i].x -= 0.5 }
                else { player[i].x += 0.5 }
                if (player[i].y > cupPos.y) { player[i].y -= 0.5 }
                else { player[i].y += 0.5 }
                inHoleSound[i].play();
                setTimeout(() => {
                    inHole[i] = true;
                    
                    player[i].x = -100 - i*player[i].size*2;
                    player[i].y = -100 - i*player[i].size*2;
                }, 300)
            }
            if (Math.pow(cupPos.x - player[i].x, 2) + Math.pow(cupPos.y - player[i].y, 2) <= Math.pow(player[i].size/2, 2) && Math.abs(player[i].xSpeed) + Math.abs(player[i].ySpeed) > 3) {
                let angleImpact = Math.atan((cupPos.x - player[i].x) / (cupPos.y - player[i].y))
                player[i].xSpeed *= Math.cos(angleImpact);
                player[i].ySpeed *= Math.sin(angleImpact);
            }
        }


        //left wall
        //right wall
        wall(width*0.1-100, centerY+grassTexture.naturalHeight/2 + grassTexture.naturalHeight*-3, 100, woodTexture.naturalHeight*((grassTexture.naturalHeight*5)/woodTexture.naturalHeight))
        //top wall
        wall(width*0.1, centerY+grassTexture.naturalHeight/2 + grassTexture.naturalHeight*-3, woodTexture.naturalWidth*((grassTexture.naturalWidth*14)/woodTexture.naturalWidth), 100)
        //bottom wall
        wall(width*0.1, centerY+grassTexture.naturalHeight/2 + grassTexture.naturalHeight*1, woodTexture.naturalWidth*((grassTexture.naturalWidth*14)/woodTexture.naturalWidth), 100)
        //right wall
        wall(width*0.1 + woodTexture.naturalWidth*((grassTexture.naturalWidth*14)/woodTexture.naturalWidth), centerY+grassTexture.naturalHeight/2 + grassTexture.naturalHeight*-3, 100, woodTexture.naturalHeight*((grassTexture.naturalHeight*5)/woodTexture.naturalHeight))
    }
}

export function scenePlayBallfWithYourFriends () {
    pauseGame([bgm]);
    if (!endGame) {
        bgm.play();
        startGame();
        renderBackground();
        renderArena();

        renderPlayers();
        forAllPlayers(renderGolfBallTexture)

        renderFlag();
        
        leaderboard();
    } else {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace)
    }    
}