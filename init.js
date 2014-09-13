
// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xE0E4CC);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(20*32, 20*31);

document.body.appendChild(renderer.view);

function animate() {
    requestAnimFrame( animate );
    Block.update();
    renderer.render(stage);
}