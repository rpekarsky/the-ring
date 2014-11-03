var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

var gameWidth = 360;
var gameHeight = 480;

var gameWidth = 320;
var gameHeight = 320;
// gameWidth /= 1.8;;
// gameWidth = (360/2)/320*360;
// gameHeight = (360/2)/320*480;


var stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.bottom = '0px';


var PixelRatio = window.devicePixelRatio;
var rendered = new Signal();

var basestage = new PIXI.Stage(0x202020);
var renderer = PIXI.autoDetectRenderer(gameWidth,gameHeight);
var renderTexture = new PIXI.RenderTexture(gameWidth, gameHeight);
var backgroundTexture = new PIXI.RenderTexture(gameWidth/2, gameHeight/2);
var stage = new PIXI.Stage(0x000000);
var bgStage = new PIXI.Stage(0x000000);


PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY] = [renderer.gl.DST_ALPHA,renderer.gl.DST_COLOR];
document.body.appendChild(renderer.view);

// document.body.appendChild( stats.domElement );



var background = new Background;
bgStage.addChild(background.layer);
bgStage.addChild(background.layerDebug);

// var topMenu = new TopMenu();

var states = new States();


var settingsIcon = new SettingIcon();
var backIcon = new BackIcon();
// var settings = new Settings();
var aloader = new PIXI.AssetLoader(['spriteSheet.json','font/Comfortaa.fnt']);
aloader.addEventListener('onComplete',function(){
	background.init();
	TouchInput.init();
	Score.init();
	// topMenu.init();
	settingsIcon.init();
	backIcon.init();



	states.open(states.states.menu);
	// settings.init();
	
	quad.update();
	// if(window.location.href.match(/mothgames.ru/) || window.location.href.match(/home\/roman/)){
		animate();
	// }

},false)
aloader.load();

var time = Date.now();
var quad = new PIXI.Quad(backgroundTexture,renderTexture);
stage.addChild(quad);
function animate() {
    stats.end();
    stats.begin();
	rendered.dispatch();
    requestAnimFrame( animate );

    backgroundTexture.clear();
    backgroundTexture.render(bgStage);

    renderTexture.clear();
    renderTexture.render(basestage);
    renderer.render(stage);
}




