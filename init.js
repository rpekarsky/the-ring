var basestage = new PIXI.Stage(0x202020);

var renderer = PIXI.autoDetectRenderer(360,480);
PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY] = [renderer.gl.DST_ALPHA,renderer.gl.DST_COLOR];
var renderTexture = new PIXI.RenderTexture(360, 480);
var backgroundTexture = new PIXI.RenderTexture(360, 480);
var stage = new PIXI.Stage(0x000000);
var bgStage = new PIXI.Stage(0x000000);

var quad = new PIXI.Quad(backgroundTexture,renderTexture);
stage.addChild(quad);

document.body.appendChild(renderer.view);

var background = new Background;
bgStage.addChild(background.layer);
var aloader = new PIXI.AssetLoader(['spriteSheet.json']);
aloader.addEventListener('onComplete',function(){
	background.init();

	var logo = new PIXI.Sprite.fromFrame('logo.png');
	logo.pivot.x = logo.width/2;
	logo.pivot.y = logo.height/2;
	logo.x = 360/2;
	logo.y = 480/2;
	logo.alpha = 1;
	// basestage.addChild(logo);
	
	quad.update();
	animate();
},false)
aloader.load();



function animate() {
    requestAnimFrame( animate );    
    Game.render();

    backgroundTexture.clear();
    backgroundTexture.render(bgStage);

    renderTexture.clear();
    renderTexture.render(basestage);
    renderer.render(stage);
}


