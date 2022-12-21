import { c, width, height, centerX, centerY, changeScene, superBallManiaLogo, superBallManiaGameplay1, superBallManiaGameplay2, videoFrame, resScale} from '../../Main.js';
import { renderBackground } from './background/background.js';
import { gamepad } from '../listeners/gamepadListener.js';
import { buttonPlayNow, buttonPlayerCustomization, moveButton, buttonKeyboardOnly, buttonFullscreen, fullscreen, buttonCloseGame, closeGame, buttonControls, buttonCredits } from '../buttons.js';
import { scenePlayerSelect } from './playerSelect.js';
import { sceneGameSelect } from './gameSelect.js';
import { player } from '../players.js';
import { image } from '../drawShapes.js';
import { sceneControls } from './controls.js';
import { resetGameFlappyBalls } from './Flappy Balls/playFlappyBalls.js';
import { resetGameBallfWithYourFriends } from './Ballf With Your Friends/BallfWithYourFriends.js';
import { resetGameCumulonimble } from './Cumulonimble/playCumulonimble.js';
import { resetGameColorClash } from './Color Clash/playColorClash.js';
import { resetGameHotPotato } from './Hot Potato/playHotPotato.js';
import { resetGameLightOnYourFeet } from './Light On Your Feet/playLightOnYourFeet.js';
import { resetGameMostWanted } from './Most Wanted/playMostWanted.js';
import { resetGameRowRace } from './Row Race/playRowRace.js';
import { resetGameSimonSays } from './Simon Says/playSimonSays.js';
import { sceneCredits } from './credits.js';
import { gamepadMenuControls } from '../listeners/gamepadMenuControls.js';
import { resetGameSumo } from './Sumo/playSumo.js';

export let themeMusic = new Audio('../../sounds/music/nerdyAndQuirky.mp3');

let keyboardOnly = false;
function keyboardOnlyButtonPressed () {
    keyboardOnly = true;
}


function animateBackground () {
    for (let i = 0; i < player.length; i++) {
        if (player[i].x === 0 && player[i].y === 0) {
            player[i].x = Math.floor(Math.random() * 1920);
            player[i].y = Math.floor(Math.random() * 1080);
        }
        player[i].draw();
        player[i].momentum();
        for (let j = i; j < player.length; j++){
            if ( j !== i ){
                player[i].checkForPlayerCollision(j);
            }    
        }

        if (i === player.length-1) {
            if (player[i].x < centerX) {
                player[i].east();
            }
            if (player[i].x > centerX) {
                player[i].west();
            }
            if (player[i].y < centerY) {
                player[i].south();
            }
            if (player[i].y > centerY) {
                player[i].north();
            }
        } else {
            if (player[i].x < player[i+1].x){
                player[i].east();
            }
            if (player[i].x > player[i+1].x){
                player[i].west();
            }
            if (player[i].y < player[i+1].y){
                player[i].south();
            }
            if (player[i].y > player[i+1].y){
                player[i].north();
            }
        }
    }
}

let startNewGame = false;
export function resetGames () {
    startNewGame = true;
}

export function sceneTitle() {
    renderBackground();
    animateBackground();

    c.font = `${40*resScale()}px oswald`;
    c.textAlign = 'center';
    c.fillStyle = 'rgb(255, 255, 255)';
    if (!gamepad[0] && !keyboardOnly){
        c.fillText('Press a button on a controller to initialize controllers.', centerX, height*0.9);
        buttonKeyboardOnly.draw(keyboardOnlyButtonPressed);
    } else { 
        themeMusic.play();
        if (!gamepad[0]) {
            c.fillText('Press a button on a controller to initialize controllers.', centerX, height*0.9);
        } else {
            if (gamepad.length === 1) {
                c.fillText(`${gamepad.length} gamepad connected.`, centerX, height*0.9);
            } else {
                c.fillText(`${gamepad.length} gamepads connected.`, centerX, height*0.9);
            }
        }
        buttonCloseGame.y + buttonCloseGame.buttonHeight + buttonCloseGame.buttonHeight/3*resScale();
        moveButton(buttonPlayNow, undefined, height*0.75)
        buttonPlayNow.draw(changeScene, sceneGameSelect);
        buttonPlayerCustomization.draw(changeScene, scenePlayerSelect);
        buttonControls.draw(changeScene, sceneControls);
    };

    image(superBallManiaLogo, centerX, height*0.25, 1*resScale());
    buttonFullscreen.draw(fullscreen);
    buttonCloseGame.draw(closeGame);
    
    buttonCredits.draw(changeScene, sceneCredits);


    if (startNewGame) {
        resetGameBallfWithYourFriends();
        resetGameColorClash();
        resetGameCumulonimble();
        resetGameFlappyBalls();
        resetGameHotPotato();
        resetGameLightOnYourFeet();
        resetGameMostWanted();
        resetGameRowRace();
        resetGameSimonSays();
        resetGameSumo();
        startNewGame = false;
    }
}