let padCon = false;
//gamepad controls listener
window.addEventListener("gamepadconnected", (event) => {
    console.log(`Gamepad ${event.gamepad.index} is connected.`, event.gamepad);
    padCon = true;
    console.log(event)
});

window.addEventListener("gamepaddisconnected", (event) => {
    console.log("Gamepad is disconnected.", event.gamepad);
    gamepad.splice(event.gamepad.index, 1);
});

export let gamepad = [];
export const gamepadListener = () => {
    if (padCon) {
        let gamepadArray = navigator.getGamepads();
        for (let i = 0; i < gamepadArray.length; i++){
            if (gamepadArray[i] !== null){
                gamepad[i] = {
                    id: gamepadArray[i].id,
                    axes: [gamepadArray[i].axes[0].toFixed(2),
                        gamepadArray[i].axes[1].toFixed(2),
                        gamepadArray[i].axes[2].toFixed(2),
                        gamepadArray[i].axes[3].toFixed(2)],
                    buttons: [gamepadArray[i].buttons[0],
                    gamepadArray[i].buttons[1],
                    gamepadArray[i].buttons[2],
                    gamepadArray[i].buttons[3],
                    gamepadArray[i].buttons[4],
                    gamepadArray[i].buttons[5],
                    gamepadArray[i].buttons[6],
                    gamepadArray[i].buttons[7],
                    gamepadArray[i].buttons[8],
                    gamepadArray[i].buttons[9],
                    gamepadArray[i].buttons[10],
                    gamepadArray[i].buttons[11],
                    gamepadArray[i].buttons[12],
                    gamepadArray[i].buttons[13],
                    gamepadArray[i].buttons[14],
                    gamepadArray[i].buttons[15],
                    gamepadArray[i].buttons[16]],
                }
            }
        }
    }
}

export function addControllerManually () {
    gamepad.push(
        new Gamepad ()
        /*{
            id: gamepad.length,
            axes: [Gamepad.buttons,
            gamepadArray[i].axes[1].toFixed(2),
            gamepadArray[i].axes[2].toFixed(2),
            gamepadArray[i].axes[3].toFixed(2)],
            buttons: [gamepadArray[i].buttons[0],
            gamepadArray[i].buttons[1],
            gamepadArray[i].buttons[2],
            gamepadArray[i].buttons[3],
            gamepadArray[i].buttons[4],
            gamepadArray[i].buttons[5],
            gamepadArray[i].buttons[6],
            gamepadArray[i].buttons[7],
            gamepadArray[i].buttons[8],
            gamepadArray[i].buttons[9],
            gamepadArray[i].buttons[10],
            gamepadArray[i].buttons[11],
            gamepadArray[i].buttons[12],
            gamepadArray[i].buttons[13],
            gamepadArray[i].buttons[14],
            gamepadArray[i].buttons[15],
            gamepadArray[i].buttons[16]],
        }*/
    )
}
