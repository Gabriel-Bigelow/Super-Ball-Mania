import { c, centerX, centerY, cloudSprite, cumulonimbleBackground, height, width } from "../../../Main.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, resizePlayers } from "../../player functions/playerFunctions.js";
import { controllerDeadzone, player } from "../../players.js";
import { renderBackground } from "../background/background.js";

//come back to this one. It doesn't work the way I want it to. Players sometimes fall through the clouds, and some of the jumps are too difficult to make.





let bgm = new Audio('./modules/scenes/Cumulonimble/sounds/bgm.mp3')

let gameStarted = false;
let endGame = false;

let playersLeft;
let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;


function startGame () {
    if (!gameStarted) {
        resizePlayers(50);
        if (cloud.length < 1 ){ createCloud(-170); }

        for (let i = 0; i < player.length; i++){
            player[i].accelRate = 0.75;
            player[i].decelRate = 0.9;
            jumpButtonHeld[i] = 0;
            jumpCount[i] = 0;

            player[i].x = cloud[0].x + cloud[0].pic.naturalWidth/(player.length+1)*(i+1)
            player[i].y = cloud[0].y
            gravityOnPlayer[i] = 0;
            onCloud[i] = false;
            playersLeft = player.slice(0, player.length);
            setTimeout(() => {
                gameStarted = true;
                bgm.play();
                
                
            }, 3000)
        }
        c.textAlign = 'center';
        c.font = '40px oswald';
        c.fillStyle = 'rgb(255, 255, 255)';
        c.fillText('Get Ready!', centerX, centerY);
    }
}


