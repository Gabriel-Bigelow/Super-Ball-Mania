import { c, centerX, centerY, height } from "../../../Main.js";
import { centerRect, ellipse } from "../../drawShapes.js";
import { nextGame, nextGameInd } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, resizePlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";
import { renderBackground } from "../background/background.js";


let bgm = new Audio('./modules/scenes/Light On Your Feet/sounds/bgm.mp3')
let incrementingSound = [];
for (let i = 1; i < 21; i++) {
    incrementingSound[i-1] = new Audio(`./modules/scenes/Light On Your Feet/sounds/incrementingSounds/incrementing-${i}.mp3`)
}
let wrongSound = new Audio('./modules/scenes/Light On Your Feet/sounds/wrong.mp3')

let gameStarted = false;
let endGame = false;

let playersLeft;
let points = [];

let whoseTurn = 0;

function startGame () {
    if (!gameStarted) {
        resizePlayers(75);
        tileSize = player[0].size*1.3
        playersLeft = player.slice(0, player.length);

        for (let i = 0; i < playersLeft.length; i++){
            playersLeft[i].x = centerX+300 + player[i].size*i*1.5
            playersLeft[i].y = height - player[i].size

            upButtonHeld[i] = 0;
            downButtonHeld[i] = 0;
            leftButtonHeld[i] = 0;
            rightButtonHeld[i] = 0;

            tileColumns[i] = 5;
            tileRows[i] = 4;
            path[i] = [];
            points[i] = 0;
        }


        setTimeout(() => {
            gameStarted = true;
        }, 3000)
    }
}

let roundStarted = false;
let showingTilePath = false;
let tileRows = [];
let tileColumns = [];
let tileInactiveColor = 'rgb(150, 150, 150)';
let playerWalked = [];

let tile = [];
function startRound () {
    if (!roundStarted && gameStarted) {
        for (let i = 0; i < playersLeft.length; i++){
            if (i !== whoseTurn) {
                playersLeft[i].x -= player[i].size*1.5
                playersLeft[i].y = height - player[i].size
            }
        }

        playersLeft[whoseTurn].y = height - (tileSize+tileGap)
        if (tileColumns[whoseTurn] % 2 === 0) {
            playersLeft[whoseTurn].x = centerX + (tileSize+tileGap)/2;    
        } else {
            playersLeft[whoseTurn].x = centerX
        }


        tile = [];

        for (let i = tileColumns[whoseTurn]/-2; i < tileColumns[whoseTurn]/2; i++) {
            tile[i+tileColumns[whoseTurn]/2] = [];
            for (let j = 0; j < tileRows[whoseTurn]; j++) {
                createTile(i+tileColumns[whoseTurn]/2, j, centerX + (tileSize+tileGap)*i+(tileSize+tileGap)/2, height-(tileSize+tileGap)*j-(tileSize+tileGap)*2);
            }
        }
        createPath();
        roundStarted = true;
        showingTilePath = true;
        for(let i = 0; i < path[whoseTurn].length; i++) {
            setTimeout(() => {
                let column = path[whoseTurn][i] - Math.floor(path[whoseTurn][i]/10)*10;
                let row = Math.floor(path[whoseTurn][i]/10);
                console.log(`${column}x, ${row}y`);
                tile[column][row].color = 'rgb(255, 255, 255)';
                if (incrementingSound[i]) {
                    incrementingSound[i].play();
                } else { incrementingSound[incrementingSound.length-1].play()}
                

                if (i === path[whoseTurn].length-1) {
                    setTimeout(() => {
                        for (let j = 0; j < tile.length; j++) {
                            for (let k = 0; k < tile[j].length; k++) {
                                tile[j][k].color = tileInactiveColor;
                            }
                        }
                        showingTilePath = false;
                    }, 3000);
                }
            }, 750*i + 1000);
        }
    }
}

function createTile (inColumn, inRow, x, y) {
    tile[inColumn].push( {
        active: false,
        column: inColumn,
        row: inRow,
        x: x,
        y: y,
        color: tileInactiveColor,
    } )
}

