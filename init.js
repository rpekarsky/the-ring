
// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xE0E4CC);



var testStage = new PIXI.Stage(0xFFFFFF);

var basestage = new PIXI.Stage(0x000000);
 
// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(1366,768);

// // create a new render texture..
var renderTexture = new PIXI.RenderTexture(20*32, 20*6);
// var renderTexture = new PIXI.RenderTexture(100,100);

var gr = new PIXI.Graphics();
gr.beginFill(0xff0000);
gr.drawRect(0,0,50,50);
gr.beginFill(0x00ff00);
gr.drawRect(0,50,50,50);
gr.endFill();
testStage.addChild(gr);
var sprite = new PIXI.Strip(renderTexture);
sprite.x = 300;
sprite.y = 300;
basestage.addChild(sprite);

var sprite = new PIXI.Strip(renderTexture);
sprite.x = 300+300+300;
sprite.y = 300;
basestage.addChild(sprite);
// sprite.scale.x = 5.4;
// sprite.scale.y = 5.4;
document.body.appendChild(renderer.view);

// document.body.appendChild(renderer.view);

function animate() {
    requestAnimFrame( animate );
    Block.update();
    // renderer.render(stage);
    renderTexture.clear();
    renderTexture.render(stage);
    renderer.render(basestage);
}