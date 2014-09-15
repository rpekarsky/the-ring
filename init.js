
// create an new instance of a pixi stage




var testStage = new PIXI.Stage(0xFFFFFF);

var basestage = new PIXI.Stage(0x909090);
 
// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(320,480);

// // create a new render texture..
// var renderTexture = new PIXI.RenderTexture(20*32, 20*6*2);
// var renderTexture = new PIXI.RenderTexture(100,100);

var gr = new PIXI.Graphics();
gr.beginFill(0xff0000);
gr.drawRect(0,0,50,50);
gr.beginFill(0x00ff00);
gr.drawRect(0,50,50,50);
gr.endFill();
testStage.addChild(gr);
// var sprite = new PIXI.Strip(renderTexture);
// sprite.x = 320/2;
// sprite.y = 480/2;
// sprite.scale.x = 5.4;
// sprite.scale.y = 5.4;
document.body.appendChild(renderer.view);


// document.body.appendChild(renderer.view);
// var bgTex = PIXI.Texture.fromImage('bg.jpg');
// var bg = new PIXI.Sprite(bgTex);
// bg.blendMode = PIXI.blendModes.ADD;

// basestage.addChild(bg);

function animate() {
    requestAnimFrame( animate );
    
    Game.render();
    // renderer.render(stage);
    // renderTexture.clear();
    // renderTexture.render(stage);
    renderer.render(basestage);
}