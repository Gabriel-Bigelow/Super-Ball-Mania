import { c, centerX, changeScene, height, width } from "../../Main.js";
import { buttonPreviousScreen } from "../buttons.js";
import { wrapWrite } from "../drawShapes.js";
import { renderBackground } from "./background/background.js";
import { sceneTitle } from "./titleScreen.js";



let words1 = 'Control schemes are automatically assigned to players based on the number of gamepads plugged in. If 3 controllers are plugged in, the first 3 players will be assigned gamepad control schemes. The 4th player will be assigned keyboard controls. This game is best played with a controller, but I wanted to allow players without an Xbox controller to play. Some keybinds can be changed on the player customization screen. Controllers can also be reassigned to different players there. Minigames can be paused at any time by pressing the "START" button on a gamepad or the "ESCAPE" key.';

let words2 = 'The default keybinds for keyboard players are:';
let words3 = 'keyboard player 1:   Movement = UP LEFT RIGHT DOWN arrows // Sprint = SHIFT // Action = ENTER // LT RT = DEL PAGEDOWN';
let words4 = 'keyboard player 2:   Movement = W A S D //    Sprint = C    //    Action = X   //   LT RT = Q E';
let words5 = 'keyboard player 3:   Movement = T F G H //    Sprint = N    //    Action = B   //   LT RT = R Y';
let words6 = 'keyboard player 4:   Movement = I J K L //    Sprint = .    //    Action = ,   //   LT RT = U O';
let keyboardControls = [words3, words4, words5, words6];

let words7 = 'The game can be played with up to 8 controllers, by utilizing programs such as ReWASD, and grouping controllers together.';
let words8 = `To play with 8 controllers, open ReWASD (or a similar program), and group 2 controllers together. Controller 1's bindings should be assigned as normal. The second controller in the grouping should be assigned 1 of the 4 default keyboard player controls. For example, to follow default controller bindings: (if assigning the second controller as keyboard player 1) bind the left stick to UP/DOWN/LEFT/RIGHT arrows, bind the "A" button to ENTER, bind the "B" button to SHIFT, bind "LT" to DELETE, bind "RT" to PAGE DOWN.`


export function sceneControls () {
    renderBackground();
    
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = '30px oswald';
    c.textAlign = 'center';
    wrapWrite(words1, width, centerX, height*0.2)
    c.fillText(words2, centerX, height*0.45);
    c.fillText(words7, centerX, height*0.75);
    wrapWrite(words8, width, centerX, height*0.8)
    
    c.textAlign = 'left';

    
    for (let i = 0; i < keyboardControls.length; i++) {
        c.fillText(keyboardControls[i], width*0.1, height * 0.5 + 40*i);
    }
    
    buttonPreviousScreen.draw(changeScene, sceneTitle);
}