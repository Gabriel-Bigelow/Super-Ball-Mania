import { c, width, height, centerX, centerY, changeScene, canvas} from '../../Main.js';
import { renderBackground } from './background/background.js';
import { gamepad } from '../listeners/gamepadListener.js';
import { buttonRules, buttonPlayNow, buttonPlayerCustomization, moveButton, buttonKeyboardOnly } from '../buttons.js';

import { scenePlayerSelect } from './playerSelect.js';
import { sceneGameSelect } from './gameSelect.js';


export let themeMusic = new Audio('../../sounds/music/nerdyAndQuirky.mp3');

let keyboardOnly = false;

function keyboardOnlyButtonPressed () {
    keyboardOnly = true;
}

export function sceneTitle() {
    renderBackground();
    

    c.font = '40px oswald';
    c.textAlign = 'center';
    if (!gamepad[0] && !keyboardOnly){
        buttonKeyboardOnly.draw(keyboardOnlyButtonPressed);
        c.fillText('Press a button on a controller to initialize controllers.', centerX, height*0.9);
    } else { 
        themeMusic.play();
        if (!gamepad[0]) {
            c.fillText('Press a button on a controller to initialize controllers.', centerX, height*0.9);
        } else {
            c.fillText('Gamepads connected.', centerX, height*0.9);
        }

        moveButton(buttonPlayNow, undefined, centerY+centerY*5/11)
        buttonPlayNow.draw(changeScene, sceneGameSelect);
        buttonPlayerCustomization.draw(changeScene, scenePlayerSelect);
        buttonRules.draw();
    };    
}