let path = [];
function createPath () {
    let maxColumnNumber = tileColumns[whoseTurn];
    let maxRowNumber = tileRows[whoseTurn];
    let numOfSteps = Math.ceil((tileColumns[whoseTurn] * tileRows[whoseTurn]) / 3)
    let remakePath = true;

    if (path[whoseTurn].length < 1) {
        while(remakePath) {
            path[whoseTurn][0] = Math.floor(Math.random() * maxColumnNumber);
            //console.log(path[whoseTurn])
        
            //console.log(`${numOfSteps} num of steps`);
            
    
            for (let i = 1; i < numOfSteps; i++) {
                //console.log(`steps left ${numOfSteps - i}`)
                let previousLocation = path[whoseTurn][i-1];
                let possibleDirections = [-10, -1, 1, 10];
    
                //removes direction to move if the player is at the edge of the board
                if (previousLocation >= (maxRowNumber-1) * 10) {
                    possibleDirections.splice(possibleDirections.indexOf(10), 1);
                    //console.log('removing +10')
                }
                if (previousLocation < 10) {
                    possibleDirections.splice(possibleDirections.indexOf(-10), 1);
                    //console.log('removing -10')
                }
                if (previousLocation - Math.floor(previousLocation/10)*10 === 0) {
                    possibleDirections.splice(possibleDirections.indexOf(-1), 1);
                    //console.log('removing -1')
                }
                if (previousLocation - Math.floor(previousLocation/10)*10 === maxColumnNumber - 1) {
                    possibleDirections.splice(possibleDirections.indexOf(1), 1);
                    //console.log('removing +1')
                }
    
                //removes direction to move if player will run into a previously highlighted tile
                for (let k = 0; k < path[whoseTurn].length; k++) {
                    for (let j = 0; j < possibleDirections.length; j++) {
                        if (previousLocation + possibleDirections[j] === path[whoseTurn][k]) {
                            //console.log(`removing ${possibleDirections[j]}`);
                            possibleDirections.splice(j, 1);
                        }
                    }
                }
                
                //removes direction if going that direction would prevent the player from reaching the end by the time they run out of steps
                let stepsItWouldTakeToReachEnd = ((maxRowNumber - 1)*10 - Math.floor(previousLocation/10)*10) / 10;
                if ((stepsItWouldTakeToReachEnd >= numOfSteps - i || numOfSteps - i <= 3) && possibleDirections.some(element => element === -10) ) {
                    //console.log(possibleDirections)
                    possibleDirections.splice(possibleDirections.indexOf(-10), 1)
                    //console.log('removing -10')
                }
                if (numOfSteps - i === (maxRowNumber - 1) - Math.floor(previousLocation/10) ) {
                    possibleDirections = [10]
                    //console.log('making +10 the only option')
                }
                //console.log(`${stepsItWouldTakeToReachEnd} steps to reach end`)
                //console.log(possibleDirections)
                //console.log('^possible directions^')
    
                
    
    
    
                let randomDirection = Math.floor(Math.random() * possibleDirections.length);
                path[whoseTurn].push(path[whoseTurn][i-1] + possibleDirections[randomDirection]);
    
                //console.log('v decided path v')
                //console.log(path[whoseTurn])
                /*console.log(' ');
                console.log(' ');
                console.log(' ');
                console.log(' ');
                console.log(' ');
                console.log(' ');
                console.log(' ');
                console.log(' ');*/    
            }

            let areThereDuplicateSteps = false;
            for (let x = 0; x < path[whoseTurn].length; x++) {
                for (let y = 0; y < path[whoseTurn].length; y++) {
                    if (path[whoseTurn][x] === path[whoseTurn][y] && x !== y){
                        areThereDuplicateSteps = true;
                    }
                }
            }
            //if path doesn't get to the top of the board, resets the selected path to draw another one
            if ((path[whoseTurn].length === numOfSteps && path[whoseTurn][numOfSteps-1] < (maxRowNumber-1)*10) || !path[whoseTurn][numOfSteps-1] || areThereDuplicateSteps) {
                path[whoseTurn] = [];
            } else {
                remakePath = false;
            }
        }
    }

    console.log('end product')
    console.log(path[whoseTurn])
}

