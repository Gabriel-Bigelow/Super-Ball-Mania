import { brickTexture, c, centerX, centerY, explosionAnimation, height, smokeAnimation, sparkAnimation, width } from "../../../Main.js";
import { ellipse, image, mapTexture } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, resizePlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";
import { renderBackground } from "../background/background.js";
import { wall } from "../Most Wanted/playMostWanted.js";

let bgm = new Audio('./modules/scenes/Hot Potato/sounds/bgm.mp3')

let gameStarted = false;
let endGame = false;

let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;

let playersLeft;

function startGame () {
    if (!gameStarted) {
        c.font = '40px oswald';
        c.fillStyle = 'rgb(255, 255, 255)';
        c.fillText('Get Ready!', centerX, centerY);

        resizePlayers(75);
        playersLeft = player.slice(0, player.length);
        for (let i = 0; i < player.length; i++){
            player[i].x = width/(player.length+1) + width/(player.length+1)*i
            player[i].y = centerY;
            setTimeout (() => {
                gameStarted = true;
                bgm.play();
                sizzle[0].play();
            }, 2000)
        }
    }
}

function renderArena () {
    wall(width*0.2, height*0.25, width*0.25, 20);
    wall(width*0.55, height*0.25, width*0.25, 20);
    wall(width*0.2, height*0.75, width*0.25, 20);
    wall(width*0.55, height*0.75, width*0.25, 20);
    wall(width*0.5, height*0.375, 20, width*0.15);
}

function renderPlayers() {
    for (let i = 0; i < player.length; i++) {
        if (!player[i].lose) {
            player[i].draw();
            player[i].checkForWallCollision();
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
            player[i].controls();
        }
    }
};

let frame = 0;
let second = 20;
function renderTimer () {
    c.beginPath();
    c.textAlign = 'center';
    c.font = '40px oswald';
    c.fillStyle = 'rgb(255, 255, 255)';
    c.strokeStyle = 'rgb(255, 255, 255)';
    if (second > 0){
        c.fillText(`${player[it].name} is going to explode!`, centerX, height * 0.12)
        if (frame === 60){
            second--;
            frame = 0;
        }
        frame++;
    }
    c.lineWidth = 2.5;
    c.rect(centerX-35, height*0.05 - 50, 70, 70);
    c.stroke();
    c.fillText(second, centerX, Math.max(height*0.05, 55));
    c.closePath();
}

function renderOutline () {
    ellipse(player[it].x-player[it].xSpeed, player[it].y-player[it].ySpeed, player[it].size*0.85, 'rgb(0, 0, 0)')
    ellipse(player[it].x-player[it].xSpeed, player[it].y-player[it].ySpeed, player[it].size*0.10, 'rgb(80, 30, 30)')
}

let spark = [];
function createSpark () {
    spark.push ( {
        frame: 0,
        size: 1,
        angle: Math.PI*Math.random(),
    })
}
let sparkInterval = 10;
let sparkIncrementor = 0;
function renderSpark () {
    if (sparkIncrementor === sparkInterval) {
        createSpark();
        sparkIncrementor = 0;
    }
    sparkIncrementor++;

    for (let i = 0; i < spark.length; i++){
        c.save();
        c.translate(player[it].x-player[it].xSpeed, player[it].y-player[it].ySpeed);
        c.rotate(spark[i].angle)
        image(sparkAnimation[spark[i].frame.toFixed(0)], 0, 0)
        c.restore();
        spark[i].frame += 0.5;
        if (spark[i].frame > sparkAnimation.length - 1) {
            spark.shift();
        }
    }
}

let smoke = [];
function createSmoke () {
    smoke.push ( {
        frame: 0,
        size: 0.3,
        x: player[it].x+5 - player[it].xSpeed,
        y: player[it].y-10 - player[it].ySpeed
    } )
}
let smokeInterval = 7;
let smokeIncrementor = 0;
function renderSmoke () {
    if (smokeInterval === smokeIncrementor){
        createSmoke();
        smokeIncrementor = 0;
    }
    smokeIncrementor++;

    for (let i = 0; i < smoke.length; i++){
        c.globalAlpha = Math.max(1-smoke[i].frame/100)
        image(smokeAnimation[smoke[i].frame], smoke[i].x, smoke[i].y, smoke[i].size, smoke[i].size);
        c.globalAlpha = 1;
        smoke[i].frame += 1;
        smoke[i].size += 0.008;
        smoke[i].y -= 1.5;
        if (smoke[i].frame === smokeAnimation.length) {
            smoke.shift();
        }
    }
}

let it;
let timeSinceLastTag = 0;
function passIt () {
    timeSinceLastTag++
    let itHolder = it;
    for (let i = 0; i < player.length; i++) {
        if (timeSinceLastTag >= 30 && i !== it && player[it].newPlayerContactPhysics.tdbpab(i) <= player[it].size/2 && !player[i].lose) {
            itHolder = i;
            timeSinceLastTag = 0;
        }
    }
    it = itHolder
}
let sizzle = []
function explodeBomb () {
    if (!it && it !== 0) {
        it = playersLeft[Math.floor(Math.random()*playersLeft.length)].pid;
        sizzle.push(new Audio('./modules/scenes/Hot Potato/sounds/sizzle.mp3'))
    }

    if (second === 0){
        player[it].lose = true;
        for (let i = 0; i < sizzle.length; i++) { sizzle[i].pause(); }
        explosion.push({ frame: 0, x: player[it].x, y: player[it].y })
        let boom = new Audio ('./modules/scenes/Hot Potato/sounds/boom.mp3')
        boom.play();
        player[it].x = -100;
        player[it].y = -100;
        smoke = [];
        spark = [];
        if (!fourthPlace && player.length >= 4) { fourthPlace = player.slice(it, it+1) }
        else if (!thirdPlace && player.length >= 3) { thirdPlace = player.slice(it, it+1) }
        else if (!secondPlace) { secondPlace = player.slice(it, it+1) }
        setTimeout(() => {
            playersLeft.splice(playersLeft.indexOf(player[it]), 1);
            it = undefined;
            second = 20;
            sizzle.push(new Audio('./modules/scenes/Hot Potato/sounds/sizzle.mp3'))
            sizzle[sizzle.length-1].play();
        }, 3000);
        second = '0'
    }
}

let explosion = [];
function renderExplosion () {
    if (explosion[0]){
        image(explosionAnimation[Math.floor(explosion[0].frame)], explosion[0].x, explosion[0].y)
        explosion[0].frame += 0.4;
        if (Math.floor(explosion[0].frame) === explosionAnimation.length) {
            explosion.shift();
        }
    }
}


export function scenePlayHotPotato () {
    pauseGame([bgm]);
    if (!endGame) {
        renderBackground();
        mapTexture(brickTexture, 20, 11, 0, 0, renderArena)

        startGame();
        
        
        renderPlayers();
        renderExplosion();

        if (playersLeft.length > 1) {
            explodeBomb();
            passIt();
            if (second > 0 && gameStarted){
                renderOutline();
                renderSmoke();
                renderSpark();
            }
        } else {
            firstPlace = playersLeft.slice(0, 1);
            sizzle[sizzle.length-1].pause();
            bgm.pause();
            endGame = true;
        }

        if (gameStarted){            
            renderTimer();
        }
    } else {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace);
    }    
}

