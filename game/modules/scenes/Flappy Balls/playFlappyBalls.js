import { c, centerX, centerY, flappyBallsBackground, height, pipeBottom, pipeTop, width } from "../../../Main.js";
import { ellipse, image } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, resizePlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";

let bgm = new Audio('./modules/scenes/Cumulonimble/sounds/bgm.mp3')
let point = new Audio('./sounds/menu/save.mp3');

let gameStarted = false;
let firstStart = true;
let endGame = false;
let readyToEndGame = false;

let playersLeft;
let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;


function startGame () {
    if (!gameStarted) {
        resizePlayers(50);
        
        if (!firstStart) {
            firstPlace = undefined;
            secondPlace = undefined;
            thirdPlace = undefined;
            fourthPlace = undefined;
        }


        for (let i = 0; i < player.length; i++){
            player[i].lose = false;
            player[i].x = 200 + player[i].size*i*1.5
            player[i].y = height - player[i].size-27

            jumpButtonHeld[i] = 0;
            gravityOnPlayer[i] = 0;
            playersLeft = player.slice(0, player.length);
            setTimeout(() => {
                gameStarted = true;
                firstStart = false;
            }, 3000)
        }
        c.textAlign = 'center';
        c.font = '40px oswald';
        c.fillStyle = 'rgb(255, 255, 255)';
        c.fillText('Get Ready!', centerX, centerY);
    }
}

let imageX = 0;
let scrollSpeed = 3;
function renderBackground() {
    for (let i = 0; i < 3; i++) {
        c.drawImage(flappyBallsBackground, imageX + width*i, 0)
    }
    imageX -= scrollSpeed;
    if (imageX < -width) { imageX %= 2; }
}

function renderPlayers() {
    for (let i = 0; i < player.length; i++) {
        if (player[i].y < height + 200) {
            ellipse(player[i].x, player[i].y, player[i].size*1.1, 'rgb(0, 0, 0)');
            player[i].draw();
            if (!player[i].lose) {
                player[i].checkForWallCollision();
                
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
                if (gameStarted) {
                    playerControls(i)
                    jump(i)
                }
            } else {
                player[i].x -= scrollSpeed
            }
            gravity(i);
        }
    }
};
function playerControls(pNum) {
    if (player[pNum].controllerType === 'keyboard'){
        player[pNum].keyControlsListener();
        player[pNum].momentum();
        if (player[pNum].action) {
            jumpButtonHeld[pNum]++;
        } else {
            jumpButtonHeld[pNum] = 0;
        }
    } else if (player[pNum].controllerType === 'gamepad'){
        player[pNum].gamepadControlsListener();
        player[pNum].momentum();
        if (player[pNum].buttonA) {
            jumpButtonHeld[pNum]++;
        } else {
            jumpButtonHeld[pNum] = 0;
        }
    }
}

let jumpButtonHeld = [];
let jumpCount = [];
function jump (pNum) {
    if (jumpButtonHeld[pNum] === 1) {
        gravityOnPlayer[pNum] = -10
        jumpCount[pNum]++;
        let jump = new Audio('./modules/scenes/Cumulonimble/sounds/jump.mp3')
        jump.play();
    }
}

let gravityOnPlayer = [];
function gravity (pNum) {
    player[pNum].y += gravityOnPlayer[pNum];
    gravityOnPlayer[pNum] += 0.5
    if (!player[pNum].lose) {
        if (player[pNum].y < 0 || player[pNum].y > height - player[pNum].size-30) {
            gravityOnPlayer[pNum] = 0;
        }
        if (player[pNum].y + gravityOnPlayer[pNum] > height - player[pNum].size-15) {
            player[pNum].y -= player[pNum].size/2;
        }
    }
}


let pipe = [];
function createPipe () {
    console.log('making pipe')
    pipe.push( {
        pic: pipeTop,
        x: width+pipeTop.naturalWidth,
        y: Math.floor(Math.random() * (height-(pipeGap + pipeTop.naturalHeight*2 + pipeBottom.naturalHeight)) ),
        pipeWidth: pipeTop.naturalWidth,
        pipeHeight: pipeTop.naturalHeight,
        gap: Math.max(pipeGap, 180)
    } )
}

