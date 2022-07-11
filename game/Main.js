export const canvas = document.getElementById('game');
export const c = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1080;
export let width = canvas.width;
export let height = canvas.height;
export let centerX = width/2;
export let centerY = height/2;

const fps = 60;
const fpsInterval = (1000 / fps).toFixed(5);

//videos
export let superBallManiaGameplay1 = new Image(); superBallManiaGameplay1.src = './videos/superBallManiaTeaser.mp4';
export let superBallManiaGameplay2 = document.getElementById('gameplay1');
export let videoFrame = new Image(); videoFrame.src = './videos/videoFrame.png';

//images
export let superBallManiaLogo = new Image(); superBallManiaLogo.src = './images/logoSmall.png'

//backgrounds
export let cumulonimbleBackground = new Image(); cumulonimbleBackground.src = './modules/scenes/Cumulonimble/background.png';
export let flappyBallsBackground = new Image(); flappyBallsBackground.src = './modules/scenes/Flappy Balls/background.png';
export let rowRaceTrack = new Image(); rowRaceTrack.src = './modules/scenes/Row Race/track.png';


//textures
export let brickTexture = new Image(); brickTexture.src = './modules/scenes/Most Wanted/brickTexture.png'
export let concreteTexture = new Image(); concreteTexture.src = './modules/scenes/Simon Says/concreteTexture.png';
export let conveyorBelt = new Image(); conveyorBelt.src = './modules/scenes/Simon Says/conveyorBelt.png';
export let glassTexture = new Image(); glassTexture.src = './modules/scenes/Sumo/glassTexture.jpg';
export let grassTexture = new Image(); grassTexture.src = './modules/scenes/Ballf With Your Friends/grassTexture.png';
export let golfBallTextureB = new Image(); golfBallTextureB.src = './modules/scenes/Ballf With Your Friends/golfBallTexture1.png';
export let golfBallTextureW = new Image(); golfBallTextureW.src = './modules/scenes/Ballf With Your Friends/golfBallTexture2.png';
export let lavaTexture = new Image(); lavaTexture.src = './modules/scenes/Sumo/lavaTexture.jpg';
export let pavementTexture = new Image(); pavementTexture.src = './modules/scenes/Sumo/pavementTexture.jpg';
export let waterTexture = new Image(); waterTexture.src = './modules/scenes/Row Race/waterTexture2.jpg';
export let woodTexture = new Image(); woodTexture.src = './modules/scenes/Ballf With Your Friends/woodTexture.png';



//sprites
//Ballf with your friends
export let flag = new Image(); flag.src = './modules/scenes/Ballf With Your Friends/flag.png';
export let cup = new Image(); cup.src = './modules/scenes/Ballf With Your Friends/cup.png';
//Cumulonimble
export let cloudSprite = [];
for (let i = 0; i < 7; i ++){
    cloudSprite[i] = new Image();
    cloudSprite[i].src = `./modules/scenes/Cumulonimble/clouds/${i}.png`;
}
//Flappy Balls
export let pipeTop = new Image(); pipeTop.src = './modules/scenes/Flappy Balls/pipeTop.png';
export let pipeBottom = new Image(); pipeBottom.src = './modules/scenes/Flappy Balls/pipeBottom.png';
//Hot Potato
export let smokeAnimation = [];
for (let i = 0; i < 91; i++) {
    smokeAnimation[i] = new Image();
    smokeAnimation[i].src = `./modules/scenes/Hot Potato/smokeSprites/00${i}.png`;
}
export let sparkAnimation = [];
for (let i = 0; i < 6; i++) {
    sparkAnimation[i] = new Image();
    sparkAnimation[i].src = `./modules/scenes/Hot Potato/sparkSprites/spark${i+1}.png`;
}
export let explosionAnimation = [];
for (let i = 0; i < 30; i++) {
    explosionAnimation[i] = new Image();
    explosionAnimation[i].src = `./modules/scenes/Hot Potato/explosionSprites/explosion_${i+2}.png`;
}
//Row Race
export let boatSprite = new Image(); boatSprite.src = './modules/scenes/Row Race/boat.png'
export let splashAnimation = []
for (let i = 0; i < 27; i++){
    splashAnimation[i] = new Image();
    splashAnimation[i].src = `./modules/scenes/Row Race/splashSprites/splash${i+1}.png`;
}
export let birdAnimation = [];
for (let i = 0; i < 8; i++){
    birdAnimation[i] = new Image();
    birdAnimation[i].src = `./modules/scenes/Row Race/birdSprites/bird${i}.png`;
}
//Simon Says
export let buttonPic = [];
for (let i = 0; i < 16; i++){
    if (i !== 8 && i !== 9) {
        buttonPic[i] = new Image();
        buttonPic[i].src = `./modules/scenes/Simon Says/buttonImages/${i}.png`
    }
}
//endGame 
export let confetti = [];
for (let i = 0; i < 59; i++) {
    confetti[i] = new Image();
    confetti[i].src = `./images/confetti/confetti_${i+1}.png`
}


import { sceneTitle } from './modules/scenes/titleScreen.js';

//listeners import
import { mouseX, mouseY, mouseclicked, mousedown, unclickMouse} from './modules/listeners/mouseListener.js';
import { initializeKeys, keys, keyCode, keyInputArray } from './modules/listeners/keyListener.js';
import { gamepadListener } from './modules/listeners/gamepadListener.js';
initializeKeys();

//players import
import { initializePlayers } from './modules/players.js';
initializePlayers();

//buttons import;
import { initializeTitleScreenButtons } from './modules/buttons.js'
initializeTitleScreenButtons();

import { initializeGameSelectButtons } from './modules/buttons.js'
initializeGameSelectButtons();

import { initializePlaySceneButtons } from './modules/buttons.js';
initializePlaySceneButtons();

import { initializePlayerButtons, buttonPlayer } from './modules/buttons.js';
initializePlayerButtons();

import { initializePlayerCustomizationButtons, buttonPlayerCustomizationOption } from './modules/buttons.js';
initializePlayerCustomizationButtons();

import { initializePlayerCustomizationInputs } from './modules/inputs.js';
initializePlayerCustomizationInputs();


import { spaceEvenly } from './modules/spaceEvenly.js';
spaceEvenly(buttonPlayer, true);
spaceEvenly(buttonPlayerCustomizationOption, false);

























































export let previousScene;
export function changeScene (changeTo){
    previousScene = scene
    scene = changeTo
}

function drawScene (sceneToDraw) {
    setInterval(function() {
        sceneToDraw();
        gamepadListener();

        sceneToDraw = scene;
        unclickMouse();
    }, fpsInterval)
}

export let scene = sceneTitle
drawScene(scene);