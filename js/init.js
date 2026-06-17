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
var aloader = new PIXI.AssetLoader(['spriteSheet_en.json', 'font/Comfortaa.fnt']);
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

// gameWidth/gameHeight are baked at construction time into 136 places across 12
// files. Re-laying out every state on resize would be a refactor — instead we
// reload the page. Score/unlocks live in localStorage; user lands on title screen,
// which is acceptable for a resize event.
//
// Width-only comparison: on mobile, the address bar auto-hide/show changes
// innerHeight by 50-100px, firing resize events constantly. innerHeight is
// unreliable as a "viewport really changed" signal. innerWidth only changes on
// orientation flip or a genuine window resize — those are the cases we want to
// reload for.
var initialW = window.innerWidth;
function maybeReload(){
    if (Math.abs(window.innerWidth - initialW) > 50) {
        window.location.reload();
    }
}
var resizeReloadTimer;
function scheduleResizeReload(){
    clearTimeout(resizeReloadTimer);
    resizeReloadTimer = setTimeout(maybeReload, 200);
}
window.addEventListener('resize', scheduleResizeReload);
window.addEventListener('orientationchange', scheduleResizeReload);

// PWA initial-load safety: window.innerWidth at parse-time can be stale
// (window chrome still settling). Same width-only check at 500ms.
setTimeout(maybeReload, 500);

