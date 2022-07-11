import { buttonPic, c, centerX, centerY, concreteTexture, conveyorBelt, height, lavaTexture, width } from "../../../Main.js";
import { image } from "../../drawShapes.js";
import { nextGame } from "../../gameEndFunctions.js";
import { inputControls } from "../../inputs.js";
import { gamepad } from "../../listeners/gamepadListener.js";
import { pauseGame } from "../../pauseGame.js";
import { assignControls, resizePlayers } from "../../player functions/playerFunctions.js";
import { player } from "../../players.js";
import { renderBackground } from "../background/background.js";

let gameStart = false;
let endGame = false;

let bgm = new Audio('./modules/scenes/Simon Says/sounds/elevatorMusic.mp3')
let positiveSimonSays = [];
for (let i = 0; i < 3; i++){
    positiveSimonSays[i] = new Audio(`./modules/scenes/Simon Says/sounds/simonSpeech/positiveSimonSays/${i}.mp3`)
}
let negativeSimonSays = [];
for (let i = 0; i < 11; i++) {
    negativeSimonSays[i] = new Audio(`./modules/scenes/Simon Says/sounds/simonSpeech/negativeSimonSays/${i}.mp3`)
}
let pressOrDontPress = [];
pressOrDontPress[0] = new Audio(`./modules/scenes/Simon Says/sounds/simonSpeech/pressOrDontPress/0.mp3`)
pressOrDontPress[1] = new Audio(`./modules/scenes/Simon Says/sounds/simonSpeech/pressOrDontPress/1.mp3`)
pressOrDontPress[2] = new Audio(`./modules/scenes/Simon Says/sounds/simonSpeech/pressOrDontPress/2.mp3`)
let repeatCommands = new Audio(`./modules/scenes/Simon Says/sounds/simonSpeech/repeatCommands.mp3`)

let buttons = [];
for (let i = 0; i < 16; i++){
    if (i !== 8 && i !== 9){
        buttons[i] = new Audio(`./modules/scenes/Simon Says/sounds/simonSpeech/buttons/${i}.mp3`)
    }
}

let firstPlace = [undefined];
let secondPlace = [undefined];
let thirdPlace = [undefined];
let fourthPlace = [undefined];
let playersLeft;
let firstToComplete;


function startGame () {
    if (gameStart === false) {
        playersLeft = player.length;
        resizePlayers(50);
        for (let i = 0; i < player.length; i++){
            player[i].x = centerX-1470/2 + (163+1/3)*2
            player[i].y = centerY/(player.length) + height/(player.length)*(i)
            player[i].ssp.xPosition = player[i].x
        }
        numOfCommands = 4;
        gameStart = true;
    }
}

function renderPlayers () {
    for (let i = 0; i < player.length; i++){
        c.save();
        c.beginPath()
        c.rect(centerX-1420/2, player[i].y+7-50, 1450, 100);
        c.closePath();
        c.clip();
        for (let j = -1; j < 2; j++){
            image(conveyorBelt, player[i].x+width/4 + 1470*j, player[i].y+7);
        }
        c.restore();
        player[i].ssp.draw();
        
        //assigns default gamepad controllers to the first 4 players without controls defined, then gives keyboard controls to the next 4 players without controls defined
        if (!player[i].controllerType){
            for (let j = 0; j < gamepad.length; j++){
                if (!player[i].controllerType && (!inputControls.controllerAssignedTo[j] && inputControls.controllerAssignedTo[j] !== 0)){
                    assignControls(i, 'gamepad', undefined, undefined, undefined, undefined, undefined, j);
                    inputControls.controllerAssignedTo[j] = i;
                }
            }
        }
        if (!simonSpeaking && player[i].ssp.inputArray.length < commandArray.length && player[i].x >= centerX-1470/2 + (163+1/3)*1 - 20 && player[i].x < centerX-1500/2 + (163+1/3)*9){
            player[i].ssp.controls();
        }
        if (player[i].ssp.inputArray.length > commandArray.length) {
            player[i].ssp.inputArray.pop();
            player[i].ssp.inputPicArray.pop();
        }
    }   
}