function winHandler () {
    //dole out 1 point per correct tile configuration
    points[playersLeft[whoseTurn].pid]++

    //increase difficulty
    path[whoseTurn] = [];
    tileRows[whoseTurn]++;
    tileColumns[whoseTurn]++
    
    //change whose turn it is and start next round
    let farthestRightX = 0;
    for (let i = 0; i < playersLeft.length; i++) {
        if (whoseTurn !== i && playersLeft[i].x > farthestRightX) { farthestRightX = playersLeft[i].x }
    }
    playersLeft[whoseTurn].x = farthestRightX + 1.5*player[whoseTurn].size
    playersLeft[whoseTurn].y = height - player[whoseTurn].size
    playerWalked = [];
    tilesActive = 0;
    if (points[playersLeft[whoseTurn].pid] === 4) {
        playersLeft.splice(whoseTurn, 1);
        path.splice(whoseTurn, 1);
        whoseTurn--;
    }
    whoseTurn++;
    if (whoseTurn === playersLeft.length) {
        whoseTurn = 0;
    }
    roundStarted = false;
    if (playersLeft.length === 0) { endGame = true; bgm.pause(); } 
}

function loseHandler() {
        playersLeft.splice(whoseTurn, 1)
        path.splice(whoseTurn, 1);
        playerWalked = [];
        tilesActive = 0;
        wrongSound.play();
        if (whoseTurn === playersLeft.length) {
            whoseTurn = 0;
        }
        roundStarted = false;
        if (playersLeft.length === 0) { endGame = true; bgm.pause(); } 
}

function checkPath () {
    let correctSteps = 0;
    for (let i = 0; i < playerWalked.length; i++) {
        if (playerWalked.length === path[whoseTurn].length && playersLeft[whoseTurn].y < tile[0][tile[0].length-1].y) {
            if (playerWalked[i] === path[whoseTurn][i]){
                correctSteps++;
                if (correctSteps === path[whoseTurn].length) {
                    winHandler();
                }
            }
        }
        if (playerWalked[i] !== path[whoseTurn][i]) {
            loseHandler();
        }
    }
    if (path.length > 0) {
        if (playerWalked.length !== path[whoseTurn].length && playersLeft[whoseTurn].y < tile[0][tile[0].length-1].y && playersLeft.length > 0) {
            loseHandler();
        }
    }
}


function renderArena () {
    for (let i = 0; i < tile.length; i++) {
        for (let j = 0; j < tile[i].length; j++){
            if (tile[i][j].active) { c.fillStyle = playersLeft[whoseTurn].clr; } 
            else { c.fillStyle = tile[i][j].color; }
            
            centerRect(tile[i][j].x, tile[i][j].y, tileSize, tileSize)
            wall(tile[i][j].x-tileSize/2, tile[i][j].y-tileSize/2, tileSize, tileSize, i, j)
        }
        c.fillStyle = tileInactiveColor
        c.fillRect(tile[0][0].x-tileSize/2, tile[0][tile[0].length-1].y-tileSize*3/2-tileGap, tile[tile[0].length][0].x - tile[0][0].x + tileSize, tileSize)
        c.fillStyle = 'rgb(255, 255, 255)';
        c.textAlign = 'center'
        c.fillText('FINISH', tile[0][0].x-tileSize/2 + (tile[tile[0].length][0].x - tile[0][0].x + tileSize)/2, tile[0][tile[0].length-1].y-tileSize-tileGap )
    }
    leaderboard();
}



function renderPlayers() {
    for (let i = 0; i < playersLeft.length; i++) {
        ellipse(playersLeft[i].x, playersLeft[i].y, player[i].size*1.05, 'rgb(0, 0, 0)');
        playersLeft[i].draw();
                
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
        
        if (gameStarted && whoseTurn === i && !showingTilePath) {
            playerControlsListener(i)
            
            if (playersLeft[whoseTurn].y > tile[0][tile[0].length-1].y - tileSize - tileGap){ 
                up(i)
            }
            if (playersLeft[whoseTurn].y < tile[0][0].y){ 
                down(i)
            }
            if (playersLeft[whoseTurn].x > tile[0][0].x){
                left(i)
            }
            if (playersLeft[whoseTurn].x < tile[tile.length-1][0].x){
                right(i)
            }
        }
    }
};

