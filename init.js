
// create an new instance of a pixi stage





var basestage = new PIXI.Stage(0x202020);
// var basestage = new PIXI.Stage(0xffffff);
 
// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(360,480);
var renderTexture = new PIXI.RenderTexture(360, 480);

// // create a new render texture..
// var renderTexture = new PIXI.RenderTexture(20*32, 20*6*2);
// var renderTexture = new PIXI.RenderTexture(100,100);

// var quad = new PIXI.Sprite(renderTexture);
var bgTex = PIXI.Texture.fromImage('bgsmall.jpg');
// var lionTex = PIXI.Texture.fromImage('lion.jpg');
// sprite.x = 320/2;
// sprite.y = 480/2;
// quad.scale.x = 360;
// quad.scale.y = 480;

var stage = new PIXI.Stage(0x202060);

// setTimeout(function(){
	var quad = new PIXI.Quad(bgTex,renderTexture);
	stage.addChild(quad);
// },2000);

document.body.appendChild(renderer.view);

var aloader = new PIXI.AssetLoader(['bgsmall.jpg','blink_alpha.png']);
aloader.addEventListener('onComplete',function(){
	// console.log("YA!");
	quad.update();
	animate();
},false)
aloader.load();


function animate() {
    requestAnimFrame( animate );
    
    Game.render();

    renderTexture.clear();
    renderTexture.render(basestage);    
    renderer.render(stage);
}