function renderArena () {
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            c.drawImage(concreteTexture, 640*i, 430*j);
        }
    }
    c.fillStyle = 'rgb(0, 0, 0)';
    c.fillRect(0, 0, 275, height);

    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillRect(centerX+1420/2, 0, 400, height);
    c.fillStyle = 'rgb(0, 0, 0)';
    for (let i = 0; i < 12; i++){
        for (let j = 0; j < 5; j++){
            let k = i;
            if (j % 2 !== 0){c.fillRect(centerX+1420/2 + 50*j, 0 + 100 * i + 50, 50, 50); }
            else { c.fillRect(centerX+1420/2 + 50*j, 0 + 100 * k, 50, 50); }
        }
    }
}

let whoSaysText;
let doOrDontText;
let sayingWho = true;
let sayingDoWhat = false;
let sayingWhichButtons = false;
function renderSimonText () {c
    c.globalAlpha = '.5';
    c.fillStyle = 'rgb(0, 0, 0)';
    c.fillRect(0, 0, width, height);
    c.globalAlpha = '1';
    c.font = '100px oswald';
    c.fillStyle = 'rgb(255, 255, 255)';
    if (sayingWho){ c.fillText(whoSaysText, centerX, height * 0.2); commandArrayCopy = [] }
    if (sayingDoWhat) { c.fillText(doOrDontText, centerX, height * 0.2); }
    if (sayingWhichButtons) {
        for (let i = 0; i < commandArrayCopy.length; i++) {
            image(buttonPic[commandArrayCopy[i]], centerX + i*82 - (commandArrayCopy.length-1)/2*82, centerY, 1, 1)
        }
    }
    
}
let commandArrayCopy = [];

let delay = 0;
function simonSpeak (howManyCommands, endDelay) {
    whoSays.play();
        sayingWho = true;
        setTimeout(() => {
            sayingWho = false;
            doOrDont.play();
            sayingDoWhat = true;
            
            setTimeout(() => {
                sayingDoWhat = false;
                sayingWhichButtons = true;

                for (let i = 0; i < howManyCommands; i++){
                    delay = 0
                    for (let j = 0; j < i; j++){
                        delay += buttons[commandArray[i]].duration*1000;
                    }
                    setTimeout(() => {
                        buttons[commandArray[i]].play();
                        commandArrayCopy.push(commandArray[i]);

                        if (i === Math.floor(howManyCommands) - 1) {
                            setTimeout(() => {
                                simonSpeaking = false;
                                sayingWhichButtons = false;
                                if (!followSimonSays) { 
                                    setTimeout(() => {
                                        finishedPlayers = player.length
                                        checkPlayerInput();
                                    }, endDelay)
                                }
                            }, endDelay)
                            delay += buttons[commandArray[i]].duration*1000;
                            return delay
                        }
                    }, delay+50*i);
                }
            }, doOrDont.duration*1000)
        }, whoSays.duration*1000*1.2)
}
let simonSpeaking = true;
let newCommands = true;
function simonSays (howManyCommands) {
    howManyCommands = Math.max(howManyCommands, 4);
    if (simonSpeaking) {
        renderSimonText();
    }

    
    if (newCommands){
        doesSimonSay();
        createCommands(howManyCommands);

        simonSpeak(howManyCommands,5000);
        
        newCommands = false;
    }
}

let numOfCommands;
let commandArray = [];
function createCommands (howMany) {
    if (commandArray.length < howMany) {
        for (let i = 0; i < howMany; i++){
            let randomNumber = Math.floor(Math.random() * 16);
            
            while (randomNumber > 7 && randomNumber < 10){
                randomNumber = Math.floor(Math.random() * 16);
            }
            commandArray[i] = randomNumber
        }
    }
    commandArrayCopy2 = commandArray.slice(0, commandArray.length);
}

