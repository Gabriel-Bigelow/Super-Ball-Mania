import { c, width, height, centerX, centerY, changeScene, superBallManiaLogo, superBallManiaGameplay1, superBallManiaGameplay2, videoFrame} from '../../Main.js';
import { renderBackground } from './background/background.js';
import { gamepad } from '../listeners/gamepadListener.js';
import { buttonPlayNow, buttonPlayerCustomization, moveButton, buttonKeyboardOnly, buttonFullscreen, fullscreen, buttonCloseGame, closeGame, buttonControls } from '../buttons.js';
import { scenePlayerSelect } from './playerSelect.js';
import { sceneGameSelect } from './gameSelect.js';
import { player } from '../players.js';
import { image } from '../drawShapes.js';
import { sceneControls } from './controls.js';

export let themeMusic = new Audio('../../sounds/music/nerdyAndQuirky.mp3');

let keyboardOnly = false;
function keyboardOnlyButtonPressed () {
    keyboardOnly = true;
}



let selectedMenu = 0;
function gamepadCursor () {
    if (selectedMenu === 0) {

    }
    if (gamepad[0].buttons[0]) {
    }
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


export function sceneTitle() {
    renderBackground();
    animateBackground();



    c.font = '40px oswald';
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
            c.fillText('Gamepads connected.', centerX, height*0.9);
            gamepadCursor();
        }

        moveButton(buttonPlayNow, undefined, height*0.75)
        buttonPlayNow.draw(changeScene, sceneGameSelect);
        buttonPlayerCustomization.draw(changeScene, scenePlayerSelect);
        buttonControls.draw(changeScene, sceneControls);
    };

    image(superBallManiaLogo, centerX, height*0.25);
    buttonFullscreen.draw(fullscreen);
    buttonCloseGame.draw(closeGame);
}