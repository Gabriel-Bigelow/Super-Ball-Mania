import { c, width, height, centerX, centerY, canvas, resScale } from '../Main.js';
import { mouseX, mouseY, mouseclicked, mousedown } from './listeners/mouseListener.js';
import { colorChanger } from './colors.js';
import { player } from './players.js';
import { spaceEvenly } from './spaceEvenly.js';
import { gamepadCursorX, gamepadCursorY } from './listeners/gamepadMenuControls.js';


//MENU sounds
export let soundSelect = new Audio('./sounds/menu/select.mp3');
export let soundDeselect = new Audio('./sounds/menu/deselect.mp3');
export let save = new Audio ('./sounds/menu/save.mp3')

export class Button {
    constructor (x, y, buttonWidth, buttonHeight, text) {
        this.x = x;
        this.y = y;
        this.buttonWidth = buttonWidth * resScale();
        this.buttonHeight = buttonHeight * resScale(true);
        this.left = this.x - this.buttonWidth/2;
        this.top = this.y - this.buttonHeight/2;
        this.right = this.left + this.buttonWidth;
        this.bottom = this.top + this.buttonHeight;
        this.buttonOutline = 5;
        this.fontSize = this.buttonHeight/4;
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
        if ((mouseX > this.left && mouseX < this.right && mouseY > this.top && mouseY < this.bottom) || (gamepadCursorX > this.left && gamepadCursorX < this.right && gamepadCursorY > this.top && gamepadCursorY < this.bottom)) {
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
        c.strokeRect(this.left-this.transitionFrames*resScale(), this.top-this.transitionFrames*resScale(true), this.buttonWidth+this.transitionFrames*2*resScale(), this.buttonHeight+this.transitionFrames*2*resScale(true));
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
    initializeButton () {

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




export let buttonKeyboardOnly, buttonControls, buttonPlayNow, buttonPlayerCustomization, buttonPreviousScreen, buttonNewGame, buttonCredits;
function initializeTitleScreenButtons () {
    buttonKeyboardOnly = new Button(centerX, height*0.75, 200, 80, 'Keyboard Only');
    buttonControls = new Button(centerX+width*5/24, height*0.75 - 150*resScale(), 300, 100, 'Controls');

    buttonPlayNow = new Button(centerX, height*0.75, 300, 100, 'Play Now');
    buttonPlayerCustomization = new Button(centerX+width*5/24, height*0.75, 300, 100, 'Character Customization');
    buttonPreviousScreen = new Button(width/9, height/11, 150, 100, 'Back');
    buttonAddPlayer = new Button(width - width/10, height/5, 200, 100, 'Add Player');
    buttonRemovePlayer = new Button(width - width/10, buttonAddPlayer.y + buttonAddPlayer.buttonHeight*1.2, 200, 100, 'Remove Player');
    buttonNewGame = new Button(centerX, height*0.2, 150, 100, 'New Game');

    buttonCredits = new Button(width-100*resScale(), buttonCloseGame.y + buttonCloseGame.buttonHeight + buttonCloseGame.buttonHeight/3*resScale(), 100, 75, 'Credits');
}

export let buttonMusicCredits, buttonSoundCredits, buttonSpriteCredits, buttonTextureCredits, creditsButtonsArray;
function initializeCreditsScreenButtons () {
    buttonMusicCredits = new Button(centerX+width*5/24, height*0.1, 100, 75, 'Music');
    buttonSoundCredits = new Button(centerX+width*5/24, height*0.1, 100, 75, 'Sound');
    buttonSpriteCredits = new Button(centerX+width*5/24, height*0.1, 100, 75, 'Sprites');
    buttonTextureCredits = new Button(centerX+width*5/24, height*0.1, 100, 75, 'Texture');
    creditsButtonsArray = [buttonMusicCredits, buttonSoundCredits, buttonSpriteCredits, buttonTextureCredits]
}

export let gameButtons, buttonSelectAll, buttonDeselectAll, buttonBallfWithYourFriends, buttonColorClash, buttonCumulonimble, buttonFlappyBalls, buttonHotPotato, buttonLightOnYourFeet, buttonMostWanted, buttonRowRace, buttonSimonSays, buttonSumo;
function initializeGameSelectButtons () {
    buttonBallfWithYourFriends = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Ballf W/ Your Friends');
    buttonColorClash = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Color Clash');
    buttonCumulonimble = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Cumulonimble');
    buttonFlappyBalls = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Flappy Balls');
    buttonHotPotato = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Hot Potato');
    buttonLightOnYourFeet = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Light On Your Feet');
    buttonMostWanted = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Most Wanted');
    buttonRowRace = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Row Race');
    buttonSimonSays = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Simon Says');
    buttonSumo = new Button(width*0.9, centerY+centerY/4, 200, 100, 'Sumo');
    gameButtons = [buttonBallfWithYourFriends, buttonColorClash, buttonCumulonimble, buttonFlappyBalls, buttonHotPotato, buttonLightOnYourFeet,  buttonMostWanted, buttonRowRace, buttonSimonSays, buttonSumo];
    spaceEvenly(gameButtons, true, 50, 170*resScale(true));

    buttonSelectAll = new Button(width*0.9, height/11, 200, 100, 'Select All');
    buttonDeselectAll = new Button(width*0.9, height*2/11 + 25, 200, 100, 'Deselect All');
}

export let buttonMainMenu, buttonCloseGame, buttonFullscreen;
function initializePlaySceneButtons () {
    buttonCloseGame = new Button(width-100*resScale(), 70*resScale(), 100, 75, 'Close Game');
    buttonFullscreen = new Button(width-220*resScale(), 70*resScale(), 100, 75, 'Fullscreen');
    buttonMainMenu = new Button(width-100*resScale(), buttonCloseGame.y + buttonCloseGame.buttonHeight + buttonCloseGame.buttonHeight/3*resScale(), 100, 75, 'Main Menu');
}




export function fullscreen () {
    if (buttonFullscreen.text === 'Fullscreen') {
        canvas.requestFullscreen();
        setTimeout(() => {
            buttonFullscreen.text = "Windowed";
        }, 300);
        
    } else {
        document.exitFullscreen();
        setTimeout(() => {
            buttonFullscreen.text = "Fullscreen";
        }, 300);
    }
}
export function closeGame () {
    window.close();
}



export let buttonPlayer = []
export let buttonAddPlayer, buttonRemovePlayer;
function initializePlayerButtons () {
    for(let i = 0; i < player.length; i++){
        buttonPlayer[i] = new Button(0, height/2, 300, 100, `${player[i].name}`);
        buttonPlayer[i].id = i;
    }
}



export let buttonPlayerName, buttonPlayerColor, buttonPlayerRunningSound, buttonPlayerControls, buttonSave;
export let buttonPlayerCustomizationOption = [];
export function initializePlayerCustomizationButtons () {
    buttonPlayerName = new Button(0, height*4/9, width*1/8, height*1/9, 'Change Name');
    buttonPlayerColor = new Button(0, height*4/9, width*1/8, height*1/9, 'Change Color');
    buttonPlayerRunningSound = new Button(0, height/2, width*5/32, height*1/9, 'Running Sound');
    buttonPlayerControls = new Button(0, height*4/9, width*1/8, height*1/9, 'Change Controls');
    buttonPlayerCustomizationOption = [buttonPlayerName, buttonPlayerColor, buttonPlayerControls];
    buttonSave = new Button(centerX, height*0.9, 100, 100, 'Save');
}

export function initializeButtons () {
    initializePlaySceneButtons();
    initializeTitleScreenButtons();
    initializeCreditsScreenButtons();
    initializeGameSelectButtons();
    

    initializePlayerButtons();
    initializePlayerCustomizationButtons ();

    spaceEvenly(creditsButtonsArray, false, 100);
    spaceEvenly(buttonPlayer, true);
    spaceEvenly(buttonPlayerCustomizationOption, false);
}