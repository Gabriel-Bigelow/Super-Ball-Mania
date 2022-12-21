import { c, centerX, centerY, golfBallTextureW, golfBallTextureB, height, width, grassTexture, cup, flag, woodTexture, waterTexture2, scene, resScale, canvasHeightBeforeResize, canvasWidthBeforeResize, canvas, sandTexture } from "../../../Main.js";
import { colorChanger } from "../../colors.js";
import { dImage, image } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, forAllPlayers, resizePlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";
import { renderBackground } from "../background/background.js";

let bgm = new Audio('./modules/scenes/Ballf With Your Friends/sounds/Carnival Fun.mp3')

let playerSize = 15;
let gameStart = false;
let endGame = false;
let course = [];
let hole = 0;
let cupPosition = [];

let finishedMessage = '';
let playersLeft;
let firstPlace;
let secondPlace;
let thirdPlace;
let fourthPlace;

let chbr;
let cwbr;

function resizeCourses () {
    if (chbr !== canvas.height || cwbr !== canvas.width) {
        createHoles();
        waterPosition[0] = { x: width*0.1 + gtw*3, y: centerY - gt/2 };
        waterPosition[1] = { x: width*0.1 + gtw*10, y: centerY+gt/2-gt*1 };
        waterPosition[2] = { x: width*0.1 + gtw*-1, y: centerY+gt/2-gt*5 }
        waterPosition[0] = { x: width*0.1 + gtw*3, y: centerY - gt/2 };
        waterPosition[1] = { x: width*0.1 + gtw*10, y: centerY+gt/2-gt*1 };
        waterPosition[2] = { x: width*0.1 + gtw*-1, y: centerY+gt/2-gt*5 }
        cupPosition[0] = { x: width*0.2, y: centerY+gt/2-gt*3, xSpeed: 0}
        chbr = canvas.height;
        cwbr = canvas.width;
    }
}

