import { changeScaledPlayerSize, player } from "../players.js"
import { gamepad } from '../listeners/gamepadListener.js';
import { inputControls } from "../inputs.js";
import { keys } from "../listeners/keyListener.js";
import { resScale } from "../../Main.js";

export function forAllPlayers(functionToApply) {
    for (let i = 0 ; i < player.length; i++){
        functionToApply(i);
    }
};

export function assignControls (pNum,  controllerType, controllerNumber, left, up, right, down, sprint, action, LT, RT) {
    if (!player[pNum].controllerType){
        player[pNum].controllerType = controllerType;
        if (controllerType === 'keyboard'){
            player[pNum].boundLeft = keys[left];
            player[pNum].boundUp = keys[up];
            player[pNum].boundRight = keys[right];
            player[pNum].boundDown = keys[down];
            player[pNum].boundSprint = keys[sprint];
            player[pNum].boundAction = keys[action];
            player[pNum].boundLeftTrigger = keys[LT];
            player[pNum].boundRightTrigger = keys[RT];
            inputControls.keysAssignedTo[left] = { player: pNum, color: player[pNum].clr };
            inputControls.keysAssignedTo[up] = { player: pNum, color: player[pNum].clr };
            inputControls.keysAssignedTo[right] = { player: pNum, color: player[pNum].clr };
            inputControls.keysAssignedTo[down] = { player: pNum, color: player[pNum].clr };
            inputControls.keysAssignedTo[sprint] = { player: pNum, color: player[pNum].clr };
        } else if (controllerType === 'gamepad' && gamepad[controllerNumber]){
            player[pNum].boundUp = 1;
            player[pNum].boundRight = 0;
            player[pNum].boundA = 0;
            player[pNum].boundB = 1;
            player[pNum].boundX = 2;
            player[pNum].boundY = 3;
            player[pNum].boundLB = 4;
            player[pNum].boundRB = 5;
            player[pNum].boundLT = 6;
            player[pNum].boundRT = 7;
            player[pNum].boundSelect = 8;
            player[pNum].boundPause = 9;
            player[pNum].boundLSClicked = 10;
            player[pNum].boundRSClicked = 11;
            player[pNum].boundDPadUp = 12;
            player[pNum].boundDPadDown = 13;
            player[pNum].boundDPadLeft = 14;
            player[pNum].boundDPadRight = 15;
            player[pNum].cNum = controllerNumber;
        }
    }   
};

export function resizePlayers (size) {
    for (let i = 0; i < player.length; i++){
        player[i].size = size * resScale();
        changeScaledPlayerSize(size)
    }
}

export function renderPlayers() {
    for (let i = 0; i < player.length; i++) {
        player[i].draw();
        player[i].checkForWallCollision();
        for (let j = i; j < player.length; j++){
            if ( j !== i ){
                player[i].checkForPlayerCollision(j);
            }    
        }
        
        //assigns default gamepad controllers to the first 4 players without controls defined, then gives keyboard controls to the next 4 players without controls defined
        for (let j = 0; j < gamepad.length; j++){
            if (!player[i].controllerType && (!inputControls.controllerAssignedTo[j] && inputControls.controllerAssignedTo[j] !== 0)){
                assignControls(i, 'gamepad', j, undefined, undefined, undefined, undefined, undefined);
                inputControls.controllerAssignedTo[j] = i;
            }
        }
        if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[37] || !inputControls.keysAssignedTo[38] || !inputControls.keysAssignedTo[39] || !inputControls.keysAssignedTo[40] ||  !inputControls.keysAssignedTo[16]) ) { assignControls(i, 'keyboard', undefined, 37, 38, 39, 40, 16, 13, 46, 34); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[65] || !inputControls.keysAssignedTo[87] || !inputControls.keysAssignedTo[68] || !inputControls.keysAssignedTo[83] ||  !inputControls.keysAssignedTo[67]) ){ assignControls(i, 'keyboard', undefined, 65, 87, 68, 83, 67, 88, 81, 69); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[70] || !inputControls.keysAssignedTo[84] || !inputControls.keysAssignedTo[72] || !inputControls.keysAssignedTo[71] ||  !inputControls.keysAssignedTo[78]) ){ assignControls(i, 'keyboard', undefined, 70, 84, 72, 71, 78, 66, 82, 89); }
        else if (player[i] && !player[i].controllerType && (!inputControls.keysAssignedTo[74] || !inputControls.keysAssignedTo[73] || !inputControls.keysAssignedTo[76] || !inputControls.keysAssignedTo[75] ||  !inputControls.keysAssignedTo[190]) ){ assignControls(i, 'keyboard', undefined, 74, 73, 76, 75, 190, 188, 85, 79); };
        player[i].controls();
    }
};