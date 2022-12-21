import { c, canvas, changeScene, height, width, superBallManiaGameplay2, videoFrame, centerX, resScale } from "../../Main.js";
import { buttonBallfWithYourFriends, buttonColorClash, buttonCumulonimble, buttonDeselectAll, buttonFlappyBalls, buttonHotPotato, buttonLightOnYourFeet, buttonMostWanted, buttonPlayNow, buttonPreviousScreen, buttonRowRace, buttonSelectAll, buttonSimonSays, buttonSumo, moveButton, soundDeselect } from "../buttons.js";
import { image } from "../drawShapes.js";
import { resetPlayerProperties } from "../gameEndFunctions.js";
import { gamepad } from "../listeners/gamepadListener.js";
import { player } from "../players.js";
import { renderBackground } from "./background/background.js";
import { scenePlayBallfWithYourFriends } from "./Ballf With Your Friends/BallfWithYourFriends.js";
import { scenePlayColorClash } from "./Color Clash/playColorClash.js";
import { scenePlayCumulonimble } from "./Cumulonimble/playCumulonimble.js";
import { scenePlayFlappyBalls } from "./Flappy Balls/playFlappyBalls.js";
import { scenePlayHotPotato } from "./Hot Potato/playHotPotato.js";
import { scenePlayLightOnYourFeet } from "./Light On Your Feet/playLightOnYourFeet.js";
import { scenePlayMostWanted } from "./Most Wanted/playMostWanted.js";
import { scenePlayRowRace } from "./Row Race/playRowRace.js";
import { scenePlaySimonSays } from "./Simon Says/playSimonSays.js";
import { scenePlaySumo } from "./Sumo/playSumo.js";
import { sceneTitle, themeMusic } from "./titleScreen.js";

let errorMessage = '';

export let games = [];
export let gamesToString = [];
export function removeFirstGame () {
    console.log(`REMOVING ${games[0]}`)
    games.shift();
    gamesToString.shift();
}

export function removeRandomGame (number) {
    games.splice(number, 1);
    gamesToString.splice(number, 1);
}

function selectGame (game) {
    if (game === scenePlaySimonSays && gamepad.length !== player.length) {
        errorMessage = 'You must have the same amount of controllers as players to play Simon Says. Sorry!';
        setTimeout(() => {
            errorMessage = '';
        }, 5000);
    } else {
        games.push(game)
    
        gamesToString[games.length-1] = games[games.length-1].toString();
        gamesToString[games.length-1] = gamesToString[games.length-1].slice(18, gamesToString[games.length-1].indexOf('(') - 1);
        gamesToString[games.length-1] = gamesToString[games.length-1].split('');
        for (let j = 0; j < gamesToString[games.length-1].length; j++) {
            if (gamesToString[games.length-1][j].toUpperCase() === gamesToString[games.length-1][j] && j !== 0) {
                gamesToString[games.length-1].splice(j, 0, ' ');
                j+= 1;
            }
        }
        gamesToString[games.length-1] = gamesToString[games.length-1].join('')
    }
}

function selectAllGames () {
    if (games.indexOf(scenePlayBallfWithYourFriends) === -1) {
        games.push(scenePlayBallfWithYourFriends);
    }
    if (games.indexOf(scenePlayColorClash) === -1) {
        games.push(scenePlayColorClash);
    }
    if (games.indexOf(scenePlayCumulonimble) === -1) {
        games.push(scenePlayCumulonimble);
    }
    if (games.indexOf(scenePlayFlappyBalls) === -1) {
        games.push(scenePlayFlappyBalls);
    }
    if (games.indexOf(scenePlayHotPotato) === -1) {
        games.push(scenePlayHotPotato);
    }
    if (games.indexOf(scenePlayLightOnYourFeet) === -1) {
        games.push(scenePlayLightOnYourFeet);
    }
    if (games.indexOf(scenePlayMostWanted) === -1) {
        games.push(scenePlayMostWanted);
    }
    if (games.indexOf(scenePlayRowRace) === -1) {
        games.push(scenePlayRowRace);
    }
    if (games.indexOf(scenePlaySimonSays) === -1 && player.length <= 4 && gamepad.length >= player.length) {
        games.push(scenePlaySimonSays);
    }
    if (games.indexOf(scenePlaySumo) === -1) {
        games.push(scenePlaySumo);
    }

    for (let i = 0; i < games.length; i++) {
        gamesToString[i] = games[i].toString();
        gamesToString[i] = gamesToString[i].slice(18, gamesToString[i].indexOf('(') - 1);
        gamesToString[i] = gamesToString[i].split('');
        for (let j = 0; j < gamesToString[i].length; j++) {
            if (gamesToString[i][j].toUpperCase() === gamesToString[i][j] && j !== 0) {
                gamesToString[i].splice(j, 0, ' ');
                j+= 1;
            }
        }
        gamesToString[i] = gamesToString[i].join('')
    }
}

function deselectAllGames () {
    games = [];
}

function showSelectedGames () {
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = `${40*resScale()}px oswald`;
    c.textAlign = 'center';
    for (let i = 0; i < games.length; i++) {
        c.fillText(gamesToString[i], centerX, height*0.1 + i*50*resScale());
    }
}

function pauseMusicAndPlayGames(sceneToChangeTo) {
    themeMusic.pause();
    resetPlayerProperties();
    if (games.length < 1){
        selectAllGames();
    }
    if (!sceneToChangeTo) {
        sceneToChangeTo = games[0];
    }
    
    changeScene(sceneToChangeTo);
}

let i = 0;
export function sceneGameSelect() {
    renderBackground();
    c.globalAlpha = 0.5;
    c.drawImage(superBallManiaGameplay2, 0+i, 0, 1280*resScale()*1.5, 720*resScale()*1.5);
    
    c.globalAlpha = 1;
    c.drawImage(videoFrame, 0+i, 0, 1280*resScale()*1.5, 720*resScale()*1.5);
    i += 1;
    if (i > width) {
        i = -1280;
    }




    themeMusic.play();
    c.font = `${40*resScale()}px oswald`;
    c.textAlign = 'center';
    c.fillText(errorMessage, centerX, height*0.2);

    buttonPreviousScreen.draw(changeScene, sceneTitle, soundDeselect);
    buttonSelectAll.draw(selectAllGames);
    buttonDeselectAll.draw(deselectAllGames);



    buttonBallfWithYourFriends.draw(selectGame, scenePlayBallfWithYourFriends);
    buttonColorClash.draw(selectGame, scenePlayColorClash);
    buttonCumulonimble.draw(selectGame, scenePlayCumulonimble);
    buttonFlappyBalls.draw(selectGame, scenePlayFlappyBalls);
    buttonHotPotato.draw(selectGame, scenePlayHotPotato);
    buttonLightOnYourFeet.draw(selectGame, scenePlayLightOnYourFeet);
    buttonMostWanted.draw(selectGame, scenePlayMostWanted);
    buttonRowRace.draw(selectGame, scenePlayRowRace);
    buttonSimonSays.draw(selectGame, scenePlaySimonSays);
    buttonSumo.draw(selectGame, scenePlaySumo);


    moveButton(buttonPlayNow, undefined, height*0.925)
    buttonPlayNow.draw(pauseMusicAndPlayGames, games[0]);

    showSelectedGames();
}