function startGame () {
    gt = grassTexture.naturalHeight*resScale(true);
    gtw = grassTexture.naturalWidth*resScale();
    wt = woodTexture.naturalHeight*resScale(true);
    wtw = woodTexture.naturalWidth*resScale();
    if (gameStart === false){  
        waterPosition[0] = { x: width*0.1 + gtw*3, y: centerY - gt/2 };
        waterPosition[1] = { x: width*0.1+gtw*10, y: centerY+gt/2-gt*1 };
        waterPosition[2] = { x: width*0.1 + gtw*-1, y: centerY+gt/2-gt*5 }
        cupPosition[0] = { x: width*0.2, y: centerY+gt/2-gt*3, xSpeed: 0}
        
        resizePlayers(playerSize);
        playersLeft = player.slice(0, player.length);
        chbr = canvasHeightBeforeResize;
        cwbr = canvasWidthBeforeResize;
        createHoles();

        
        for (let i = 0; i < player.length; i++){
            player[i].x = centerX + player[i].size*2 *(i-player.length/2);
            player[i].y = height*0.9;
            player[i].accelRate = 0.1
            inWall[i] = 0;


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
let respawnButtonHeld = [];

function playerControlsListener(pNum) {
    if (player[pNum].controllerType === 'keyboard'){
        player[pNum].keyControlsListener();
        player[pNum].momentum();
        if (player[pNum].action) {
            hitButtonHeld[pNum]++;
        } else {
            hitButtonHeld[pNum] = 0;
        }

        if(player[pNum].sprint) {
            respawnButtonHeld[pNum]++;
        } else {
            respawnButtonHeld[pNum] = 0;
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

        if (player[pNum].buttonB) {
            respawnButtonHeld[pNum]++;
        } else {
            respawnButtonHeld[pNum] = 0;
        }

        if (power[pNum] < 100 && player[pNum].up < -0.2) {
            power[pNum] -= 1*player[pNum].up;
        }
        if (power[pNum] > 0 && player[pNum].up > 0.2) {
            power[pNum] -= 1*player[pNum].up;
        }        
    }

    changeAngle(pNum);
    hitBall(pNum);
    respawnPlayer(pNum);
}

function changeAngle(pNum) {
    if ((player[pNum].right || player[pNum].fakeRT) && player[pNum].controllerType === 'keyboard') {
        angle[pNum] += (Math.PI/180)
    }
    if ((player[pNum].left || player[pNum].fakeLT) && player[pNum].controllerType === 'keyboard') {
        angle[pNum] -= (Math.PI/180)
    }

    if (player[pNum].rightTrigger && player[pNum].controllerType === 'gamepad') {
        angle[pNum] += (Math.PI/180)*player[pNum].rightTrigger
    }
    if (player[pNum].leftTrigger && player[pNum].controllerType === 'gamepad') {
        angle[pNum] -= (Math.PI/180)*player[pNum].leftTrigger
    }
}

let strokes = [];
function hitBall (pNum) {
    if (hitButtonHeld[pNum] === 1 && player[pNum].xSpeed === 0 && player[pNum].ySpeed === 0 && power[pNum] > 0) {
        strokes[pNum]++
        player[pNum].xSpeed = (power[pNum] * 0.2) * Math.cos(angle[pNum])
        player[pNum].ySpeed = (power[pNum] * 0.2) * Math.sin(angle[pNum])
        let soundSwing = new Audio('./modules/scenes/Ballf With Your Friends/sounds/swing.mp3')
        soundSwing.play();
    }
}
function respawnPlayer (pNum) {
    if (respawnButtonHeld[pNum] === 1 && player[pNum].xSpeed === 0 && player[pNum].ySpeed === 0) {
        let allowPlayerToRespawn = true
        for (let i = 0; i < player.length; i++) {
            if (player[i].x >= playerSpawn.x-player[i].size/2 && player[i].x < playerSpawn.x+player[i].size/2 && player[i].y >= playerSpawn.y-player[i].size/2 && player[i].y < playerSpawn.y+player[i].size/2) {
                allowPlayerToRespawn = false
            }
        }
        if (allowPlayerToRespawn) {
            strokes[pNum]++
            player[pNum].x = playerSpawn.x;
            player[pNum].y = playerSpawn.y
            let soundSwing = new Audio('./modules/scenes/Ballf With Your Friends/sounds/swing.mp3')
            soundSwing.play();
        }
    }
}

function placePlayers (vertical) {
    if (vertical) {
        if (!playersPlaced) { 
            for (let i = 0; i < player.length; i++) {
                player[i].x = playerSpawn.x;
                player[i].y = playerSpawn.y + player[i].size*2 * i
            }
            playersPlaced = true;
        }
    } else {
        if (!playersPlaced) { 
            for (let i = 0; i < player.length; i++) {
                player[i].x = playerSpawn.x + player[i].size*2 * i;
                player[i].y = playerSpawn.y;
            }
            playersPlaced = true;
        }
    }
}

let cupPos = {x: 0, y: 0};
let inHole = [];
let inHoleSound = [];
let readyForNextHole = 0;
let playersPlaced = false;
let alignedVertically = true;
let playerSpawn;
function renderArena () {
    if (inHole.every(element => (element === true))) {
        readyForNextHole++;
        if (readyForNextHole > 100) {
            for (let i = 0; i < player.length; i++) {
                player[i].xSpeed = 0;
                player[i].ySpeed = 0;
            }
            hole++;
            inHole = inHole.map(element => element = false)
            resizePlayers(playerSize);
            playersPlaced = false;
            readyForNextHole = 0;
        }
    }
    if (hole === course.length) {
        scorePlayers();
    } else {
        course[hole]();
    }
    

    placePlayers(alignedVertically);
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

let inWall = [];
function wall (x, y, wallWidth, wallHeight) {
    let brokenIntoXPieces = Math.ceil(wallWidth/wtw);
    let brokenIntoYPieces = Math.ceil(wallHeight/wt);
    c.save();
    c.beginPath();
    
    c.rect(x, y, wallWidth, wallHeight);
    c.closePath();
    c.clip()
    for (let i = 0; i < brokenIntoXPieces; i++) {
        for (let j = 0; j < brokenIntoYPieces; j++) {
            image(woodTexture, x+wallWidth/2/brokenIntoXPieces+wallWidth*i/brokenIntoXPieces, y+wallHeight/2/brokenIntoYPieces+wallHeight*j/brokenIntoYPieces, wallWidth/wtw/brokenIntoXPieces, wallHeight/wt/brokenIntoYPieces)
        }
    }
    c.restore();
    for (let i = 0; i < player.length; i++) {
        //top left corner
        let xdbpatlc = x - player[i].x - player[i].size/2;
        let ydbpatlc = y - player[i].y - player[i].size/2;

        //top right corner
        let xdbpatrc = player[i].x - (x+wallWidth) - player[i].size/2;

        //bottom left corner
        let ydbpablc = player[i].y - (y+wallHeight) - player[i].size/2;
        
        //distanceToVerticalWall
        let dtvw;
        if (Math.abs(xdbpatlc) < Math.abs(xdbpatrc)) {
            dtvw = xdbpatlc;
        } else { dtvw = xdbpatrc }

        //distanceToHorizontalWall
        let dthw;
        if (Math.abs(ydbpatlc) < Math.abs(ydbpablc)) {
            dthw = ydbpatlc;
        } else { dthw = ydbpablc; }
        
        

        let inWall;
        if (Math.sqrt(Math.pow(dthw, 2) + Math.pow(dtvw, 2)) < Math.pow(player[i].size/2, 2)) {
            inWall = true;
        } else {
            inWall = false;
        }
        if ((Math.abs(ydbpablc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatlc)-Math.abs(player[i].xSpeed) && Math.abs(ydbpablc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatrc)-Math.abs(player[i].xSpeed)) || (Math.abs(ydbpatlc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatlc)-Math.abs(player[i].xSpeed) && Math.abs(ydbpatlc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatrc)-Math.abs(player[i].xSpeed)) ) {
            if (    (xdbpatlc  < -(0 + Math.abs(player[i].xSpeed)) && xdbpatrc  < -(0 + Math.abs(player[i].xSpeed))) && ydbpablc < 0 && ydbpatlc  < 0 ) {
                player[i].y -= player[i].ySpeed;
                player[i].ySpeed *= -1
                let woodHit = new Audio('./modules/scenes/Ballf With Your Friends/sounds/woodHit.mp3')
                woodHit.play();
            }
        } else {
            if (    (ydbpatlc < -(0 + Math.abs(player[i].ySpeed)) && ydbpablc < -(0 + Math.abs(player[i].ySpeed))) && xdbpatlc < 0 && xdbpatrc < 0 ) {
                player[i].x -= player[i].xSpeed;
                player[i].xSpeed *= -1
                let woodHit = new Audio('./modules/scenes/Ballf With Your Friends/sounds/woodHit.mp3')
                woodHit.play();
            }
        }
    }
}

function wall2 (x, y,  wallWidth, wallHeight) {
    let brokenIntoXPieces = Math.ceil(wallWidth/wtw);
    let brokenIntoYPieces = Math.ceil(wallHeight/wt);
    
    c.save();
    c.beginPath();
    
    c.rect(x, y, wallWidth, wallHeight);
    c.closePath();
    c.clip()
    for (let i = 0; i < brokenIntoXPieces; i++) {
        for (let j = 0; j < brokenIntoYPieces; j++) {
            image(woodTexture, x+wallWidth/2/brokenIntoXPieces+wallWidth*i/brokenIntoXPieces, y+wallHeight/2/brokenIntoYPieces+wallHeight*j/brokenIntoYPieces, wallWidth/wtw/brokenIntoXPieces, wallHeight/wt/brokenIntoYPieces)
        }
    }
    c.restore();
    for (let i = 0; i < player.length; i++) {
        //top left corner
        let xdbpatlc = x - player[i].x - player[i].size/2;
        let ydbpatlc = y - player[i].y - player[i].size/2;

        //top right corner
        let xdbpatrc = player[i].x - (x+wallWidth) - player[i].size/2;

        //bottom left corner
        let ydbpablc = player[i].y - (y+wallHeight) - player[i].size/2;

        if ((Math.abs(ydbpablc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatlc)-Math.abs(player[i].xSpeed) && Math.abs(ydbpablc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatrc)-Math.abs(player[i].xSpeed)) || (Math.abs(ydbpatlc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatlc)-Math.abs(player[i].xSpeed) && Math.abs(ydbpatlc)-Math.abs(player[i].ySpeed) < Math.abs(xdbpatrc)-Math.abs(player[i].xSpeed)) ) {
            if (    (ydbpatlc < -(0 + Math.abs(player[i].ySpeed)) && ydbpablc < -(0 + Math.abs(player[i].ySpeed))) && xdbpatlc < 0 && xdbpatrc < 0 ) {
                player[i].xSpeed += cupPosition[0].xSpeed;
                let woodHit = new Audio('./modules/scenes/Ballf With Your Friends/sounds/woodHit.mp3')
                woodHit.play();
            }
        }
    }
}

let waterPosition = [];
function water(x, y, waterWidth, waterHeight, direction, num, speedChange, drag) {
    let wt2nw = waterTexture2.naturalWidth*resScale();
    let wt2nh = waterTexture2.naturalHeight*resScale(true);

    let brokenIntoXPieces = waterWidth/wt2nw;
    let brokenIntoYPieces = waterHeight/wt2nh;

    c.save();
    c.beginPath();
    c.rect(x, y, waterWidth, waterHeight);
    c.closePath();
    c.clip()
    for (let i = -1; i < brokenIntoXPieces + 1; i++) {
        for (let j = -1; j < brokenIntoYPieces + 1; j++) {
            image(waterTexture2, waterPosition[num].x + wt2nw/2 + wt2nw*i, waterPosition[num].y + wt2nh/2+ wt2nh*j)
        }
    }
    c.restore();

    if (!speedChange) {
        speedChange = 0.5
    }
    if (!drag) {
        drag = 0.95
    }
    let maxWaterSpeed = speedChange*10;

    if (direction === 'right') {
        waterPosition[num].x += speedChange;
        waterPosition[num].x > x + wt2nw ? waterPosition[num].x = x : 'do nothing'
    }
    if (direction === 'left') {
        waterPosition[num].x -= speedChange;
        waterPosition[num].x < x - wt2nw ? waterPosition[num].x = x : 'do nothing'
    }
    if (direction === 'up') {
        waterPosition[num].y -= speedChange;
        waterPosition[num].y < y - wt2nw ? waterPosition[num].y = y : 'do nothing'
    }
    if (direction === 'down') {
        waterPosition[num].y += speedChange;
        waterPosition[num].y > y + wt2nh ? waterPosition[num].y = y : 'do nothing'
    }


    for (let i = 0; i < player.length; i++) {
        //top left corner
        let xdbpatlc = x - player[i].x - player[i].size/2;
        let ydbpatlc = y - player[i].y - player[i].size/2;

        //top right corner
        let xdbpatrc = player[i].x - (x+waterWidth) - player[i].size/2;

        //bottom left corner
        let ydbpablc = player[i].y - (y+waterHeight) - player[i].size/2;

        if (xdbpatlc < 0 && xdbpatrc < 0 && ydbpatlc < 0 && ydbpablc < 0) {
            player[i].xSpeed *= drag;
            player[i].ySpeed *= drag;
            if (direction === 'right') {
                if (player[i].xSpeed < maxWaterSpeed) {
                    player[i].xSpeed += speedChange;
                }
            } 
            if (direction === 'left') {
                if (player[i].xSpeed > -maxWaterSpeed) {
                    player[i].xSpeed -= speedChange;
                }
            }
            if (direction === 'up') {
                if (player[i].ySpeed > -maxWaterSpeed) {
                    player[i].ySpeed -= speedChange;
                }
            }
            if (direction === 'down') {
                if (player[i].ySpeed < maxWaterSpeed) {
                    player[i].ySpeed += speedChange;
                }
            }

            if (direction === 'left' || direction === 'right') {
                if (waterPosition[num].x % 5 === 0) {
                    let randomNumber = Math.floor((Math.random() * 7))
                    let splashSound = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${randomNumber+1}.mp3`);
                    splashSound.play();
                }
                player[i].ySpeed += 0.001
            } else {
                if (waterPosition[num].y % 5 === 0) {
                    let randomNumber = Math.floor((Math.random() * 7))
                    let splashSound = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${randomNumber+1}.mp3`);
                    splashSound.play();
                }
                player[i].xSpeed += 0.001;
            }
        }
    }
}

function sand(x, y, sandWidth, sandHeight, drag) {
    let brokenIntoXPieces = sandWidth/gtw;
    let brokenIntoYPieces = sandHeight/gt;

    c.save();
    c.beginPath();
    c.rect(x, y, sandWidth, sandHeight);
    c.closePath();
    c.clip()
    for (let i = 0; i < brokenIntoXPieces; i++) {
        for (let j = 0; j < brokenIntoYPieces; j++) {
            dImage(sandTexture, x + (sandWidth/brokenIntoXPieces*i), y + (sandHeight/brokenIntoYPieces*j))
        }
    }
    c.restore();
    

    if (!drag) {
        drag = 0.95
    }

    for (let i = 0; i < player.length; i++) {
        //top left corner
        let xdbpatlc = x - player[i].x - player[i].size/2;
        let ydbpatlc = y - player[i].y - player[i].size/2;

        //top right corner
        let xdbpatrc = player[i].x - (x+sandWidth) - player[i].size/2;

        //bottom left corner
        let ydbpablc = player[i].y - (y+sandHeight) - player[i].size/2;

        if (xdbpatlc < 0 && xdbpatrc < 0 && ydbpatlc < 0 && ydbpablc < 0) {
            player[i].xSpeed *= drag;
            player[i].ySpeed *= drag;
        }
    }
}

let gt;
let gtw;
let wt;
let wtw;
function createHoles () {
    gt = grassTexture.naturalHeight*resScale(true);
    gtw = grassTexture.naturalWidth*resScale();
    wt = woodTexture.naturalHeight*resScale(true);
    wtw = woodTexture.naturalWidth*resScale();
    course[0] = () => {
        alignedVertically = true;
        for (let i = 0; i < 14; i++) {
            for (let j = -2; j < 1; j++) {
                dImage(grassTexture, width*0.1 + gtw*i, centerY+gt/2 + gt*j, resScale(), resScale(true))
            }
        }
        cupPos = {x: width*0.7, y: centerY};
        playerSpawn = {x: width*0.15, y: centerY+gt/2 + gt*-1 }
        image(cup, cupPos.x, cupPos.y, 0.5*resScale(), 0.5*resScale());
    
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
                }, 200)
            }
            if (Math.pow(cupPos.x - player[i].x, 2) + Math.pow(cupPos.y - player[i].y, 2) <= Math.pow(player[i].size/2, 2) && Math.abs(player[i].xSpeed) + Math.abs(player[i].ySpeed) > 3) {
                let angleImpact = Math.atan((cupPos.x - player[i].x) / (cupPos.y - player[i].y))
                player[i].xSpeed *= Math.cos(angleImpact);
                player[i].ySpeed *= Math.sin(angleImpact);
            }
        }


        //left wall
        //right wall
        wall(width*0.1-gtw, centerY+gt/2 + gt*-3, gtw, wt*((gt*5)/wt))
        //top wall
        wall(width*0.1, centerY+gt/2 + gt*-3, wtw*((gtw*14)/wtw), gt)
        //bottom wall
        wall(width*0.1, centerY+gt/2 + gt*1, wtw*((gtw*14)/wtw), gt)
        //right wall
        wall(width*0.1 + wtw*((gtw*14)/wtw), centerY+gt/2 + gt*-3, gtw, wt*((gt*5)/wt))
    }
    course[1] = () => {
        alignedVertically = true;
        for (let i = 0; i < 15; i++) {
            for (let j = -2; j < 1; j++) {
                dImage(grassTexture, width*0.1 + gtw*i, centerY+gt/2 + gt*j, resScale(), resScale(true))
            }
        }
        for (let i = 0; i < 5; i++) {
            for (let j = -2; j < 4; j++) {
                dImage(grassTexture, width*0.1 + gtw * 8 + gtw*i, centerY+gt/2 + gt*j, resScale(), resScale(true))
            }
        }

        cupPos = {x: width*0.7, y: centerY};
        playerSpawn = {x: width*0.15, y: centerY+gt/2 + gt*-1 }
        image(cup, cupPos.x, cupPos.y, 0.5*resScale(), 0.5*resScale());
    
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
        wall(width*0.1 - gtw*1, centerY+gt/2 + gt*-3, gtw, wt*((gt*5)/wt))
        //top wall
        wall(width*0.1 - gtw*1, centerY+gt/2 + gt*-3, wtw*((gtw*16)/wtw), gt)
        //bottom wall
        wall(width*0.1 - gtw*1, centerY+gt/2 + gt*1, wtw*((gtw*9)/wtw), gt)
        //right wall
        wall(width*0.1 + wtw*((gtw*10)/wtw), centerY+gt/2 + gt*-3, gtw, wt*((gt*5)/wt))

        //left wall
        wall(width*0.1 + wtw*((gtw*7)/wtw), centerY+gt/2 + gt*2, gtw, wt*((gt*3)/wt));
        //bottom wall
        wall(width*0.1 + wtw*((gtw*7)/wtw), centerY+gt/2 + gt*4, wt*((gtw*6)/wt), gt);
        //right wall
        wall(width*0.1 + wtw*((gtw*13)/wtw), centerY+gt/2 + gt*1, gtw, wt*((gt*4)/wt));


        //top Wall
        wall(width*0.1 + wtw*((gtw*11)/wtw), centerY+gt/2, wt*((gtw*2)/wt), gt*0.5);
        //bottom wall
        wall(width*0.1 + wtw*((gtw*14)/wtw), centerY+gt/2 + gt*1, wt*((gtw*2)/wt), gt);
        //right wall
        wall(width*0.1 + wtw*((gtw*15)/wtw), centerY+gt/2 + gt*-3, gtw, wt*((gt*4)/wt));
    }
    course[2] = () => {
        alignedVertically = false;
        for (let i = 0; i < 15; i++) {
            for (let j = -2; j < 2; j++) {
                dImage(grassTexture, width*0.1 + gtw*i, centerY+gt/2 -gt + gt*j, resScale(), resScale(true))
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = -2; j < 4; j++) {
                dImage(grassTexture, width*0.7 + gtw*i, centerY+gt/2 -gt + gt*j, resScale(), resScale(true))
            }
        }

        cupPos = {x: width*0.7 + gtw*-10.5, y: centerY + gt*-2};
        playerSpawn = {x: width*0.7 + gtw*0.5, y: centerY+gt/2 + gt*2 }
        image(cup, cupPos.x, cupPos.y, 0.5*resScale(), 0.5*resScale());
    
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
        wall(width*0.7 + gtw*-1, centerY+gt/2+gt, gtw, wt*((gt*2)/wt))
        //right wall
        wall(width*0.7 + gtw*3, centerY+gt/2 + gt*-3, gtw, wt*((gt*6)/wt))
        //bottom wall
        wall(width*0.7 + gtw*-1, centerY+gt/2 + gt*3, wt*((gtw*5)/wt), gt)

        //top wall
        wall(width*0.7 + gtw*-12, centerY+gt/2 + gt*-4, gtw*16, gt)
        //left wall
        wall(width*0.7 + gtw*-12, centerY+gt/2 + gt*-3, gtw, gt*4)
        //bottom wall
        wall(width*0.7 + gtw*-12, centerY+gt/2 + gt, gtw*11, gt);

        //middle walls
        wall(width*0.7 + gtw*-1, centerY+gt/2 + gt*-3, gtw, gt)
        wall(width*0.7 + gtw*-1, centerY+gt/2 + gt*-1, gtw, gt*2)

        wall(width*0.7 + gtw*-3, centerY+gt/2 + gt*-3, gtw, gt*3)

        wall(width*0.7 + gtw*-5, centerY+gt/2 + gt*-2, gtw, gt*3)

        wall(width*0.7 + gtw*-7, centerY+gt/2 + gt*-3, gtw, gt*2.5)
        wall(width*0.7 + gtw*-7, centerY+gt/2 + gt*0, gtw, gt)

        wall(width*0.7 + gtw*-10, centerY+gt/2 + gt*-3, gtw*0.5, gt)
        wall(width*0.7 + gtw*-9, centerY+gt/2 + gt*-2.5, gtw*1.5, gt*0.5)

        wall(width*0.7 + gtw*-11, centerY+gt/2 + gt*-1, gtw, gt)
        wall(width*0.7 + gtw*-9.5, centerY+gt/2 + gt*-1, gtw*2, gt)
    }
    course[3] = () => {
        alignedVertically = true;
        for (let i = 0; i < 14; i++) {
            for (let j = -2; j < 1; j++) {
                dImage(grassTexture, width*0.1 + gtw*i, centerY+gt/2 + gt*(j-3), resScale(), resScale(true))
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                dImage(grassTexture, width*0.1 + gtw*i, centerY+gt/2 + gt*(j-2), resScale(), resScale(true))
            }
        }
        for (let i = 0; i < 16; i++) {
            for (let j = -2; j < 1; j++) {
                dImage(grassTexture, width*0.1 + gtw*i, centerY+gt/2 + gt*(j+3), resScale(), resScale(true))
            }
        }
        cupPos = {x: width*0.75, y: centerY + gt*-3};
        playerSpawn = {x: width*0.80, y: centerY+gt/2 + gt*2 }
        image(cup, cupPos.x, cupPos.y, 0.5*resScale(), 0.5*resScale());
    
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
                }, 200)
            }
            if (Math.pow(cupPos.x - player[i].x, 2) + Math.pow(cupPos.y - player[i].y, 2) <= Math.pow(player[i].size/2, 2) && Math.abs(player[i].xSpeed) + Math.abs(player[i].ySpeed) > 3) {
                let angleImpact = Math.atan((cupPos.x - player[i].x) / (cupPos.y - player[i].y))
                player[i].xSpeed *= Math.cos(angleImpact);
                player[i].ySpeed *= Math.sin(angleImpact);
            }
        }


        //left wall
        wall(width*0.1-gtw, centerY+gt/2 + gt*-6, gtw, wt*((gt*11)/wt))
        //top wall
        wall(width*0.1, centerY+gt/2 + gt*-6, wtw*((gtw*14)/wtw), gt)
        //right wall
        wall(width*0.1 + wtw*((gtw*14)/wtw), centerY+gt/2 + gt*-6, gtw, wt*((gt*5)/wt))
        //bottom wall
        wall(width*0.1 + wtw*((gtw*3)/wtw), centerY+gt/2 + gt*-2, wtw*((gtw*6)/wtw), gt)
        //bottom wall
        wall(width*0.1+gtw*8 + wtw*((gtw*3)/wtw), centerY+gt/2 + gt*-2, wtw*((gtw*3)/wtw), gt)


        //right wall - replace with water
        //wall(width*0.1+gt*3, centerY+gt/2 + gt*-1, 100, wt*((gt*2)/wt))
        //top wall
        wall(width*0.1+gtw*11, centerY+gt/2+gt*-1, gtw, wtw*((gt*2)/wtw))

        water(width*0.1, centerY+gt/2-gt, gtw*9, 200*resScale(), 'right', 0)
        water(width*0.1+gtw*9, centerY+gt/2-gt*2, 200*resScale(), gt*3, 'down', 1, 0.5)
        


        //top wall
        wall(width*0.1+gtw*12, centerY+gt/2, wtw*((gtw*4)/wtw), gt)
        //top wall
        wall(width*0.1+gtw*3, centerY+gt/2+gt, wtw*((gtw*6)/wtw), gt)
        //top wall
        wall(width*0.1+gtw*11, centerY+gt/2+gt, wtw*((gtw*2)/wtw), gt)
        //right wall
        wall(width*0.1+gtw*16, centerY+gt/2, gtw, wtw*((gt*4)/wtw))
        //bottom wall
        wall(width*0.1, centerY+gt/2 + gt*4, wtw*((gtw*17)/wtw), gt)
    }
    course[4] = () => {
        alignedVertically = false;
        for (let i = 0; i < 18; i++) {
            for (let j = 0; j < 2; j++) {
                c.drawImage(grassTexture, width*0.1 + gtw*(i-1), centerY+gt/2 + gt*(j+2) )
            }
        }
        
        playerSpawn = {x: centerX, y: centerY+gt/2 + gt*3 }
        
    
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
                }, 200)
            }
            if (Math.pow(cupPos.x - player[i].x, 2) + Math.pow(cupPos.y - player[i].y, 2) <= Math.pow(player[i].size/2, 2) && Math.abs(player[i].xSpeed) + Math.abs(player[i].ySpeed) > 3) {
                let angleImpact = Math.atan((cupPos.x - player[i].x) / (cupPos.y - player[i].y))
                player[i].xSpeed *= Math.cos(angleImpact);
                player[i].ySpeed *= Math.sin(angleImpact);
            }
        }


        //left wall
        wall(width*0.1+gtw*-2, centerY+gt/2 + gt*-6, gtw, wt*((gt*11)/wt))
        //top wall
        wall(width*0.1+gtw*-1, centerY+gt/2 + gt*-6, wtw*((gtw*19)/wtw), gt)
        //right wall
        wall(width*0.1+gtw*17, centerY+gt/2 + gt*-5, gtw, wt*((gt*9)/wt))
        //bottom wall
        wall(width*0.1+gtw*-1, centerY+gt/2 + gt*4, gtw*19, gt)

        water(width*0.1 + gtw*-1, centerY+gt/2-gt*5, gtw*18, gt*7, 'down', 2, 0.3, 0.99);


        if (cupPosition[0].x > centerX) {
            cupPosition[0].xSpeed -= 0.1*resScale();
        } else {
            cupPosition[0].xSpeed += 0.1*resScale()
        }


        cupPosition[0].x += cupPosition[0].xSpeed
        cupPos = {x: cupPosition[0].x, y: cupPosition[0].y};
        image(cup, cupPos.x, cupPos.y, 1.5*resScale(), 1.5*resScale());
        wall2(cupPosition[0].x - 150*resScale(), cupPosition[0].y-gt*0.5, gtw, gt);
        wall2(cupPosition[0].x - 150*resScale(), cupPosition[0].y+gt*0.5, 300*resScale(), gt);
        wall2(cupPosition[0].x + 50*resScale(), cupPosition[0].y-gt*0.5, gtw, gt);

        for (let i = 0; i < player.length; i++) {
            if (player[i].x >= cupPos.x -50 && player[i].x <= cupPos.x + 50 && player[i].y >= cupPos.y - 50 && player[i].y <= cupPos.y + 50 && Math.abs(player[i].xSpeed) + Math.abs(player[i].ySpeed) < 15) {
                inHoleSound[i].play();
                inHole[i] = true;
                player[i].x = -100 - i*player[i].size*2;
                player[i].y = -100 - i*player[i].size*2;
            }
        }

    }
    course[5] = () => {
        alignedVertically = true;
        for (let i = 0; i < 17; i++) {
            for (let j = 0; j < 6; j++) {
                c.drawImage(grassTexture, width*0.1 + gtw*(i-1), centerY+gt/2 + gt*(j-4) )
            }
        }

        cupPos = {x: width*0.15, y: centerY-gt/2 };
        playerSpawn = {x: width*0.80, y: centerY-gt/2 }
        image(cup, cupPos.x, cupPos.y, 0.5*resScale(), 0.5*resScale());
    
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
                }, 200)
            }
            if (Math.pow(cupPos.x - player[i].x, 2) + Math.pow(cupPos.y - player[i].y, 2) <= Math.pow(player[i].size/2, 2) && Math.abs(player[i].xSpeed) + Math.abs(player[i].ySpeed) > 3) {
                let angleImpact = Math.atan((cupPos.x - player[i].x) / (cupPos.y - player[i].y))
                player[i].xSpeed *= Math.cos(angleImpact);
                player[i].ySpeed *= Math.sin(angleImpact);
            }
        }


        //left wall
        wall(width*0.1+gtw*-2, centerY+gt/2 + gt*-5, gtw, gt*8)
        //top wall
        wall(width*0.1+gtw*-1, centerY+gt/2 + gt*-5, gtw*17, gt)
        //right wall
        wall(width*0.1 + gtw*15, centerY+gt/2 + gt*-4, gtw, gt*6)
        //bottom wall
        wall(width*0.1 + gtw*-1, centerY+gt/2 + gt*2, gtw*17, gt)

        


        water(width*0.1 + gtw*2, centerY+gt/2-gt*2, gtw*9, gt*2, 'right', 0, 0.3, 0.98)
        //top wall
        wall(width*0.1+gtw*2, centerY+gt/2 + gt*-4, gtw*2, gt*2);
        wall(width*0.1+gtw*6, centerY+gt/2 + gt*-4, gtw*2, gt*2);
        wall(width*0.1+gtw*10, centerY+gt/2 + gt*-4, gtw, gt*2);


        wall(width*0.1+gtw*2, centerY+gt/2, gtw, gt*2);
        wall(width*0.1+gtw*4, centerY+gt/2, gtw*2, gt*2);
        wall(width*0.1+gtw*8, centerY+gt/2, gtw*3, gt*2);

        sand(width*0.1+gtw*4, centerY+gt/2 - gt*4, gtw*2, gt*0.25);
        sand(width*0.1+gtw*8, centerY+gt/2 - gt*4, gtw*2, gt*0.25);

        sand(width*0.1+gtw*3, centerY+gt/2 + gt*1.25, gtw, gt*0.75);
        sand(width*0.1+gtw*6, centerY+gt/2 + gt*1.75, gtw*2, gt*0.25);        
    }
}