function renderPlayers() {
    for (let i = 0; i < player.length; i++) {
        if (!player[i].lose) {
            player[i].draw();
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
            playerControls(i)
            gravity(i);
            jump(i)
        }

    }
};
function playerControls(pNum) {
    if (player[pNum].controllerType === 'keyboard'){
        player[pNum].keyControlsListener();
        player[pNum].momentum();
        if (player[pNum].left) {
            player[pNum].west();
        }
        if (player[pNum].right) {
            player[pNum].east();
        }
        if (!player[pNum].left && !player[pNum].right){
            player[pNum].resetAccelX();
        }
        if (player[pNum].action) {
            jumpButtonHeld[pNum]++;
        } else {
            jumpButtonHeld[pNum] = 0;
        }
    } else if (player[pNum].controllerType === 'gamepad'){
        player[pNum].gamepadControlsListener();
        player[pNum].momentum();
        if (player[pNum].right < -controllerDeadzone) {
            player[pNum].west(player[pNum].right);
        }
        if (player[pNum].right > controllerDeadzone) {
            player[pNum].east(player[pNum].right);
        }
        if (player[pNum].right > -controllerDeadzone && player[pNum].right < controllerDeadzone ){
            player[pNum].resetAccelX();
        }
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
    if (jumpButtonHeld[pNum] === 1 && jumpCount[pNum] < 2) {
        gravityOnPlayer[pNum] = -15 - (cloudSpeed-1);
        onCloud[pNum] = false;
        jumpCount[pNum]++;
    }
}

let gravityOnPlayer = [];
let onCloud = [];
function gravity (pNum) {
    player[pNum].topSpeed += 0.001
    player[pNum].y += gravityOnPlayer[pNum];
    if (onCloud[pNum] === false) {
        gravityOnPlayer[pNum] += 0.5 + (cloudSpeed-1)/5;
    } else {
        jumpCount[pNum] = 0;
        gravityOnPlayer[pNum] = cloudSpeed;
    }
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
        //if (ydbpatlc+player[i].size/2 > )
        let distanceToTopOfCloud = y - player[i].y

        if (ydbpatlc+player[i].size/2+gravityOnPlayer[i] > 0 && ydbpablc-player[i].size/2 < 0 && xdbpatlc+player[i].size/2 >= 0 && xdbpatrc-player[i].size/2 < 0){
            if (Math.abs(ydbpatlc+gravityOnPlayer[i]) < Math.abs(ydbpablc)) {
                player[i].y = y-player[i].size/2;
                onCloud[i] = true;
            } else {
                player[i].y += cloudSpeed;
                onCloud[i] = false;
            }
            
            
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

let cloud = [];
function createCloud (specificY) {
    if (specificY) {
        cloud.push( {
            pic: cloudSprite[Math.floor(Math.random() * cloudSprite.length)],
            x: Math.floor(Math.random()*(width-850)) + 150,
            y: specificY,
        } )
    } else {
        cloud.push( {
            pic: cloudSprite[Math.floor(Math.random() * cloudSprite.length)],
            x: Math.floor(Math.random()*(width-850)) + 150,
            y: -200,
        } )
    }

}

let frame = 0;
let timeBetweenSpawn = 270;
let cloudSpeed = 1;
function renderClouds () {
    if (frame === timeBetweenSpawn && cloud.length < 4) {
        createCloud();
        frame = -1;
    }
    
    for (let i = 0; i < cloud.length; i++) {
        if (cloud[i].pic === cloudSprite[0]) {
            wall(cloud[i].x+20, cloud[i].y + 80, cloud[i].pic.naturalWidth-30, 15);
        } else if (cloud[i].pic === cloudSprite[1]){
            wall(cloud[i].x+20, cloud[i].y + 30, cloud[i].pic.naturalWidth-30, 15);
        } else if (cloud[i].pic === cloudSprite[2]){
            wall(cloud[i].x+20, cloud[i].y + 70, cloud[i].pic.naturalWidth-30, 15);
        } else if (cloud[i].pic === cloudSprite[3]){
            wall(cloud[i].x+20, cloud[i].y + 40, cloud[i].pic.naturalWidth-30, 15);
        } else if (cloud[i].pic === cloudSprite[4]){
            wall(cloud[i].x+20, cloud[i].y + 40, cloud[i].pic.naturalWidth-30, 15);
        } else if (cloud[i].pic === cloudSprite[5]){
            wall(cloud[i].x+20, cloud[i].y + 40, cloud[i].pic.naturalWidth-30, 15);
        } else if (cloud[i].pic === cloudSprite[6]){
            wall(cloud[i].x+20, cloud[i].y + 40, cloud[i].pic.naturalWidth-30, 15);
        }

        c.drawImage(cloud[i].pic, cloud[i].x, cloud[i].y)
        cloud[i].y += cloudSpeed;

        if (cloud[i].y > height) { 
            cloud[i].pic = cloudSprite[Math.floor(Math.random() * cloudSprite.length)]
            cloud[i].y = -200
            cloud[i].x = Math.floor(Math.random()*(width-750)) + 250;
        }
    }

    cloudSpeed += 0.001
    frame++;
}




function loseCondition () {
    for (let i = 0; i < playersLeft.length; i++) {
        if (playersLeft[i].y > height) {
            playersLeft[i].lose = true;
            if (!fourthPlace && playersLeft.length === 4) { fourthPlace = playersLeft.splice(playersLeft.indexOf(playersLeft[i]), 1) }
            else if (!thirdPlace && playersLeft.length === 3) { thirdPlace = playersLeft.splice(playersLeft.indexOf(playersLeft[i]), 1) }
            else if (!secondPlace && playersLeft.length === 2) { secondPlace = playersLeft.splice(playersLeft.indexOf(playersLeft[i]), 1) }
            else if (playersLeft.length > 4) { playersLeft.splice(playersLeft.indexOf(playersLeft[i]), 1) }
        }
    }
    if (playersLeft.length === 1) { 
        firstPlace = playersLeft.splice(0, 1);
        bgm.pause();
        endGame = true; };
}


export function scenePlayCumulonimble () {
    pauseGame([bgm]);
    if (!endGame) {
        if (gameStarted) { bgm.play() }
        renderBackground(cumulonimbleBackground);
        
        startGame();        
        renderPlayers();
        renderClouds();
        loseCondition();
    } else {
        bgm.pause();
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace);
    }    
}