let whoSays;
let doOrDont;
let followSimonSays;
function doesSimonSay () {
    let num1 = Math.random();
    let num2 = Math.random();
    let num3 = Math.random();
    if (num1 <= 0.85) {
        whoSays = positiveSimonSays[0]
        whoSaysText = 'Simon says'
        if (num2 >= 0.8 && num2 < 0.9 ) { whoSays = positiveSimonSays[1]; whoSaysText = 'Simon does say'; followSimonSays = true; }
        if (num2 >= 0.9) { whoSays  = positiveSimonSays[2]; whoSaysText = "Simon does not not say"; followSimonSays = true; }
        if (num3 <= 0.85) { doOrDont = pressOrDontPress[2]; doOrDontText = 'do press'; followSimonSays = true;} 
        else { doOrDont = pressOrDontPress[0]; doOrDontText = "dont press"; followSimonSays = false; }
    } else {
        followSimonSays = false;
        whoSays = negativeSimonSays[Math.floor(num2 * 11)]
        if (Math.floor(num2 * 11) === 0) { whoSaysText = 'Someone says'; }
        if (Math.floor(num2 * 11) === 1) { whoSaysText = 'Simon does not say'; }
        if (Math.floor(num2 * 11) === 2) { whoSaysText = 'Sandwiches'; }
        if (Math.floor(num2 * 11) === 3) { whoSaysText = 'Sentences'; }
        if (Math.floor(num2 * 11) === 4) { whoSaysText = 'Signing says'; }
        if (Math.floor(num2 * 11) === 5) { whoSaysText = 'Sandy says'; }
        if (Math.floor(num2 * 11) === 6) { whoSaysText = 'Sally says'; }
        if (Math.floor(num2 * 11) === 7) { whoSaysText = 'Simeon says'; }
        if (Math.floor(num2 * 11) === 8) { whoSaysText = 'Simone says'; }
        if (Math.floor(num2 * 11) === 9) { whoSaysText = 'Sinus says'; }
        if (Math.floor(num2 * 11) === 10) { whoSaysText = 'Salmon says'; }
        doOrDont = pressOrDontPress[2]; doOrDontText = 'do press';
    }
}

let commandArrayCopy2;
let finishedPlayers = 0;
let inputsChecked = false;
function checkPlayerInput () {
    if (followSimonSays){
        finishedPlayers = 0;
        for (let i = 0; i < player.length; i++){
            if (player[i].ssp.inputArray.length === commandArrayCopy2.length || player[i].lose || player[i].x > centerX-1500/2 + (163+1/3)*9) {
                if (!firstToComplete){
                    let matchedArray = [];
                    for (let j = 0; j < commandArray.length; j++){
                        if (player[i].ssp.inputArray[j] === commandArray[j]){
                            matchedArray[j] = true;
                        } else {
                            matchedArray[j] = false;
                        }
                    }
                    if (matchedArray.every(element => { if (element === true) { return true } })) {
                        firstToComplete = player[i];
                    }
                }
                finishedPlayers += 1;
            }
        }
    }
    if (finishedPlayers === player.length && !inputsChecked){
        simonSpeaking = true;
        repeatCommands.play();
        setTimeout(() => {
            simonSpeak(numOfCommands, 1000);
        }, repeatCommands.duration*1000);
        setTimeout(()=> {
           roundWinHandler(); 
        }, delay + repeatCommands.duration*1000*1.2+3000)
        
        commandArrayCopy2 = []
        inputsChecked = true;
    }
}

