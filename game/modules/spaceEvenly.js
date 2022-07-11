import { c, width, height, centerX, centerY} from '../Main.js';

export function spaceEvenly (items, splitRows, xSpaceApart, ySpaceApart, rows) {
    if (!xSpaceApart && xSpaceApart !== 0 || xSpaceApart === 'default'){ xSpaceApart = (5/24*width)/items.length; };
    if (!ySpaceApart && ySpaceApart !== 0 || ySpaceApart === 'default') { ySpaceApart = width*5/24; };
    if (splitRows && !rows) { rows = 2; };
    if (!splitRows && !rows) { rows = 1; };
    let row = [];
    for (let i = 0; i < rows; i++){
        row[i] = [];
    }
    /*DELETE THIS LATER ---- to make this have a split to x amount of rows function, you need to change the division
    of each array to be dependant on the amount of rows that the "items" array will be split into in the "splitArray"
    function. I would remove the splitTo1 and SplitTo2, because that can just be changed to 
    function splitArray (array) {
        let arraySpacer = [];
        for (let j=0; j < rows; j++){
            arraySpacer[j] = (array.length/rows)*j
        }
        for (let i=0; i < rows; i++){
            for (let j=0; j < rows; j++){
                array[i][j] = array[i + arraySpacer[i]]
            }
        }
    } and then the other functions will be have to changed to accept nested arrays and potentially further nest 
    some arrays into itself, depending on how many more times we have to split the array. I don't remember 
    */
    

    function isThisArrayEven (array) {
        if (array.length % 2 === 0){
            return true;
        } else { return false};
    }
    function splitArray (array, splitTo1, splitTo2) {
        if (isThisArrayEven(array)){
            for (let i = 0; i < array.length/2; i++) {
                let j = i + array.length/2
                splitTo1[i] = array[i];
                splitTo2[i] = array[j];
            }
        } else {
            for (let i = 0; i <= Math.floor(array.length/2); i++){
                splitTo1[i] = array[i];
            }
            for (let i = 0; i < Math.floor(array.length/2); i++){
                splitTo2[i] = array[i + Math.ceil(array.length/2)];
            }
        }
    }
    function spaceEvenArray (array, ySpace) {
        let rowHalf1 = [];
        let rowHalf2 = [];
        splitArray(array, rowHalf1, rowHalf2);
        array[0] = rowHalf1;
        array[1] = rowHalf2;
        array.splice(2, array.length);
        for (let i = 0; i < array[0].length; i++){
            let j = array[0].length - 1 - i;
            array[0][i].x = width/2 - xSpaceApart/2 - array[0][i].buttonWidth/2 - array[0][i].buttonWidth*j - xSpaceApart*j ;
            array[0][i].left = array[0][i].x - array[0][i].buttonWidth/2;
            array[0][i].right =  array[0][i].left + array[0][i].buttonWidth;
            array[0][i].y += ySpace;
            array[0][i].top += ySpace;
            array[0][i].bottom += ySpace;           
        }
        for (let i = 0; i < array[1].length; i++){
            array[1][i].x = width/2 + xSpaceApart/2 + array[1][i].buttonWidth/2 + array[1][i].buttonWidth*i + xSpaceApart*i
            array[1][i].left = array[1][i].x - array[1][i].buttonWidth/2 
            array[1][i].right =  array[1][i].left + array[1][i].buttonWidth;
            array[1][i].y += ySpace;
            array[1][i].top += ySpace;
            array[1][i].bottom += ySpace;
        }
    }
    function spaceOddArray (array, ySpace) {
        let rowHalf1 = [];
        let rowHalf2 = [];
        splitArray(array, rowHalf1, rowHalf2);
        array[0] = rowHalf1;
        array[1] = rowHalf2;
        array.splice(2, array.length);

        for (let i = 0; i <= Math.ceil(array[0].length/2); i++){
            let j = Math.ceil(array[0].length/2) - i
            array[0][i].x = width/2 - array[0][i].buttonWidth*j - xSpaceApart*j
            array[0][i].left = array[0][i].x - array[0][i].buttonWidth/2;
            array[0][i].right =  array[0][i].left + array[0][i].buttonWidth;
            array[0][i].y += ySpace;
            array[0][i].top += ySpace;
            array[0][i].bottom += ySpace;
        }
        for (let i = 0; i <= Math.floor(array[1].length/2); i++){
            let j = i + 1;
            array[1][i].x = width/2 + array[1][i].buttonWidth*j + xSpaceApart*j
            array[1][i].left = array[1][i].x - array[1][i].buttonWidth/2 
            array[1][i].right =  array[1][i].left + array[1][i].buttonWidth;
            array[1][i].y += ySpace;
            array[1][i].top += ySpace;
            array[1][i].bottom += ySpace;
        }
    }
    function spaceArray (array, ySpace) {
        //delete this. it doesn't work anymore.
        //if (array === row[1]) { console.log(row); xSpaceApart = ((row[0][1][row[0][1].length-1].x - row[0][0][0].x) - (row[1][0].length-1)*row[1][0].buttonWidth) / (row[1].length-1)   }
        if (isThisArrayEven(array)) {
            spaceEvenArray(array, ySpace);
        } else {
            spaceOddArray(array, ySpace);
        }
    }

    if (splitRows){
        //for (let i = 0; i < rows; i++){
            splitArray(items, row[0], row[1]);
            //delete this ----- when you figure out how to separate into a set number of rows,
            //you'll have to change this to spaceArray row[i] and write an if statement that says
            //if (row[i]) { spaceArray(row[i]) }, so it doesn't double/triple/quadriple space the rows apart.
            spaceArray(row[0], 0);
            spaceArray(row[1], ySpaceApart);
        //}
    } else {
        row[0] = items;
        spaceArray(row[0], 0);
    }    
}