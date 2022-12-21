export function colorChanger (color, changeBy1, changeBy2, changeBy3, returnRedNumber, returnGreenNumber, returnBlueNumber) {
    let blueNumber = color.slice(color.indexOf('(')+1, color.length);
    blueNumber = blueNumber.split('');
    let redNumber = blueNumber.slice(0, blueNumber.indexOf(','));
    blueNumber.splice(0, redNumber.length+1);
    redNumber = redNumber.join('');
    let greenNumber = blueNumber.slice(0, blueNumber.indexOf(','));
    blueNumber.splice(0, blueNumber.indexOf(',')+1);
    greenNumber = greenNumber.join('');
    blueNumber = blueNumber.join('');
    redNumber = parseInt(redNumber);
    greenNumber = parseInt(greenNumber);
    blueNumber = parseInt(blueNumber);

    if (changeBy3 || changeBy3 === 0){
        redNumber += changeBy1
        greenNumber += changeBy2
        blueNumber += changeBy3
    } else {
        redNumber += changeBy1;
        greenNumber += changeBy1;
        blueNumber += changeBy1;
    }
    if (returnRedNumber) { return redNumber; };
    if (returnGreenNumber) { return greenNumber; };
    if (returnBlueNumber) { return blueNumber; };
    
    redNumber = Math.min(Math.max(redNumber, 0), 255)
    greenNumber = Math.min(Math.max(greenNumber, 0), 255)
    blueNumber = Math.min(Math.max(blueNumber, 0), 255)
    
    return `rgb(${redNumber}, ${greenNumber}, ${blueNumber})`;
}

export function randomColor () {
    let redNumber = Math.floor(Math.random() * 256);
    let greenNumber = Math.floor(Math.random() * 256);
    let blueNumber = Math.floor(Math.random() * 256);
    return `rgb(${redNumber}, ${greenNumber}, ${blueNumber})`;
}