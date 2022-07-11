import { c, width, height, centerX, centerY } from "../../../Main.js";
import { image } from "../../drawShapes.js";

export function renderBackground (imageToDraw) {
    c.fillStyle = 'rgb(50, 50, 50)';
    c.fillRect (0, 0, width, height);
    c.fillStyle = 'rgb(255, 255, 255)';
    if (imageToDraw) {
        image(imageToDraw, centerX, centerY, width/imageToDraw.naturalWidth, height/imageToDraw.naturalHeight)
    }
}