let pipeInterval = 175;
let pipeTimer = 0;
let pipeGap = 250
let score = 0;
let scoreWhenLastDied = 0;
function renderPipes () {
    if (pipe.length < 1 || pipeTimer === pipeInterval) { 
        createPipe();
        pipeTimer = 0;
        pipeGap -= 2
    };
    
    for (let i = 0; i < pipe.length; i++) {
        c.drawImage(pipe[i].pic, pipe[i].x, pipe[i].y);
        wall(pipe[i].x, 0, pipeTop.naturalWidth, pipe[i].y + pipeTop.naturalHeight);
        c.drawImage(pipe[i].pic, pipe[i].x, pipe[i].y+pipeTop.naturalHeight+pipe[i].gap);
        wall(pipe[i].x, pipe[i].y+pipeTop.naturalHeight+pipe[i].gap, pipeTop.naturalWidth, height);
        for (let j = 1; j < 7; j++) {
            c.drawImage(pipeBottom, pipe[i].x, pipe[i].y-pipeBottom.naturalHeight*j)
            c.drawImage(pipeBottom, pipe[i].x, pipe[i].y+pipeTop.naturalHeight*2+pipeBottom.naturalHeight*(j-1) + pipe[i].gap)
        }
        pipe[i].x -= scrollSpeed;
    }

    if (pipe[score].x > 200-pipeTop.naturalWidth-player[0].size/2 - scrollSpeed*1.1 && pipe[score].x < 200-pipeTop.naturalWidth-player[0].size/2 && playersLeft.length > 0) { score++; point.play(); }
    pipeTimer++
}

function wall (x, y, wallWidth, wallHeight) {
    c.rect(x, y, wallWidth, wallHeight);
    for (let i = 0; i < player.length; i++) {
        //top left corner
        let xdbpatlc = player[i].x - x;
        let ydbpatlc = player[i].y - y;

        //top right corner
        let xdbpatrc = player[i].x - (x+wallWidth);

        //bottom left corner
        let ydbpablc = player[i].y - (y+wallHeight);

        if (ydbpatlc+player[i].size/2+gravityOnPlayer[i] > 0 && ydbpablc-player[i].size/2 < 0 && xdbpatlc+player[i].size/2 >= 0 && xdbpatrc-player[i].size/2 < 0 && !player[i].lose){
            loseHandler(i);
            winHandler();
        }
    }
}

function renderScore () {
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = '60px oswald';
    c.fillText(score, centerX, height*0.1);

    c.strokeStyle = 'rgb(255, 255, 255)';
    c.beginPath();
    c.rect(centerX - 45, height*0.04, 90, height*0.075)
    c.closePath();
    c.stroke();
}

function loseHandler (pNum) {
    let hit = new Audio('./modules/scenes/Flappy Balls/sounds/hit.mp3')
    hit.play();
    player[pNum].lose = true;

    if (playersLeft.length <= 4) {
        if (!fourthPlace && playersLeft.length === 4) { fourthPlace = playersLeft.splice(playersLeft.indexOf(player[pNum]), 1); scoreWhenLastDied = score; }
        else if (!thirdPlace && playersLeft.length === 3) { thirdPlace = playersLeft.splice(playersLeft.indexOf(player[pNum]), 1); scoreWhenLastDied = score; }
        else if (!secondPlace && playersLeft.length === 2) { secondPlace = playersLeft.splice(playersLeft.indexOf(player[pNum]), 1); scoreWhenLastDied = score; }    
    }
    if (playersLeft.indexOf(player[pNum]) !== -1) { playersLeft.splice(playersLeft.indexOf(player[pNum]), 1) }
}

let gameRestarted = false;
function winHandler () {
    if (!firstPlace && scoreWhenLastDied < score && playersLeft.length === 1) { 
        firstPlace = playersLeft.splice(0, 1); 
        bgm.pause(); 
        endGame = true; 
        setTimeout(() => {
            readyToEndGame = true;
        }, 2000);
    }
    else if (playersLeft.length === 0 && !firstPlace && !gameRestarted) {
        setTimeout(() => {
            score = 0;
            while ( pipe.length > 0) { pipe.shift(); }
            gameStarted = false; 
            imageX = 0;
            pipeTimer = 0;
            pipeGap = 250;        
            
            createPipe();
            gameRestarted = false;
        }, 1000)
        gameRestarted = true;
    }
}

export function scenePlayFlappyBalls () {
    pauseGame([bgm]);
    if (!endGame) {
        bgm.play()
        renderBackground();
        startGame(); 
        
               
        renderPipes();

        renderPlayers();
        renderScore();       
        winHandler();
    }
    if (endGame && readyToEndGame) {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace);
    }    
}

export function restartFlappyBalls() {
    imageX = 0;
    score = 0;
    pipe = [];
    gameStarted = false;
    firstStart = true;
    endGame = false;
    readyToEndGame = false;

    firstPlace = undefined;
    secondPlace = undefined;
    thirdPlace = undefined;
    fourthPlace = undefined;
}