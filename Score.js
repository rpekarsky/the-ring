var Score = (function () {
	var curScore = 0;
	var maxScore = JSON.parse(localStorage.getItem('maxScore') || 0);

	var maxScoreDOM = document.createElement('div');
	maxScoreDOM.className = 'over highscore';
	var curScoreDOM = document.createElement('div');
	curScoreDOM.className = 'over score';

	var LevelDOM = document.createElement('div');
	LevelDOM.className = 'over level';

	var multiplerDOM = document.createElement('div');
	multiplerDOM.className = 'over multipler';

	return {
		init:function(){
			document.body.appendChild(curScoreDOM);
			document.body.appendChild(maxScoreDOM);
			document.body.appendChild(LevelDOM);
			document.body.appendChild(multiplerDOM);
			this.update();
		},
		update:function(){
			curScoreDOM.textContent = 'Score: '+ curScore;
			maxScoreDOM.textContent = 'Max Score: '+ maxScore;
			// multiplerDOM.textContent = 'x'+game.level.multipler;
			// LevelDOM.textContent = 'Level: '+ ((game.levelNum||0)+1);
		},
		setLevel:function(score){
			curScore = score;
			if(curScore > maxScore){
				this.setMaxScore(curScore);
			}
			this.update();
		},
		setScore:function(score){
			curScore = score;
			if(curScore > maxScore){
				this.setMaxScore(curScore);
			}
			this.update();
		},
		setMaxScore:function(score){
			maxScore = score;
			localStorage.setItem('maxScore',maxScore);
			this.update();
		},
		getScore:function(){
			return curScore;
		},
		addScore:function(scoreToAdd){
			this.setScore(curScore+scoreToAdd);
		}
	};
})();