import { brickTexture, c, centerX, centerY, height, width } from "../../../Main.js";
import { nextGame } from "../../gameEndFunctions.js";
import { pauseGame } from "../../pauseGame.js";
import { renderPlayers, resizePlayers } from "../../player functions/playerFunctions.js";
import { pAccelRate, player, pTopSpeed } from "../../players.js";
import { renderBackground } from "../background/background.js";


let bgm = new Audio('./modules/scenes/Most Wanted/sounds/Le Grand Chase.mp3')


let gameStarted = false;
let endGame = false;

let playersLeftToScore;
let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;

let it;
let timeSinceLastTag = 0;
function startGame () {
    if (!gameStarted) {
        resizePlayers(50);
        if (!it && it !== 0) {
            it = Math.floor(Math.random() * player.length);
        }        
        for (let i = 0; i < player.length; i++){
            points[i] = 0;
            player[i].x = width/(player.length+1) + width/(player.length+1)*i
            player[i].y = centerY;
            setTimeout (() => {
                gameStarted = true;
                
            }, 3400)
        }
        playersLeftToScore = player.slice(0, player.length);

        c.textAlign = 'center';
        c.font = '40px oswald';
        c.fillStyle = 'rgb(255, 255, 255)';
        c.fillText('Get Ready!', centerX, centerY);
        bgm.play();
    }
}

function renderArrow () {
    let rotateAngle
    if (player[it].x >= centerX) {
        rotateAngle = Math.atan((player[it].y - height*0.15) / (player[it].x - centerX)) - Math.PI/2;
    } else {
        rotateAngle = Math.atan((height*0.15 - player[it].y) / (centerX - player[it].x)) + Math.PI/2;
    }

    c.strokeStyle = 'rgb(255, 255, 255)';
    c.lineWidth = 5;
    c.save();
    c.translate(centerX, height*0.15);
    c.rotate(rotateAngle)
    c.beginPath();
    c.moveTo(-15, 0);
    c.lineTo(-15, height*0.05);
    c.lineTo(-30, height*0.05);
    c.lineTo(0, height*0.08);
    c.lineTo(30, height*0.05);
    c.lineTo(15, height*0.05);
    c.lineTo(15, 0);
    c.lineTo(-15-5/2, 0);
    c.stroke();
    c.closePath();
    c.restore();

}

let frame = 0;
let second = 90;
function renderTimer () {
    c.beginPath();
    c.font = '40px oswald';
    c.textAlign = 'center';
    c.fillStyle = 'rgb(255, 255, 255)';
    c.strokeStyle = 'rgb(255, 255, 255)';
    if (second > 0){
        c.textAlign = 'center';
        c.fillText(`Catch ${player[it].name}!`, centerX, height * 0.12)
        if (frame === 60){
            second--;
            frame = 0;
        }
        points[it] += 1/60;
        frame++;
    }
    c.lineWidth = 2.5;
    c.rect(centerX-35, height*0.05 - 50, 70, 70);
    c.stroke();
    c.fillText(second, centerX, Math.max(height*0.05, 55));
    c.closePath();
}

function renderOutline () {
    if (gameStarted){
        c.save();
        c.globalAlpha = 0.5;
        c.strokeStyle = player[it].clr;
        c.lineWidth = 5;
        c.beginPath();
        c.arc(player[it].x, player[it].y, player[it].size/2 * 1.5, 0, Math.PI*2);
        c.closePath();
        c.stroke();
        c.restore();
    }

}





function renderArena () {
    c.save();
    c.beginPath()
    //horizontal walls
    //top walls
    wall(width*0.5, height*0.25, height*0.35, 20);
    wall(width*0.2, height*0.25, height*0.35, 20);

    //middle walls
    wall(width*0.35, height*0.55, height*0.65, 20);
    wall(width*0.35+height*0.65+player[0].size*1.5, height*0.55, height*0.10, 20);


    //bottom wall
    wall(width*0.4, height*0.75, height*0.35, 20);

    //vertical walls
    //left wall
    wall(width*0.25, height*0.35, 20, height*0.35);

    //right most vert wall
    wall(width*0.80, height*0.25, 20, height*0.40);
    wall(width*0.80, height*0.25+height*0.40+player[0].size*1.5, 20, height*0.2);

    //middle vert walls
    wall(width*0.50, height*0.55, 20, height*0.1);
    wall(width*0.50, height*0.375, 20, height*0.1);

    //z wall
    wall(width*0.1, height*0.57, height*0.10, 20);
    wall(width*0.15, height*0.69, height*0.10, 20);
    wall(width*0.10, height*0.45, 20, height*0.12);
    wall(width*0.10, height*0.69, 20, height*0.12);
    wall(width*0.20, height*0.45, 20, height*0.37);


    c.closePath();
    c.fill();
    c.clip();
    for (let i = 0; i < 20; i++){
        for (let j = 0; j < 11; j++){
            c.drawImage(brickTexture, brickTexture.naturalWidth*i, brickTexture.naturalHeight*j);
        }
    }
    c.restore();
}

