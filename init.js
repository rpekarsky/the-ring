
// create an new instance of a pixi stage





var basestage = new PIXI.Stage(0x202020);
// var basestage = new PIXI.Stage(0xffffff);
 
// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(360,480);

// // create a new render texture..
// var renderTexture = new PIXI.RenderTexture(20*32, 20*6*2);
// var renderTexture = new PIXI.RenderTexture(100,100);

// var sprite = new PIXI.Strip(renderTexture);
// sprite.x = 320/2;
// sprite.y = 480/2;
// sprite.scale.x = 5.4;
// sprite.scale.y = 5.4;
document.body.appendChild(renderer.view);


// document.body.appendChild(renderer.view);
// var bgTex = PIXI.Texture.fromImage('bg.jpg');
// var bg = new PIXI.Sprite(bgTex);
basestage.addChild(bg);
function animate() {
    requestAnimFrame( animate );
    Game.render();
    renderer.render(basestage);
}
