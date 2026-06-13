var Score = (function () {
	var scores = {};
	var scoreSprite = undefined;
	var highScoreSprite = undefined;
	var newHighScoreSprite = undefined;
	var layer = new PIXI.DisplayObjectContainer();

	return {
		init:function(){
			scoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('yourscore'));
			scoreSprite.tint = 0x404040;
			scoreSprite.pivot.x = scoreSprite.width/2;
			scoreSprite.x = gameWidth/2;

			highScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('highscore'));
			highScoreSprite.tint = 0x404040;
			highScoreSprite.pivot.x = highScoreSprite.width/2;
			highScoreSprite.x = gameWidth/2;

			highScoreSprite.y = 50;

			newHighScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('new_highscore'));
			newHighScoreSprite.tint = 0x404040;
			newHighScoreSprite.pivot.x = newHighScoreSprite.width/2;
			newHighScoreSprite.x = gameWidth/2;

			newHighScoreSprite.y = 100;

			layer.pivot.x = gameWidth/2;
			layer.pivot.y = gameHeight/2;

			layer.x = gameWidth/2;
			layer.y = gameHeight/2;


			layer.addChild(scoreSprite);
			layer.addChild(highScoreSprite);
			layer.addChild(newHighScoreSprite);
			basestage.addChild(layer);
			layer.visible = false;
			scores = Storage.get('scores') || {
				total:0,
				zen:{
					score:0,
					highScore:0
				},
				mondo:{
					score:0,
					highScore:0
				},
				dharma:{
					score:0,
					highScore:0
				},
				koan:{
					score:0,
					highScore:0
				}
			};
		},
		update:function(){
			Storage.set('scores',scores);
		},
		showAnimation:function(){

		},
		createDummy:function(type){
			var scObj = {
				score:0,
				highscore:0
			};
			scores[type] = scObj;
			return scObj;
		},
		setScore:function(type,score){
			var scObj = scores[type] || this.createDummy(type);
			scObj.score = score;
			this.update();
		},
		getScore:function(type){
			var scObj = scores[type] || this.createDummy(type);
			return scores[type].score || 0;
		},
		getTotal:function(){
			return scores.total || 0;
		},
		getHighScore:function(type){
			var scObj = scores[type] || this.createDummy(type);
			return scObj.highScore || 0;
		},
		addScore:function(type,score){
			var scObj = scores[type] || this.createDummy(type);
			scores.total += score;
			scObj.score += score;
			this.update();
			return scObj.score;
		},
		updateHighScore:function(type){
			var scObj = scores[type] || this.createDummy(type);
			if(scObj.score > scObj.highScore){
				scObj.highScore = scObj.score;
			}
			this.update();
			return scObj.highScore;
		}
	};
})();