import { c, centerX, height, width } from "../../Main.js";
import { renderBackground } from "./background/background.js";



let words1 = 'This game is best played with a controller, but I did want to allow players without an Xbox controller to play. Some keybinds can be changed on the player customization screen. Controllers can also be reassigned there. Adding some more random words to see if this works if the sentences are more than 2 lines long. Hopefully this works if it is like 4 or 5 sentences long, but we will see, I suppose.';
let words2 = 'The default keybinds for keyboard players are:';
let words3 = 'keyboard player 1:   Movement = UP LEFT RIGHT DOWN arrows // Sprint = SHIFT // action = ENTER';
let words4 = 'keyboard player 2:   Movement = W A S D // Sprint = C // action = X';
let words5 = 'keyboard player 3:   Movement = T F G H // Sprint = N // action = B';
let words6 = 'keyboard player 4:   Movement = I J K L // Sprint = . // Action = ,';
let words7 = 'The game can be played with up to 8 controllers, by utilizing programs such as ReWASD, and grouping controllers together.'
let allWords = [words1] //, words2, words3, words4, words5, words6, words7];

let textLoaded = false;
function wrap (textToWrap, containerWidth, arrayOfWords, element) {
    let wordsCopy = textToWrap;
    let wordsCopyArray = [textToWrap];

    let containerWidthMinusMargin = containerWidth * 0.8;
    let howManyLines = c.measureText(textToWrap).width/containerWidthMinusMargin;
    
    for (let i = 0; i < howManyLines; i++) {
        wordsCopyArray[i+1] = wordsCopyArray[i].substr((i+1)/howManyLines*wordsCopyArray[i].length, wordsCopyArray[i].length)
        console.log(wordsCopyArray[i+1])
        wordsCopyArray[i] = wordsCopyArray[i].substr(0,(i+1)/howManyLines*wordsCopyArray[i].length);
        if (i !== 0) {
            arrayOfWords.splice(element+1, 0, wordsCopyArray[i]);
        }
    }
    arrayOfWords[element] = wordsCopyArray[0];
    if (c.measureText(textToWrap).width > containerWidth*0.8) {
        //use substr based on the length of a certain substring, not the width of the container.
        //wordsCopyArray[0] = wordsCopy.substr(0, Math.floor(wordsCopy.length*0.8));
        //wordsCopyArray[1] = wordsCopy.substr(Math.floor(wordsCopy.length*0.8));

        //arrayOfWords[element] = wordsCopyArray[0];
        //
    }
}

export function sceneControls () {
    renderBackground();
    c.font = '30px oswald';
    c.textAlign = 'left';
    c.fillStyle = 'rgb(255, 255, 255)';

    wrap(allWords[0], width, allWords, 0)
    


    for (let i = 0; i < allWords.length; i++) {
        c.fillText(allWords[i], width*0.1, height*0.1 + 30*i);
    }
}