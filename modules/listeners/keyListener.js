export let keys = [];
export let keyCode;
export let keyInputArray = [];
//initialize all keys
export function initializeKeys() {
    for (let i = 0; i <= 222; i++){
        let key = {
            keyCode: i,
            key: undefined,
            returnValue: false,
        }
        keys[i] = key;
    }
}


window.addEventListener('keydown', function(event){
    if (event){
        keys[event.keyCode] = event;
        keyCode = event.keyCode;
        keyInputArray.push(keys[event.keyCode])
    }
})
window.addEventListener('keyup', function(event){
    if (event){
        keys[event.keyCode].returnValue = false;
    }
})
