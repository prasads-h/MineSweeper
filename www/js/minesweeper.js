
/**
 * 
 */

var MS_OBJ;


jQuery(document).click(function(){
	showPage("StartPage");	
	//jQuery("#MyModal").show();
	jQuery("#MyModal .close").click(function(e){
		jQuery("#MyModal").hide();
	})
	
	startAnimate();
	
	
});

function startAnimate(){
	var el = document.getElementById("StartGame");
	
	startShow(el);
}

function startShow(el){
	el.style.opacity = 0;
	el.style.display ='block';
	
	var timer = setInterval(function(){
		if(el.style.opacity <=1){
			el.style.opacity = Number(el.style.opacity) + 0.1;
		}else{
			clearInterval(timer);
			startTimeout(el);
		}
	}, 200);
	
	
}

function startTimeout(el){
	var timeoutId = setTimeout(function(){
		var timer = setInterval(function(){
			if(el.style.opacity >=0){
				el.style.opacity = Number(el.style.opacity) - 0.1;
			}else{
				clearInterval(timer);
				//startTimeout(el);
			}
		}, 500);
	}, 3000);
}

function showHighestScores(){
	_File.readHSFile(fileReader);
	
	function fileReader(result){
		console.log("In FileReader result is :::: "+ result);
		if(result == null)return;
		var r = getNameScores(result);
		console.log(JSON.stringify(r));
		var html = "<table><tr><th>Name</th><th>Score(Mins)</th></tr>"
		for (var key in r){
			html += "<tr>";
			html += "<td style='width:50%'>" + key + "</td>";
			console.log("number of secs   "+ r[key]);
			html += "<td style='width:50%'>" + (r[key]/60).toFixed(1) + "</td>";
			html += "</tr>"
		}
		html +="</table>";
		
		jQuery(".modal-body").html(html);
		jQuery("#MyModal").show();
	}
	
	function getNameScores(fileContent){
		var res = {};
		if(fileContent != ""){
			var sc = fileContent.split("\t");
			
			for(var i=0; i< sc.length; i++){
				if(i%2 !=0){					
					res[sc[i-1]] = sc[i]; // name with score;
				}
			}
		}		
		return res;
	}
}


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
		console.log("coming to hscores");
		showHighestScores();
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

/*
 * Called on selecting level in levepage
 * Bombs can be configired using % or integers based on your prefereences
 */

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
		initGameBoard(10, 15, "40%");
		break;
	}
}
