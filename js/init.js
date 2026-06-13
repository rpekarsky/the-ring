var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

// localStorage.clear();
// var gameWidth = 360;
// var gameHeight = 480;

// var gameWidth = 320;
// var gameHeight = 320;
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
// bgStage.addChild(background.layerDebug);

// var topMenu = new TopMenu();

var states = new States();


if(Storage.get('music-opt') == null){
	Storage.set('music-opt',true);
}
if(Storage.get('sound-opt') == null){
	Storage.set('sound-opt',true);
}
if(Storage.get('vibro-opt') == null){
	Storage.set('vibro-opt',true);
}


var settingsIcon = new SettingIcon();
var backIcon = new BackIcon();
// var settings = new Settings();
// Locale-aware asset loading. Original 1.1.4 used tizen.systeminfo.getPropertyValue('LOCALE');
// on web we use navigator.language ('ru-RU', 'en-US', etc.) — same logic, different source.
var spriteSheet = (navigator.language || 'en').toLowerCase().indexOf('ru') === 0
	? 'spriteSheet.json'
	: 'spriteSheet_en.json';

var aloader = new PIXI.AssetLoader([spriteSheet, 'font/Comfortaa.fnt']);
aloader.addEventListener('onComplete',function(){
	background.init();
	TouchInput.init();
	Score.init();
	Sound.init();
	// topMenu.init();
	settingsIcon.init();
	backIcon.init();



	states.open(states.states.title);
	// settings.init();

	quad.update();
	// if(window.location.href.match(/mothgames.ru/) || window.location.href.match(/home\/roman/)){
		animate();
	// }
	// setInterval(animate,1000/10);

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

// Letterbox the canvas to fit the viewport, preserving the load-time aspect ratio.
// Game internals render at the original gameWidth/gameHeight; CSS scales the canvas.
// TouchInput uses renderer.view.getBoundingClientRect() to map page→canvas coords.
function fitCanvas(){
    var aspect = gameWidth / gameHeight;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var fitByWidth = w / aspect <= h;
    var cssW = Math.floor(fitByWidth ? w : h * aspect);
    var cssH = Math.floor(fitByWidth ? w / aspect : h);
    renderer.view.style.width  = cssW + 'px';
    renderer.view.style.height = cssH + 'px';
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

