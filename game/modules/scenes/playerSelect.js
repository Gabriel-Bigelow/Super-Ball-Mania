import { c, centerX, centerY, changeScene} from '../../Main.js';
import { renderBackground } from './background/background.js';
import { mouseclicked } from '../listeners/mouseListener.js';

import { Button, buttonPlayer, buttonAddPlayer, buttonRemovePlayer, buttonPreviousScreen, soundDeselect } from '../buttons.js';
import { Player, player } from '../players.js';

import { colorChanger, randomColor } from '../colors.js';
import { spaceEvenly } from '../spaceEvenly.js';

import { sceneTitle, themeMusic } from './titleScreen.js';
import { scenePlayerCustomization } from './playerCustomization.js';


export let selectedPlayer;

export function scenePlayerSelect() {
    renderBackground();
    themeMusic.play();
    c.font = "100px Oswald"
    c.fillText('Customize your character', centerX, centerY/4);
    
    function drawPlayerAndButton (i) {
        if (buttonPlayer[i]){
            player[i].x = buttonPlayer[i].x;
            player[i].y = buttonPlayer[i].y - buttonPlayer[i].buttonHeight*3/2;
            player[i].draw();
            buttonPlayer[i].draw(undefined, undefined, undefined, undefined, Math.min(Math.round(colorChanger(player[i].clr, 0, 0, 0, true)/10)*10, 250-20), Math.min(Math.round(colorChanger(player[i].clr, 0, 0, 0, false, true)/10)*10, 250-20), Math.min(Math.round(colorChanger(player[i].clr, 0, 0, 0, false, false, true)/10)*10, 250-20));
            if (colorChanger(buttonPlayer[i].innerColor, 0, 0, 0, false, true) > 180){
                buttonPlayer[i].textColor = 'rgb(0, 0, 0)';
            } else { 
                buttonPlayer[i].textColor = 'rgb(255, 255, 255)'; 
            }
            if (buttonPlayer[i].hovered && mouseclicked){
                selectedPlayer = buttonPlayer[i].id;
                changeScene(scenePlayerCustomization);
                buttonPlayer[selectedPlayer].innerColor = 'rgb(20, 20, 20)';
                buttonPlayer[selectedPlayer].transitionFrames = 0;
            }
        }
    }
    for(let i = 0; i < player.length; i++){ drawPlayerAndButton(i); }


    function createPlayerButtons () {
        for (let i = 0; i < player.length; i++) {
            buttonPlayer[i] = new Button (0, centerY, 300, 100);
            if (!player[i].name){ 
                player[i].name = `Player ${i + 1}`; 
                player[i].pid = i;
            };
            buttonPlayer[i].id = i;
            buttonPlayer[i].text = `${player[i].name}`;        
        }
        spaceEvenly(buttonPlayer, true);
    }
    function addPlayer () {
        player.push(new Player(randomColor()));
        createPlayerButtons();
    }
    function removePlayer() {
        if (player.length > 2){
            player.pop();
            buttonPlayer.pop();
        }
        //delete this -- uncomment this when you fix spaceEvenly
        //spaceEvenly(buttonPlayer, true);
    }

    buttonAddPlayer.draw(addPlayer);
    buttonRemovePlayer.draw(removePlayer);
    buttonPreviousScreen.draw(changeScene, sceneTitle, soundDeselect);
}