export function wall (x, y, wallWidth, wallHeight) {
    c.rect(x, y, wallWidth, wallHeight);

    for (let i = 0; i < player.length; i++) {
        //top left corner
        let xdbpatlc = player[i].x - x;
        let ydbpatlc = player[i].y - y;

        //top right corner
        let xdbpatrc = player[i].x - (x+wallWidth);

        //bottom left corner
        let ydbpablc = player[i].y - (y+wallHeight);

        if (ydbpatlc+player[i].size/2 > 0 && ydbpablc-player[i].size/2 < 0 && xdbpatlc+player[i].size/2 >= player[i].topSpeed && xdbpatrc-player[i].size/2 < -player[i].topSpeed){
            if (Math.abs(ydbpatlc) < Math.abs(ydbpablc)) {
                player[i].y -= 2;
            } else {
                player[i].y += 2;
            }
                player[i].ySpeed = 0
        }
        if (ydbpatlc+player[i].size/2 > player[i].topSpeed && ydbpablc-player[i].size/2 < -player[i].topSpeed && xdbpatlc+player[i].size/2 >= 0 && xdbpatrc-player[i].size/2 < 0){
            if (Math.abs(xdbpatlc) < Math.abs(xdbpatrc)) {
                player[i].x -= 2;
            } else {
                player[i].x += 2;
            }        
            player[i].xSpeed = 0
        }
    }
}





function changeItSpeed (it, pNum) {
    player[pNum].topSpeed = pTopSpeed*(1+(player.length/20));
    player[pNum].accelRate = pAccelRate*(1+(player.length/20));
    player[it].topSpeed = pTopSpeed;
    player[it].accelRate = pAccelRate;
}
function passIt () {
    timeSinceLastTag++
    for (let i = 0; i < player.length; i++) {
        if (timeSinceLastTag >= 5 && i !== it && player[it].newPlayerContactPhysics.tdbpab(i) <= player[it].size/2 && !player[i].lose) {
            let siren = new Audio('./modules/scenes/Most Wanted/sounds/siren.mp3')
            siren.play();
            changeItSpeed(it, i)
            it = i
            timeSinceLastTag = 0;
        }
    }
}

let points = [];
function leaderboard () {
    c.font = '25px oswald';
    c.textAlign = 'left';
    c.fillStyle = 'rgb(255, 255, 255)';
    for (let i = 0; i < points.length; i++) {
        c.fillText(`${player[i].name}: ${points[i].toFixed(2)} seconds`, width*0.025, height*0.05 + 60*i)
    }
}

function score () {
    let highestValue = 0;
    if (second === 0) {
        for (let i = 0; i < playersLeftToScore.length; i++) {
            if (points[i] > highestValue) {
                highestValue = points[i];
            }
        }

        if (!firstPlace) { firstPlace = playersLeftToScore.splice(points.indexOf(highestValue), 1); points.splice(points.indexOf(highestValue), 1) }
        else if (!secondPlace) { secondPlace = playersLeftToScore.splice(points.indexOf(highestValue), 1); points.splice(points.indexOf(highestValue), 1) }
        else if (!thirdPlace) { thirdPlace = playersLeftToScore.splice(points.indexOf(highestValue), 1); points.splice(points.indexOf(highestValue), 1) }
        else if (!fourthPlace) { fourthPlace = playersLeftToScore.splice(points.indexOf(highestValue), 1); points.splice(points.indexOf(highestValue), 1) }

        if (firstPlace, secondPlace, thirdPlace, fourthPlace) {
            endGame = true;
            bgm.pause();
        }
    }
}




export function scenePlayMostWanted () {
    pauseGame([bgm]);
    if (!endGame) {
        renderBackground();

        startGame();        
        renderOutline();
        renderPlayers();
        passIt();

        renderArena();

        if (gameStarted){            
            renderTimer();
            leaderboard();
            renderArrow();
        }
        score();
    } else {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace);
    }    
}