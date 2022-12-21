import { c, canvas, height, scene, width } from "../../Main.js"
import { ellipse } from "../drawShapes.js";
import { player } from "../players.js";
import { scenePlayBallfWithYourFriends } from "../scenes/Ballf With Your Friends/BallfWithYourFriends.js";
import { scenePlayColorClash } from "../scenes/Color Clash/playColorClash.js";
import { scenePlayCumulonimble } from "../scenes/Cumulonimble/playCumulonimble.js";
import { scenePlayFlappyBalls } from "../scenes/Flappy Balls/playFlappyBalls.js";
import { scenePlayHotPotato } from "../scenes/Hot Potato/playHotPotato.js";
import { scenePlayLightOnYourFeet } from "../scenes/Light On Your Feet/playLightOnYourFeet.js";
import { scenePlayMostWanted } from "../scenes/Most Wanted/playMostWanted.js";
import { scenePlayRowRace } from "../scenes/Row Race/playRowRace.js";
import { scenePlaySimonSays } from "../scenes/Simon Says/playSimonSays.js";
import { scenePlaySumo } from "../scenes/Sumo/playSumo.js";
import { gamepad } from "./gamepadListener.js";
import { clickMouse, doMousedown, doMouseup } from "./mouseListener.js";

export let gamepadCursorX = -1000
export let gamepadCursorY = -1000
let cursorSpeed = 10;


let buttonA = 0;
export function gamepadClick () {
    if (gamepad[0] && scene !== scenePlayBallfWithYourFriends && scene !== scenePlayColorClash && scene !== scenePlayCumulonimble && scene !== scenePlayFlappyBalls && scene !== scenePlayHotPotato && scene !== scenePlayLightOnYourFeet && scene !== scenePlayMostWanted && scene !== scenePlayRowRace && scene !== scenePlaySimonSays && scene !== scenePlaySumo) {
        let buttonHeld = false;
        for (let i = 0; i < gamepad.length; i++) {
            if (gamepad[i].buttons[0].pressed){
                buttonA++;
                cursorColor = player[i].clr;
            }
    
            for (let j = 0; j < gamepad.length; j++) {
                if (!buttonHeld) { 
                    if (gamepad[j].buttons[0].pressed) {
                        buttonHeld = true;
                    }
                }
            } 
        }
        if (buttonA > 0) {
            doMousedown();
        }
        if (!buttonHeld) { 
            doMouseup();
            if (buttonA > 0) {
                clickMouse();
            }
            buttonA = 0;
        }
    }
}

let cursorColor = 'rgb(255, 255, 255)';
export function gamepadMenuControls () {
    if (gamepad[0] && scene !== scenePlayBallfWithYourFriends && scene !== scenePlayColorClash && scene !== scenePlayCumulonimble && scene !== scenePlayFlappyBalls && scene !== scenePlayHotPotato && scene !== scenePlayLightOnYourFeet && scene !== scenePlayMostWanted && scene !== scenePlayRowRace && scene !== scenePlaySimonSays && scene !== scenePlaySumo) {
        if (gamepadCursorX === -1000) { gamepadCursorX = width/2 };
        if (gamepadCursorY === -1000) { gamepadCursorY = height/2 };
        if (gamepadCursorX < 0) {
            gamepadCursorX = 0;
        }
        if (gamepadCursorX > width) {
            gamepadCursorX = width;
        }
        if (gamepadCursorY < 0) {
            gamepadCursorY = 0;
        }
        if (gamepadCursorY > height) {
            gamepadCursorY = height;
        }
        c.save();
        c.fillStyle = cursorColor;
        c.globalAlpha = 0.2;
        ellipse(gamepadCursorX, gamepadCursorY, 50);
        c.lineWidth = 1;
        c.globalAlpha = 1;
        c.strokeStyle = cursorColor;
        c.arc(gamepadCursorX, gamepadCursorY, 25, 0, 2*Math.PI);
        c.stroke();
        c.restore();
        ellipse(gamepadCursorX, gamepadCursorY, 5);
    
        
        for (let i = 0; i < gamepad.length; i++) {
            if (gamepad[i].axes[0] > 0.2) {
                gamepadCursorX += cursorSpeed*gamepad[i].axes[0];
                cursorColor = player[i].clr;
            } else if (gamepad[i].axes[0] < -0.2) {
                gamepadCursorX += cursorSpeed*gamepad[i].axes[0];
                cursorColor = player[i].clr;
            }
            if (gamepad[i].axes[1] > 0.2) {
                gamepadCursorY += cursorSpeed*gamepad[i].axes[1];
                cursorColor = player[i].clr;
            } else if (gamepad[i].axes[1] < -0.2) {
                gamepadCursorY += cursorSpeed*gamepad[i].axes[1];
                cursorColor = player[i].clr;
            }
        }
    }
}