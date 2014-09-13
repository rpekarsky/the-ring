
// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x0B486B);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(20*32, 20*31);

document.body.appendChild(renderer.view);

function animate() {
    requestAnimFrame( animate );
    Block.update();
    renderer.render(stage);
}