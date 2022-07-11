import { c, width, height, centerX, centerY, changeScene} from '../../Main.js';
import { renderBackground } from './background/background.js';
//delete this
//import { mouseclicked } from '../listeners/mouseListener.js';

import { player } from '../players.js';
import { selectedPlayer } from './playerSelect.js';

import { buttonPlayer, buttonPlayerName, buttonPlayerColor, buttonPlayerRunningSound, buttonPlayerControls, buttonPlayerCustomizationOption, buttonSave, save, buttonPreviousScreen, soundDeselect } from '../buttons.js'

import { inputName, inputColor, inputControls} from '../inputs.js';
import { keys } from '../listeners/keyListener.js';

import { colorChanger } from '../colors.js';







import { scenePlayerSelect } from "./playerSelect.js";
import { themeMusic } from './titleScreen.js';

export function scenePlayerCustomization () {
    renderBackground();
    themeMusic.play();
    c.font = "100px Oswald"
    c.fillText(`Customize ${player[selectedPlayer].name}`, width/2, height/8);
    
    for (let i = 0; i < buttonPlayerCustomizationOption.length; i++){
        buttonPlayerCustomizationOption[i].innerColor = player[selectedPlayer].clr;
        if (colorChanger(player[selectedPlayer].clr, 0, 0, 0, false, true) > 180){
            buttonPlayerCustomizationOption[i].textColor = 'rgb(0, 0, 0)';
        } else { 
            buttonPlayerCustomizationOption[i].textColor = 'rgb(255, 255, 255)'; 
        }
    }
    function changeName () {
        menu = 0;
    }
    function saveName (name) {
        player[selectedPlayer].name = name.input.join('');
        buttonPlayer[selectedPlayer].text = player[selectedPlayer].name;
        name.input = [];
        menu = undefined;
    }
    function changeColor () {
        menu = 1;
        inputColor.colorGrabbed[0] = colorChanger(player[selectedPlayer].clr, 0, 0, 0, true);
        inputColor.colorGrabbed[1] = colorChanger(player[selectedPlayer].clr, 0, 0, 0, false, true);
        inputColor.colorGrabbed[2] = colorChanger(player[selectedPlayer].clr, 0, 0, 0, false, false, true);
    }
    function saveColor (color) {
        player[selectedPlayer].clr = color.input;
        menu = undefined;
    }
    function changeControls () {
        menu = 3;
    }
    function saveControls (controls) {
        player[selectedPlayer].controllerType = controls.controllerType;
        if (player[selectedPlayer].controllerType === 'keyboard'){
            player[selectedPlayer].boundLeft = controls.input[0];
            player[selectedPlayer].boundUp = controls.input[1];
            player[selectedPlayer].boundRight = controls.input[2];
            player[selectedPlayer].boundDown = controls.input[3];
            player[selectedPlayer].boundSprint = controls.input[4];
            controls.keysAssignedTo[controls.input[0].keyCode] = { player: selectedPlayer, color: player[selectedPlayer].clr };
            controls.keysAssignedTo[controls.input[1].keyCode] = { player: selectedPlayer, color: player[selectedPlayer].clr };
            controls.keysAssignedTo[controls.input[2].keyCode] = { player: selectedPlayer, color: player[selectedPlayer].clr };
            controls.keysAssignedTo[controls.input[3].keyCode] = { player: selectedPlayer, color: player[selectedPlayer].clr };
            controls.keysAssignedTo[controls.input[4].keyCode] = { player: selectedPlayer, color: player[selectedPlayer].clr };
        }
        if (player[selectedPlayer].controllerType === 'gamepad'){
            player[selectedPlayer].cNum = controls.controllerNumber;
            player[selectedPlayer].boundLeft = controls.input[0]
            player[selectedPlayer].boundUp = controls.input[1]
            player[selectedPlayer].boundRight = controls.input[2]
            player[selectedPlayer].boundDown = controls.input[3]
            player[selectedPlayer].boundSprint = controls.input[4]
            inputControls.controllerAssignedTo[inputControls.controllerNumber] = selectedPlayer;
        }
        inputControls.controllerType = undefined;
        inputControls.controllerNumber = undefined;
        inputControls.input = [];
        menu = undefined;
    }
    function showMenu () {
        if (menu === 0){
            inputName.draw()
            buttonSave.draw(saveName, inputName, save);
            if (keys[13].returnValue) { saveName(inputName); };
        }
        if (menu === 1){
            inputColor.draw();
            buttonSave.draw(saveColor, inputColor, save);
        }
        if (menu === 2){

        }
        if (menu === 3){
            inputControls.draw();
            buttonSave.draw(saveControls, inputControls, save);
        }
    }
    function clearInputsAndGoBack () {
        inputName.clearInputs();
        inputColor.clearInputs();
        inputControls.clearInputs();
        menu = undefined;
        changeScene(scenePlayerSelect)
    }
    showMenu();
    player[selectedPlayer].x = centerX;
    player[selectedPlayer].y = height/4;
    player[selectedPlayer].draw();
    buttonPlayerName.draw(changeName);
    buttonPlayerColor.draw(changeColor);
    buttonPlayerRunningSound.draw();
    buttonPlayerControls.draw(changeControls);
    buttonPreviousScreen.draw(clearInputsAndGoBack, undefined, soundDeselect);
}





let menu;