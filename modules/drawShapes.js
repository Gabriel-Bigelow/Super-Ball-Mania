import { c, width, height, centerX, centerY} from '../Main.js';


export function image (image, x, y, xRatio, yRatio) {
    if (xRatio && !yRatio) {
        yRatio = xRatio
    }
    if (!xRatio) { xRatio = 1; yRatio = 1; };
    c.drawImage(image, x - image.width/2*xRatio, y - image.height/2*yRatio, image.naturalWidth * xRatio, image.naturalHeight * yRatio);
}

export function dImage (image, x, y, xRatio, yRatio) {
    if (xRatio && !yRatio) {
        yRatio = xRatio
    }
    if (!xRatio) { xRatio = 1; yRatio = 1; };
    c.drawImage(image, x, y, image.naturalWidth * xRatio, image.naturalHeight * yRatio);
}

export function ellipse(x, y, size, color) {
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(x, y, size/2, size/2, 0, 0, 2 * Math.PI);
    c.fill();
    c.closePath();
};
export function line(x, y, x2, y2, thickness, color){
    c.strokeStyle = color;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x2, y2);
    c.lineWidth = thickness;
    c.stroke();
};
export function centerRect(x, y, rectWidth, rectHeight) {
    c.fillRect(x-rectWidth/2, y-rectHeight/2, rectWidth, rectHeight);
}
export function centerStrokeRect(x, y, rectWidth, rectHeight) {
    c.strokeRect(x-rectWidth/2, y-rectHeight/2, rectWidth, rectHeight);
}


export function mapTexture (texture, howManyX, howManyY, startWhereX, startWhereY, mappingObject) {
    c.save();
    c.beginPath()

    mappingObject();

    c.closePath();
    c.fill();
    c.clip();
    for (let i = startWhereX; i < howManyX; i++){
        for (let j = startWhereY; j < howManyY; j++){
            c.drawImage(texture, texture.naturalWidth*i, texture.naturalHeight*j);
        }
    }
    c.restore();
}

function wrap (textToWrap, containerWidth, arrayOfWords, element) {
    let wordsCopy = textToWrap;
    let wordsCopyArray = [];
    let wordsReturnArray = [];
    let containerWidthMinusMargin = containerWidth * 0.8;
    let howManyLines = c.measureText(textToWrap).width/containerWidthMinusMargin;
    
    wordsCopy = wordsCopy.split(' ');

    for (let i = 0; i < howManyLines; i++){
        let wordsLength = 0;
        wordsCopyArray = [];
        while (wordsLength < containerWidthMinusMargin) {
            if (wordsCopy.length > 0) {
                wordsCopyArray.push(wordsCopy.splice(0, 1));
                wordsLength = c.measureText(wordsCopyArray.join(' ')).width + c.measureText(wordsCopy[0]).width;
            } else {
                wordsLength = containerWidthMinusMargin;
            }            
        }
        wordsCopyArray = wordsCopyArray.join(' ');
        arrayOfWords.splice(i, 0, wordsCopyArray);
        wordsReturnArray.push(wordsCopyArray);
    }
    arrayOfWords.splice(element+Math.ceil(howManyLines), 1);
}

export function wrapWrite (wordsToWrap, containerWidth, x, y, fontSize) {
    if (!fontSize) {
        fontSize = 30;
    }

    wordsToWrap = [wordsToWrap];
    wrap(wordsToWrap[0], containerWidth, wordsToWrap, 0);

    c.font = `${fontSize}px oswald`;
    for(let i = 0; i < wordsToWrap.length; i++) {
        c.fillText(wordsToWrap[i], x, y + fontSize*1.2*i);
    }
}