function scorePlayers () {
    let playersLeftToScore = player.slice(0, player.length);
    for (let i = 0; i < player.length; i++) {
        let lowestScore = 10000;
        for (let j = 0; j < strokes.length; j++) {
            if (strokes[j] < lowestScore) {
                lowestScore = strokes[j];
            }
        }

        if (!firstPlace) {
            firstPlace = playersLeftToScore.splice(strokes.indexOf(lowestScore), 1);
            strokes.splice(strokes.indexOf(lowestScore), 1);
        } else if (!secondPlace) {
            secondPlace = playersLeftToScore.splice(strokes.indexOf(lowestScore), 1);
            strokes.splice(strokes.indexOf(lowestScore), 1);
        } else if (!thirdPlace) {
            thirdPlace = playersLeftToScore.splice(strokes.indexOf(lowestScore), 1);
            strokes.splice(strokes.indexOf(lowestScore), 1);
        } else if (!fourthPlace) {
            fourthPlace = playersLeftToScore.splice(strokes.indexOf(lowestScore), 1);
            strokes.splice(strokes.indexOf(lowestScore), 1);
        }       
    }
    endGame = true;
    bgm.pause();
}

export function resetGameBallfWithYourFriends () {
    bgm = new Audio('./modules/scenes/Ballf With Your Friends/sounds/Carnival Fun.mp3');
    playerSize = 15;
    gameStart = false;
    endGame = false;
    course = [];
    hole = 0;
    cupPosition = [];
    
    finishedMessage = '';
    playersLeft = undefined;
    firstPlace = undefined;
    secondPlace = undefined;
    thirdPlace = undefined;
    fourthPlace = undefined;
    golfTexturePosition = [];
    power = [];
    angle = [];
    hitButtonHeld = [];
    respawnButtonHeld = [];
    strokes = [];
    cupPos = {x: 0, y: 0};
    inHole = [];
    inHoleSound = [];
    readyForNextHole = 0;
    playersPlaced = false;
    alignedVertically = true;
    playerSpawn = undefined;
    waterPosition = [];
}

export function scenePlayBallfWithYourFriends () {
    pauseGame([bgm]);
    if (!endGame) {
        bgm.play();
        
        startGame();
        renderBackground();
        resizeCourses();
        renderArena();

        renderPlayers();
        forAllPlayers(renderGolfBallTexture)

        renderFlag();
        
        leaderboard();
    } else {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace)
    }    
}