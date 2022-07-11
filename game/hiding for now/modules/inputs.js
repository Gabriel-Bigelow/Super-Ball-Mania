import { c, width, height, centerX, centerY } from '../Main.js';
import { centerRect, centerStrokeRect, ellipse } from './drawShapes.js';
import { keyCode, keyInputArray } from './listeners/keyListener.js';
import { mouseX, mouseY, mousedown } from './listeners/mouseListener.js';
import { gamepad } from './listeners/gamepadListener.js';
import { Button } from './buttons.js';

import { player } from './players.js';
import { selectedPlayer } from './scenes/playerSelect.js';

import { spaceEvenly } from './spaceEvenly.js';

export class Input {
    constructor (x, y, inputWidth, inputHeight, inputType, text, textColor){
        this.x = x;
        this.y = y;
        this.inputWidth = inputWidth;
        this.inputHeight = inputHeight;
        this.inputType = inputType;
        this.input = [];
        this.fontSize = centerX/32;
        this.text = text;

        this.textColor = textColor;
        this.textCursorX = this.x;
        this.textCursorFrames = 0;

        this.colorGrabbed = [];

        this.keysAssignedTo = [];
        this.controllerAssignedTo = [];
        this.bindingInProgress = false;
        this.controllerType;
        this.actionToBind;
    }
    draw () {
        c.fillStyle = 'rgb(255, 255, 255)';
        centerRect(this.x, this.y, this.inputWidth, this.inputHeight);
        c.fillStyle = 'rgb(0, 0, 0)';
        c.font = `${this.fontSize}px Oswald`;
        c.fillText(this.text, centerX, this.y-this.inputHeight/2 + this.fontSize*3/2);
        
        if (this.inputType === 'text'){
            this.inputText();
        }
        if (this.inputType === 'color'){
            this.inputColorSlider();
        }

        if (this.inputType === 'controls'){
            this.inputControls();
        }
        keyInputArray.pop();
    }
    inputText () {
        this.textCursorFrames += 1;
        if (this.textCursorFrames % 70 < 35 && this.input.length === 0) {
            c.fillStyle = 'rgb(0, 0, 0)';
        } else {
            c.fillStyle = 'rgb(255, 255, 255)';
        }
        centerRect(this.x, this.y+this.inputHeight/24, 2.5, this.inputHeight/3);
        c.fillStyle = this.textColor;
        c.font = `${this.inputHeight/3}px oswald`;
        c.fillText(this.input.join(''), this.x, this.y+this.inputHeight/6);
        if ((keyCode >= 65 && keyCode <= 90 || keyCode === 32 || keyCode >= 48 && keyCode <= 57 || keyCode >= 107 && keyCode <= 111 || keyCode >= 186 && keyCode <= 222) && keyInputArray[0] && this.input.length <= 16){
            this.input.push(keyInputArray[0].key);
        }
        if (keyInputArray[0] && keyCode === 8){
            this.input.pop();
        }
    }
    inputColorSlider () {
        function changeBy(color, number) {
            inputColor.colorGrabbed[color] += number;
        }
        let incrementButton = []
        //DELETE THIS --- when you get the spaceEvenly() function figured out and able to accept splitting x rows
        incrementButton[0] = new Button(inputColor.x-width*2/9, inputColor.y-inputColor.inputHeight/6, 40, 40, '-');
        incrementButton[1] = new Button(inputColor.x-width*2/9, inputColor.y+inputColor.inputHeight/12, 40, 40, '-');
        incrementButton[2] = new Button(inputColor.x-width*2/9, inputColor.y+inputColor.inputHeight/3, 40, 40, '-');
        incrementButton[3] = new Button(inputColor.x+width*2/9, inputColor.y-inputColor.inputHeight/6, 40, 40, '+');
        incrementButton[4] = new Button(inputColor.x+width*2/9, inputColor.y+inputColor.inputHeight/12, 40, 40, '+');
        incrementButton[5] = new Button(inputColor.x+width*2/9, inputColor.y+inputColor.inputHeight/3, 40, 40, '+');
        for (let i = 0; i < incrementButton.length; i++){
            let j = i % 3;
            incrementButton[i].fontSize = 40;
            if (i <= 2) { incrementButton[i].draw(changeBy, j, undefined, -1); };
            if (i > 2) { incrementButton[i].draw(changeBy, j, undefined, 1); };
        }

        //slider tracks
        c.strokeStyle = 'rgb(0, 0, 0)';
        centerStrokeRect (this.x, this.y-this.inputHeight/6, width*2/5, 4);
        centerStrokeRect (this.x, this.y+this.inputHeight/12, width*2/5, 4);
        centerStrokeRect (this.x, this.y+this.inputHeight/3, width*2/5, 4);

        //rgb value per slider track
        c.fillStyle = 'rgb(0, 0, 0)';
        c.fillText(this.colorGrabbed[0].toFixed(0), this.x-11/40*width, this.y-this.inputHeight/6 + this.inputHeight/16);
        c.fillText(this.colorGrabbed[1].toFixed(0), this.x-11/40*width, this.y+this.inputHeight/12 + this.inputHeight/16);
        c.fillText(this.colorGrabbed[2].toFixed(0), this.x-11/40*width, this.y+this.inputHeight/3 + this.inputHeight/16);

        //sliders
        let redSliderX = Math.floor(this.x-width/5+this.colorGrabbed[0]*3);
        let greenSliderX = Math.floor(this.x-width/5+this.colorGrabbed[1]*3);
        let blueSliderX = Math.floor(this.x-width/5+this.colorGrabbed[2]*3);
        let sliderWidth = 20;
        let sliderHeight = 40;
        inputColor.colorGrabbed[0] = Math.floor(Math.max(Math.min(inputColor.colorGrabbed[0], 255), 0))
        inputColor.colorGrabbed[1] = Math.floor(Math.max(Math.min(inputColor.colorGrabbed[1], 255), 0))
        inputColor.colorGrabbed[2] = Math.floor(Math.max(Math.min(inputColor.colorGrabbed[2], 255), 0))
        if (mousedown && mouseX > this.x-width/5-sliderWidth/2 && mouseX < this.x+width/5+sliderWidth/2 && mouseY > this.y-this.inputHeight/6 - sliderHeight/2 && mouseY < this.y-this.inputHeight/6 + sliderHeight/2){
            this.colorGrabbed[0] = (mouseX +width/5-this.x)/3
        }
        if (mousedown && mouseX > this.x-width/5-sliderWidth/2 && mouseX < this.x+width/5+sliderWidth/2 && mouseY > this.y+this.inputHeight/12 - sliderHeight/2 && mouseY < this.y + this.inputHeight/12 + sliderHeight/2){
            this.colorGrabbed[1] = (mouseX +width/5-this.x)/3
        }
        if (mousedown && mouseX > this.x-width/5-sliderWidth/2 && mouseX < this.x+width/5+sliderWidth/2 && mouseY > this.y+this.inputHeight/3 - sliderHeight/2 && mouseY < this.y + this.inputHeight/3 + sliderHeight/2){
            this.colorGrabbed[2] = (mouseX +width/5-this.x)/3
        }

        //preview
        c.fillText('Preview', this.x + this.inputWidth*4/9, this.y-player[selectedPlayer].size*2/3);
        ellipse(this.x + this.inputWidth*4/9, this.y, 102, `rgb(0, 0, 0)`);
        ellipse(this.x + this.inputWidth*4/9, this.y, player[selectedPlayer].size, `rgb(${inputColor.colorGrabbed[0]}, ${inputColor.colorGrabbed[1]}, ${inputColor.colorGrabbed[2]})`);
        console.log(`rgb(${inputColor.colorGrabbed[0]}, ${inputColor.colorGrabbed[1]}, ${inputColor.colorGrabbed[2]})`)
        c.fillStyle = 'rgb(255, 0, 0)';
        centerRect(redSliderX, this.y-this.inputHeight/6, sliderWidth, sliderHeight);
        centerStrokeRect(redSliderX, this.y-this.inputHeight/6, sliderWidth, sliderHeight);
        c.fillStyle = 'rgb(0, 255, 0)';
        centerRect(greenSliderX, this.y+this.inputHeight/12, sliderWidth, sliderHeight);
        centerStrokeRect(greenSliderX, this.y+this.inputHeight/12, sliderWidth, sliderHeight);
        c.fillStyle = 'rgb(0, 0, 255)';
        centerRect(blueSliderX, this.y+this.inputHeight/3, sliderWidth, sliderHeight);
        centerStrokeRect(blueSliderX, this.y+this.inputHeight/3, sliderWidth, sliderHeight);
        this.input = `rgb(${this.colorGrabbed[0]}, ${this.colorGrabbed[1]}, ${this.colorGrabbed[2]})`;
    }
    inputControls () {
        let buttonYAlign = this.y-this.inputHeight/12;
        let buttonBack = new Button(this.x - this.inputWidth/2+60, this.y-this.inputHeight/2+60, 100, 100, 'Back');

        let buttonLeft = new Button (this.x - 300, buttonYAlign, 200, 100, 'LEFT');
        let buttonUp = new Button (this.x, buttonYAlign, 200, 100, 'UP');
        let buttonRight = new Button (this.x + 300, buttonYAlign, 200, 100, 'RIGHT');
        let buttonDown = new Button (this.x - 300, buttonYAlign + 100, 200, 100, 'DOWN');
        let buttonSprint = new Button (this.x + 300, buttonYAlign + 100, 200, 100, 'SPRINT');
        let controls = [buttonLeft, buttonUp, buttonRight, buttonDown, buttonSprint];
        for (let i = 0; i < controls.length; i++) {
            controls[i].id = i;
        }
        //spaceEvenly(controls, true, 50, 100);
        let buttonKeyboard = new Button(200, this.y, 200, 100, 'KEYBOARD');
        let buttonController = new Button(400, this.y, 200, 100, 'CONTROLLER');
        let controlSchemes = [buttonKeyboard, buttonController]
        spaceEvenly(controlSchemes);
        let button0 = new Button(this.x + this.inputWidth*3/10, this.y-this.inputHeight/4, 100, 100, '1');
        let button1 = new Button(this.x + this.inputWidth*4/10, this.y-this.inputHeight/4, 100, 100, '2');
        let button2 = new Button(this.x + this.inputWidth*3/10, this.y+this.inputHeight/4, 100, 100, '3');
        let button3 = new Button(this.x + this.inputWidth*4/10, this.y+this.inputHeight/4, 100, 100, '4');
        let controllerButtons = [button0, button1, button2, button3];
        for (let i = 0; i < controllerButtons.length; i++){
            if (this.controllerAssignedTo[i] || this.controllerAssignedTo[i] === 0) { controllerButtons[i].innerColor = player[inputControls.controllerAssignedTo[i]].clr}
        }
        
        function deselectControlScheme () {
            inputControls.controllerType = undefined;
        }
        function selectControlScheme (controllerType) {
            inputControls.controllerType = controllerType;
        }
        function checkForAssignedKeys (inputNumber, button, inputName) {
            if (inputName.keysAssignedTo[inputName.input[inputNumber].keyCode]){ 
                button.innerColor = inputName.keysAssignedTo[inputName.input[inputNumber].keyCode].color;
                return true;
            } else { button.innerColor = player[selectedPlayer].clr; }
        }
        function selectControllerNumber (number) {
            inputControls.controllerNumber = number;
        }
        function bindButton (buttonID) {
            inputControls.bindingInProgress = true;
            inputControls.actionToBind = buttonID;
        }
        if (this.bindingInProgress){
            if (this.controllerType === 'keyboard'){
                if (keyInputArray[0] && (keyCode >= 65 && keyCode <= 90 || keyCode === 32 || keyCode >= 48 && keyCode <= 57 || keyCode >= 107 && keyCode <= 111 || keyCode >= 186 && keyCode <= 222 || keyCode >= 37 && keyCode <= 40 || keyCode === 16 || keyCode === 18 || keyCode === 20) && keyInputArray[0]){
                    this.input[this.actionToBind] = keyInputArray[0]
                    this.bindingInProgress = false;
                }
            }            
        }

        let leftBind;
        let upBind;
        let rightBind;
        let downBind;
        let sprintBind;
        if (!this.controllerType) {
            this.text = `Select a controller type to assign to ${player[selectedPlayer].name}`
            buttonKeyboard.draw(selectControlScheme, 'keyboard');
            buttonController.draw(selectControlScheme, 'gamepad');
        } else if (this.controllerType === 'gamepad'){
            if (!gamepad[0]) { this.text = 'Press a button on a controller to initialize controllers'}
            else { this.text = `Select a controller to assign to ${player[selectedPlayer].name}` }
            this.input[0] = 0;
            this.input[1] = 1;
            this.input[2] = 0;
            this.input[3] = 1;
            this.input[4] = 1;
            if (this.controllerNumber || this.controllerNumber === 0){
                controllerButtons[this.controllerNumber].innerColor = player[selectedPlayer].clr;
                c.fillText(`controller: ${this.controllerNumber + 1}`, this.x, this.y);
                c.fillText(`Movement: Left Joystick || X-Axis: ${gamepad[this.controllerNumber].axes[this.input[0]]}     Y-Axis:${gamepad[this.controllerNumber].axes[this.input[1]]}`, this.x, this.y + this.inputHeight/5);
                c.fillText(`Sprint: B button: ${gamepad[this.controllerNumber].buttons[this.input[4]].pressed}`.toUpperCase(), this.x, this.y + this.inputHeight*2/5);
            }
            if (gamepad[0]) { button0.draw(selectControllerNumber, 0); }
            if (gamepad[1]) { button1.draw(selectControllerNumber, 1); }
            if (gamepad[2]) { button2.draw(selectControllerNumber, 2); }
            if (gamepad[3]) { button3.draw(selectControllerNumber, 3); }

            buttonBack.draw(deselectControlScheme);
        } else if (this.controllerType === 'keyboard'){
            this.text = 'Select an action to bind to a key';
            if (this.input[0]) { 
                leftBind = `Left: ${this.input[0].key}`;
                if (checkForAssignedKeys(0, buttonLeft, inputControls)) { leftBind = `bound to: P${this.keysAssignedTo[this.input[0].keyCode].player +1}`};
                c.fillText(leftBind.toUpperCase(), this.x-this.inputWidth/3, this.y); 
            }
            if (this.input[1]) {
                upBind = `Up: ${this.input[1].key}`
                if (checkForAssignedKeys(1, buttonUp, inputControls)) { upBind = `bound to: P${this.keysAssignedTo[this.input[1].keyCode].player +1}`};
                c.fillText(upBind.toUpperCase(), this.x, this.y + this.inputHeight/3); 
            }
            if (this.input[2]) { 
                rightBind = `Right: ${this.input[2].key}`
                if (checkForAssignedKeys(2, buttonRight, inputControls)) { rightBind = `bound to: P${this.keysAssignedTo[this.input[2].keyCode].player +1}`};
                c.fillText(rightBind.toUpperCase(), this.x+this.inputWidth/3, this.y); 
            }
            if (this.input[3]) { 
                downBind = `Down: ${this.input[3].key}`
                if (checkForAssignedKeys(3, buttonDown, inputControls)) { downBind = `bound to: P${this.keysAssignedTo[this.input[3].keyCode].player +1}`};
                c.fillText(downBind.toUpperCase(), this.x-this.inputWidth/3, this.y+this.inputHeight/3); 
            }
            if (this.input[4]) {
                sprintBind = `Sprint: ${this.input[4].key}`;
                if (checkForAssignedKeys(4, buttonSprint, inputControls)) { sprintBind = `bound to: P${this.keysAssignedTo[this.input[4].keyCode].player +1}`};
                c.fillText(sprintBind.toUpperCase(), this.x+this.inputWidth/3, this.y+this.inputHeight/3); 
            }
            
            buttonBack.draw(deselectControlScheme);
            buttonLeft.draw(bindButton, 0);
            buttonUp.draw(bindButton, 1);
            buttonRight.draw(bindButton, 2);
            buttonDown.draw(bindButton, 3);
            buttonSprint.draw(bindButton, 4);
        }
    }
    clearInputs () {
        this.input = [];
        this.colorGrabbed = [];
        this.bindingInProgress = false;
        this.controllerType = undefined;
        this.controllerNumber = undefined;
        this.actionToBind = undefined;
    }
}




export let inputName, inputColor, inputControls;

export function initializePlayerCustomizationInputs () {
    inputName = new Input(centerX, centerY+height/5, width*2/5, height/5, 'text', 'Enter a name (up to 16 characters)', 'rgb(0, 0, 0)');
    inputColor = new Input(centerX, centerY+height/5, width*4/5, height/4, 'color', 'Click and drag the sliders, or click the [-] and [+] buttons to adjust color.', 'rgb(0, 0, 0)');
    inputControls = new Input(centerX, centerY+height/5, width*4/5, height/4, 'controls', 'Click an action to bind a button');
}
    