function roundWinHandler () {
    let matching;
    for (let i = 0; i < player.length; i++){
        setTimeout(() => {
            if (followSimonSays) {
                matching = [];
                for (let j = 0; j < commandArray.length; j++){
                    if (player[i].ssp.inputArray[j] === commandArray[j]){
                        matching[j] = true;
                    } else {
                        matching[j] = false;
                    }
                }
                if (matching.every(element => { if (element === true) { return true} })) {
                    matching = true;
                } else {
                    matching = false;
                }
            } else if (!followSimonSays) {
                if (player[i].ssp.inputArray.length === 0){
                    matching = true;
                } else {
                    matching = false;
                }
            }

            let moveBack = new Audio('./modules/scenes/Simon Says/sounds/moveBack.mp3');
            let moveForward = new Audio('./modules/scenes/Simon Says/sounds/moveForward.mp3')
            let conveyorBeltNoise = new Audio('./modules/scenes/Simon Says/sounds/conveyorBeltNoise.mp3')

            let playerInBounds = () => { if (player[i].x > centerX - 1400/2 && player[i].x < centerX + 1400/2) { return true; } else { return false; }}
            if (firstToComplete === player[i]) { player[i].ssp.xPosition += (163 + 1/3); firstToComplete = undefined; }
            if (matching && followSimonSays && playerInBounds()) { player[i].ssp.xPosition += (163 + 1/3); moveForward.play(); conveyorBeltNoise.play(); numOfCommands += 0.5 } 
            if (!matching && followSimonSays && playerInBounds()) { player[i].ssp.xPosition -= (163 + 1/3); moveBack.play(); conveyorBeltNoise.play(); numOfCommands -= 1;}
            if (player[i].ssp.inputArray.length === 0 && !followSimonSays && playerInBounds()) { player[i].ssp.xPosition += (163 + 1/3); moveForward.play(); conveyorBeltNoise.play(); }
            if (player[i].ssp.inputArray.length > 0 && !followSimonSays && playerInBounds()) { player[i].ssp.xPosition -= (163 + 1/3); moveBack.play(); conveyorBeltNoise.play(); }
            if (numOfCommands < 4) { numOfCommands = 4; }
            
            if (i === player.length - 1) {
                setTimeout(() => {
                    if (!endGame){
                        nextRound();
                    }
                }, 3000)
            }
        }, 1000*i)
    }
}

function movePlayer () {
    for (let i = 0; i < player.length; i++){
        if (player[i].x < player[i].ssp.xPosition){
            player[i].x++
        }
        if (player[i].x === centerX-1470/2 + (163+1/3)*2 + 163 * 7){
            placePlayerWin(i);
        }
        if (player[i].x > player[i].ssp.xPosition){
            player[i].x--
        }
        if (player[i].x === centerX-1470/2 + (163+1/3)*2 - 163 * 2){
            placePlayerLose(i);
        }
        if (player[i].x < centerX - 1400/2){
            player[i].lose = true;
            if (player[i].size > 0.1){
                player[i].size *= 0.95
            }
        }
    }
}
function placePlayerWin (pNum) {
    if (!firstPlace[0]) { firstPlace = player.slice(player.indexOf(player[pNum]), pNum+1); playersLeft -= 1;} 
    else if (!secondPlace[0]) { secondPlace = player.slice(player.indexOf(player[pNum]), pNum+1); playersLeft -= 1; } 
    else if (!thirdPlace[0]) { thirdPlace = player.slice(player.indexOf(player[pNum]), pNum+1); playersLeft -= 1; }
    else if (!fourthPlace[0]) { fourthPlace = player.slice(player.indexOf(player[pNum]), pNum+1); playersLeft -= 1;} 
    if (playersLeft === 0){ endGame = true; bgm.pause(); }
}
function placePlayerLose () {
    playersLeft -= 1;
    if (playersLeft === 0){
        endGame = true;
    }
}

function nextRound () {
    finishedPlayers = 0;
    inputsChecked = false;
    for (let i = 0; i < player.length; i++){
        player[i].ssp.inputArray = [];
        player[i].ssp.inputPicArray = [];
    }
    commandArrayCopy2 = undefined;
    newCommands = true;
    simonSpeaking = true;
    commandArray = [];
    simonSays(numOfCommands);
}

export function scenePlaySimonSays () {
    pauseGame([bgm]);
    startGame();
    if (!endGame) {
        c.fillStyle = 'rgb(150, 150, 150)';
        c.fillRect(0, 0, width, height);
        bgm.play();

        renderArena();
        renderPlayers();


        simonSays(numOfCommands)
        if (followSimonSays){
            checkPlayerInput();
        }
        movePlayer();
    } else {
        nextGame(firstPlace, secondPlace, thirdPlace, fourthPlace, bgm);
    }    
}