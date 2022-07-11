import { c, width, height, centerX, centerY } from '../Main.js';
import { mouseX, mouseY, mouseclicked, mousedown } from './listeners/mouseListener.js';
import { colorChanger } from './colors.js';
import { player } from './players.js';


//MENU sounds
export let soundSelect = new Audio('./sounds/menu/select.mp3');
export let soundDeselect = new Audio('./sounds/menu/deselect.mp3');
export let save = new Audio ('./sounds/menu/save.mp3')

export class Button {
    constructor (x, y, buttonWidth, buttonHeight, text) {
        this.x = x;
        this.y = y;
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
        this.left = this.x - buttonWidth/2;
        this.top = this.y - buttonHeight/2;
        this.right = this.left + buttonWidth;
        this.bottom = this.top + buttonHeight;
        this.buttonOutline = 5;
        this.fontSize = buttonHeight/4;
        this.text = text;
        this.textColor = 'rgb(255, 255, 255)';
        this.outlineColor = 'rgb(255, 255, 255)';
        this.innerColor = 'rgb(20, 20, 20)';
        this.originalColor = this.innerColor;
        this.hovered = false;
        this.transitionFrames = 0;
        this.sound = soundSelect;
    }
    draw (thingToDo, argument, sound, argument2, change1, change2, change3) {
        //outline
        c.lineWidth = 2.5;
        c.strokeStyle = this.outlineColor;
        c.fillStyle = this.outlineColor;
        c.fillRect(this.left, this.top, this.buttonWidth, this.buttonHeight);
        //background color
        c.fillStyle = this.innerColor;
        c.fillRect(this.left + this.buttonOutline/2, this.top + this.buttonOutline/2, this.buttonWidth - this.buttonOutline, this.buttonHeight - this.buttonOutline);
        //inner text
        c.textAlign = 'center';
        c.fillStyle = this.textColor;
        c.font = `${this.fontSize}px oswald`;
        c.fillText(`${this.text}`, this.x, this.y + this.fontSize*3/8);
        if (mouseX > this.left && mouseX < this.right && mouseY > this.top && mouseY < this.bottom) {
            this.hovered = true;
            this.buttonFunction(thingToDo, argument, sound, argument2);
        } else {
            this.hovered = false;
        }
        if (change1 || change1 === 0) { this.changeButtonColor(10, change1, change2, change3) }
        if (!change1 && change1 !== 0) { this.changeButtonColor(10, 0, 40, 100); }       
    }
    changeButtonColor (transition, change1, change2, change3) {
        if (!transition || transition < 1){
            transition = 1;
        }
        if (!change3 && change3 !== 0){
            change2 = change1;
            change3 = change1;
        }
        let changedColor = colorChanger(this.originalColor, change1, change2, change3);
        if (mousedown && this.hovered){
            this.innerColor = colorChanger(changedColor, -change1/2, -change2/2, -change3/2);
            this.transitionFrames = transition/2;
        }
        if (this.hovered && this.transitionFrames < transition){
            this.innerColor = colorChanger(this.innerColor, change1/transition, change2/transition, change3/transition);
            this.transitionFrames +=  1;
        } else if (!this.hovered && this.transitionFrames > 0){
            this.innerColor = colorChanger(this.innerColor, -change1/transition, -change2/transition, -change3/transition);
            this.transitionFrames -= 1;
        }
        c.strokeRect(this.left-this.transitionFrames, this.top-this.transitionFrames, this.buttonWidth+this.transitionFrames*2, this.buttonHeight+this.transitionFrames*2);
    }
    buttonFunction (functionToApply, argument, sound, argument2) {
        if (mouseclicked){
            if (!sound) { sound = new Audio('./sounds/menu/select.mp3') };
            sound.play();
            if (functionToApply){
                functionToApply(argument, argument2);
            }   
        }
    }
}

export function moveButton (button, x, y) {
    if (x) {
        button.x = x;
    }
    if (y) {
        button.y = y;
    }    
    button.left = button.x - button.buttonWidth/2;
    button.top = button.y - button.buttonHeight/2;
    button.right = button.left + button.buttonWidth;
    button.bottom = button.top + button.buttonHeight;
}




export let buttonKeyboardOnly, buttonRules, buttonPlayNow, buttonPlayerCustomization, buttonPreviousScreen, buttonNewGame;
export function initializeTitleScreenButtons () {
    buttonKeyboardOnly = new Button(centerX, height*0.75, 300, 100, 'Keyboard Only');
    buttonPlayNow = new Button(centerX, centerY+centerY*5/11, 300, 100, 'Play Now');
    buttonPlayerCustomization = new Button(centerX+width*5/24, centerY+centerY*5/11, 300, 100, 'Character Customization');
    buttonRules = new Button(centerX + width*5/24, centerY+centerY*2/11, 300, 100, 'How To Play');
    buttonPreviousScreen = new Button(width/9, height/11, 150, 100, 'Back');
    buttonAddPlayer = new Button(width - width/10, height/5, 200, 100, 'Add Player');
    buttonRemovePlayer = new Button(width - width/10, height*3/10, 200, 100, 'Remove Player');
    buttonNewGame = new Button(centerX, height*0.2, 150, 100, 'New Game');
}

export let buttonSelectAll, buttonDeselectAll;
export function initializeGameSelectButtons () {
    buttonSelectAll = new Button(width*0.9, height/11, 200, 100, 'Select All');
    buttonDeselectAll = new Button(width*0.9, height*2/11 + 25, 200, 100, 'Deselect All');
}


export let buttonMainMenu, buttonCloseGame;
export function initializePlaySceneButtons () {
    buttonMainMenu = new Button(width-120, 70, 200, 100, 'Main Menu');
    buttonCloseGame = new Button(width-120, 270, 200, 100, 'Close Game');
}



export let buttonPlayer = []
export let buttonAddPlayer, buttonRemovePlayer;
export function initializePlayerButtons () {
    for(let i = 0; i < player.length; i++){
        buttonPlayer[i] = new Button(0, height/2, 300, 100, `${player[i].name}`);
        buttonPlayer[i].id = i;
    }
}



export let buttonPlayerName, buttonPlayerColor, buttonPlayerRunningSound, buttonPlayerControls, buttonSave;
export let buttonPlayerCustomizationOption = [];
export function initializePlayerCustomizationButtons () {
    buttonPlayerName = new Button(0, height/2, width*5/32, height*5/54, 'Change Name');
    buttonPlayerColor = new Button(0, height/2, width*5/32, height*5/54, 'Change Color');
    buttonPlayerRunningSound = new Button(0, height/2, width*5/32, height*5/54, 'Running Sound');
    buttonPlayerControls = new Button(0, height/2, width*5/32, height*5/54, 'Change Controls');
    buttonPlayerCustomizationOption = [buttonPlayerName, buttonPlayerColor, buttonPlayerRunningSound, buttonPlayerControls];
    buttonSave = new Button(centerX, height*0.9, 100, 100, 'Save');
}

