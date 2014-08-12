/**
 * 
 */

var MS_OBJ;


jQuery(document).ready(function(){
	showPage("StartPage");	
	
});


function menuSelected(e){
	var target = e.target;
	var attr = jQuery(target).attr("data-value");
	switch(attr){
	case "new":
		showPage("LevelPage");
		break;
	case "restart":
			if(MS_OBJ)
				MS_OBJ.restart();
		break;
	case "hscores":
		break;
	case "exit":
		if(confirm("Are you sure?"))
			navigator.app.exitApp();
		break;
	}
}
// When the DOM is ready, build the mine sweeper game.
function initGameBoard(col, row, lCnt) {
	
	jQuery("#GamePage").html('');
	jQuery('#GamePage').html(jQuery("#GamePageContent").html());
	
	if(MS_OBJ)
		MS_OBJ.clearAll();

	MS_OBJ = new MineSweeper(jQuery("table.mine-sweeper"), col, row,
	lCnt);

	showPage("GamePage");
	
	bindGamePageEvents();
	
};

function bindGamePageEvents(){
	jQuery("#MenuBar").click(function(e){
		menuSelected(e);
	});
}

function startGame() {
	
	showPage("LevelPage");
		
}

function showPage(str){
	var id = {"GamePage": "GamePage", "LevelPage": "GameLevel", "StartPage": "StartPage"};
	var p = ["GamePage", "LevelPage", "StartPage"];
	p.forEach(function(page){
			jQuery("#"+id[page]).hide();
		});
	jQuery("#"+id[str]).fadeIn("slow");
	
	
}

/*
 * To change pause button to reusme and vice versa
 */
function pauseGame() {
	
	var pBtn = jQuery("#pauseBtn");	
	if (pBtn.hasClass("paused")) {
		MS_OBJ.resumeGame();
		
	} else {
		
		MS_OBJ.pauseGame();
			}
	pBtn.toggleClass("paused");
}

function onLevelSelect(e) {

	var $this = jQuery(e.target);
	var level = $this.attr("data-level");
	// alert(level);
	switch (level) {
	case "easy":
		initGameBoard(10, 10, "13%");
		break;
	case "medium":
		initGameBoard(10, 13, "25%");
		break;
	case "hard":
		initGameBoard(10, 15, "60%");
		break;
	}
}
