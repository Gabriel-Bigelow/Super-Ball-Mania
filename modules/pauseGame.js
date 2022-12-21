import { gamepad } from "./listeners/gamepadListener.js";
import { changeScene, previousScene } from "../Main.js";
import { soundDeselect, soundSelect } from "./buttons.js";
import { keys } from "./listeners/keyListener.js";
import { scenePause } from "./scenes/pause.js";
import { resetGames, sceneTitle } from "./scenes/titleScreen.js";

let paused = false;
export function pauseGame (soundsToPause) {
    if (keys[27].returnValue && !paused) {
        soundSelect.play();
        changeScene(scenePause);
        if (soundsToPause) { setTimeout(() => { soundsToPause.forEach(element => { element.pause(); }) }, 0); }
        setTimeout(() => { paused = true; }, 500);
    }
    for (let i = 0; i < gamepad.length; i++){
        if (gamepad[i].buttons[9].pressed && !paused){
            soundSelect.play();
            changeScene(scenePause);
            if (soundsToPause) { setTimeout(() => { soundsToPause.forEach(element => { element.pause(); }) }, 0); }
            setTimeout(() => { paused = true; }, 500);
        }
    }
}

export function unpauseGame () {
    if (keys[27].returnValue && paused) {
        soundDeselect.play();
        changeScene(previousScene);
        setTimeout(() => {
            paused = false;
        }, 500)
    }
    for (let i = 0; i < gamepad.length; i++){
        if (gamepad[i].buttons[9].pressed && paused){
            soundDeselect.play();
            changeScene(previousScene);
            setTimeout(() => {
                paused = false;
            }, 500)
        }
    }
}

export function unpauseGameAndChangeScene(sceneName) {
    setTimeout(() => {
        paused = false;
    }, 500)
    changeScene(sceneName);
    if (sceneName === sceneTitle) {
        resetGames();
    }
}