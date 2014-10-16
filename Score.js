var Score = (function () {
	var curScore = 0;
	var maxScore = JSON.parse(localStorage.getItem('maxScore') || 0);

	var maxScoreDOM = document.createElement('div');
	maxScoreDOM.className = 'over right';
	var curScoreDOM = document.createElement('div');
	curScoreDOM.className = 'over left';
	return {
		init:function(){
			document.body.appendChild(curScoreDOM);
			document.body.appendChild(maxScoreDOM);
			this.update();
		},
		update:function(){
			curScoreDOM.textContent = 'Current Score: '+ curScore;
			maxScoreDOM.textContent = 'Max Score: '+ maxScore;
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
})()