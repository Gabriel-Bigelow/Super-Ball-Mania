export let mouseX, mouseY, mousedown, mouseclicked;
document.addEventListener('mousemove', (event) => {mouseX = event.clientX; mouseY = event.clientY;});
document.addEventListener('click', function (event) {mouseclicked=true})
document.addEventListener('mousedown', function (event) {mousedown = true});
document.addEventListener('mouseup', function (event) {mousedown = false});

export function unclickMouse () {
    mouseclicked = false;
}

