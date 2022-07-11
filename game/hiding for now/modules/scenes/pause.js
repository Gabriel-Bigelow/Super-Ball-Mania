import { c, centerX, centerY, changeScene } from "../../Main.js";
import { buttonCloseGame, buttonMainMenu } from "../buttons.js";
import { centerRect } from "../drawShapes.js";
import { unpauseGame, unpauseGameAndChangeScene } from "../pauseGame.js";
import { sceneTitle } from "./titleScreen.js";

function closeGame() {
    window.close();
}

export function scenePause () {
    buttonMainMenu.draw(unpauseGameAndChangeScene, sceneTitle);
    buttonCloseGame.draw(closeGame);
    
    c.fillStyle = 'rgb(20, 20, 20)';
    centerRect(centerX, centerY - 40, 350, 150)
    c.font = '100px oswald';
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillText('PAUSED', centerX, centerY);
    unpauseGame();
}