function playerControlsListener(pNum) {
    if (playersLeft[pNum].controllerType === 'keyboard'){
        playersLeft[pNum].keyControlsListener();
        playersLeft[pNum].momentum();
        if (playersLeft[pNum].up) {
            upButtonHeld[pNum]++;
        } else {
            upButtonHeld[pNum] = 0;
        }
        
        if (playersLeft[pNum].down) {
            downButtonHeld[pNum]++;
        } else {
            downButtonHeld[pNum] = 0;
        }

        if (playersLeft[pNum].left) {
            leftButtonHeld[pNum]++;
        } else {
            leftButtonHeld[pNum] = 0;
        }

        if (playersLeft[pNum].right) {
            rightButtonHeld[pNum]++;
        } else {
            rightButtonHeld[pNum] = 0;
        }
    } else if (playersLeft[pNum].controllerType === 'gamepad'){
        playersLeft[pNum].gamepadControlsListener();
        playersLeft[pNum].momentum();
        if (playersLeft[pNum].buttonDPadUp) {
            upButtonHeld[pNum]++;
        } else {
            upButtonHeld[pNum] = 0;
        }

        if (playersLeft[pNum].buttonDPadDown) {
            downButtonHeld[pNum]++;
        } else {
            downButtonHeld[pNum] = 0;
        }

        if (playersLeft[pNum].buttonDPadLeft) {
            leftButtonHeld[pNum]++;
        } else {
            leftButtonHeld[pNum] = 0;
        }

        if (playersLeft[pNum].buttonDPadRight) {
            rightButtonHeld[pNum]++;
        } else {
            rightButtonHeld[pNum] = 0;
        }
    }
}

let upButtonHeld = [];
let downButtonHeld = [];
let leftButtonHeld = [];
let rightButtonHeld = [];


let tileSize;
let tileGap = 10;
function up (pNum) {
    if (upButtonHeld[pNum] === 1) {
        playersLeft[pNum].y -= tileSize+tileGap
    }
}

function down (pNum) {
    if (downButtonHeld[pNum] === 1) {
        playersLeft[pNum].y += tileSize+tileGap
    }
}

function left (pNum) {
    if (leftButtonHeld[pNum] === 1) {
        playersLeft[pNum].x -= tileSize+tileGap
    }
}

function right (pNum) {
    if (rightButtonHeld[pNum] === 1) {
        playersLeft[pNum].x += tileSize+tileGap
    }
}

let tilesActive = 0;
function wall (x, y, wallWidth, wallHeight, column, row) {
    c.rect(x, y, wallWidth, wallHeight);
    for (let i = 0; i < playersLeft.length; i++) {
        //top left corner
        let xdbpatlc = playersLeft[i].x - x;
        let ydbpatlc = playersLeft[i].y - y;

        //top right corner
        let xdbpatrc = playersLeft[i].x - (x+wallWidth);

        //bottom left corner
        let ydbpablc = playersLeft[i].y - (y+wallHeight);
        
        if (xdbpatlc - playersLeft[i].size/2 > 0 && xdbpatrc + playersLeft[i].size/2 < 0 && ydbpatlc - playersLeft[i].size/2 > 0 && ydbpablc + playersLeft[i].size/2 < 0) {
            if (!tile[column][row].active) {
                if (incrementingSound[tilesActive]) {
                    incrementingSound[tilesActive].play();
                } else { incrementingSound[incrementingSound.length-1].play()}
                tilesActive += 1;
                playerWalked.push(tile[column][row].column + tile[column][row].row*10)
            }
            tile[column][row].active = true;
        }
    }
}

function leaderboard () {
    c.font = '30px oswald';
    c.fillStyle = 'rgb(255, 255, 255)';
    c.textAlign = 'left';
    for (let i = 0; i < player.length; i++){
        c.fillText(`${player[i].name} points: ${points[i]}`, 50, 100 + 50*i)
    }
}

export function scenePlayLightOnYourFeet () {
    pauseGame([bgm]);
    if (!endGame) {
        
        bgm.play()
        startGame();
        startRound();
                
        renderBackground();
        renderArena();

        renderPlayers();
        checkPath();


        if (!gameStarted) {
            c.textAlign = 'center';
            c.font = '40px oswald';
            c.fillStyle = 'rgb(255, 255, 255)';
            c.fillText('Get Ready!', centerX, centerY/2);
        }
    } else {
        for(let i = 0; i < player.length; i++){
            nextGameInd(i, points[i]);
        }
    }    
}