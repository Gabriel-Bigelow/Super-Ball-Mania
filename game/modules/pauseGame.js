import { gamepad } from "../../modules/listeners/gamepadListener.js";
import { changeScene, previousScene } from "../Main.js";
import { soundDeselect, soundSelect } from "./buttons.js";
import { scenePause } from "./scenes/pause.js";

let paused = false;
export function pauseGame (soundsToPause) {
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

export function unpauseGameAndChangeScene(sceneTitle) {
    setTimeout(() => {
        paused = false;
    }, 500)
    changeScene(sceneTitle);
}