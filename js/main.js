var GAME_STATE = {
	Splash : 0,
    MainScreen : 1,
    NumPad : 2,
    History : 3,
    Nothing : 4
};

var currentGameState = GAME_STATE.MainScreen;

var totalIncome = 0;
var totalExpense = 0;
var totalBalance = totalIncome - totalExpense;
var fileName = "Gastos.txt";


var addingIncome = false;
var icomButtonSelected = false;
var expenseButtonSelected = false;
var resetButtonSelected = false;
var histButtonSelected = false;

var errorCount = 0;
var headString = "";
var isPointAdded = false;
var applicationJustStarted  = true;

var  showingHistory = false;


$(window).load(function(){
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName == "back"){
			if(!showingHistory){
				tizen.application.getCurrentApplication().exit();
			}else{
				BackHistory();
			}
		}
    });
	
	setTimeout(function(){
		currentGameState = GAME_STATE.MainScreen;
		DrawAll();
	},2000);
	
	
	/////FILING RELATED/////
	var documentsDir;
	tizen.filesystem.resolve('documents', function(dir) {
		documentsDir = dir;
		//console.log("Mount point Name is " +  dir.path);
		appendAndReadFile();
		DrawAll();
	}, function(e) {
		//console.log("Error" + e.message);
	}, "rw");
	
	
	function writeFile(name, data) {//writeFile("DailyExpense.txt", anyString);
		var testFile = documentsDir.createFile(name);
		if (testFile != null) {
			testFile.openStream("a", function(fs) {
				fs.write(data);
				fs.close();
				appendAndReadFile();
			}, function(e) {
				//console.log("Error While Opening a Stream" + e.message);
			}, "UTF-8");
		}
	}

	
	function appendAndReadFile() {
		documentsDir.listFiles(onsuccess, onerror);
	}	
	function onsuccess(files) {
		
		if(files.length < 1){
			//console.log("About to Call writeFile");
			writeFile(fileName, "START");
		}else{
			var fileFound = false;
			for ( var i = 0; i < files.length; i++) {
				//console.log("File Name is " + files[i].name); // displays file name			
				if (files[i] != null && !files[i].isDirectory) {
					//console.log(files[i]);
					if (files[i] != null && files[i].name == fileName) {
						fileFound = true;
						var fileObject = files[i];
						//console.log("files[i].fullPath = " + files[i].fullPath);
						if(!applicationJustStarted && headString.length > 0){							
							files[i].openStream("a", function(fs) {
								if(addingIncome){
									fs.write(";i" + headString);
								}else{
									fs.write(";e" + headString);
								}
								fs.close();
								fileObject.readAsText(function(str) {
									updateIncomeExpenseAndBalance(str);
								});
							}, function(e) {
								//console.log("Error While Opening a Stream" + e.message);
							}, "UTF-8");
						}else{
							applicationJustStarted = false;
							fileObject.readAsText(function(str) {
								updateIncomeExpenseAndBalance(str);
							});
						}
					}
				}
			}
			if(!fileFound){
				//console.log("About to Call writeFile");
				writeFile(fileName, "START");				
			}
		}
	}
	function onerror(error) {
		//console.log("The error " + error.message + " occurred when listing the files in the selected folder");
		if(errorCount < 3){
			errorCount++;
			//console.log("About to Call writeFile");
			writeFile(fileName, "START");
		}
	}
	


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	DrawAll();	
	var c = document.getElementById("myCanvas");
    c.addEventListener("touchstart", phaseCalcul, false);    
    function phaseCalcul(e) {
	  var pTarget = e.touches.item(0);
	  
	  if(currentGameState == GAME_STATE.MainScreen){
		  //console.log("touchstart CALLED");
		  if(pTarget.screenX < 150 && pTarget.screenY < 110 && !icomButtonSelected){
			  //console.log("Income Pressed");
			  produceSounds(false);
			  icomButtonSelected = true;
			  DrawAll();
		  }else if(pTarget.screenX > 170 && pTarget.screenY < 110 && !expenseButtonSelected){
			  //console.log("Expense Pressed");
			  produceSounds(false);
			  expenseButtonSelected = true;
			  DrawAll();
		  }else if(pTarget.screenX > 20 && pTarget.screenX < 148 && pTarget.screenY > 256 && !resetButtonSelected){
			  //console.log("Reset Pressed");
			  produceSounds(false);
			  resetButtonSelected = true;
			  DrawAll();
		  }else if(pTarget.screenX > 172 && pTarget.screenX < 300 && pTarget.screenY > 256 && !histButtonSelected){
			  //console.log("History Pressed");
			  produceSounds(false);
			  histButtonSelected = true;
			  DrawAll();
		  }
	  }else if(currentGameState == GAME_STATE.NumPad){
		  
		  //console.log("touchstart CALLED");
		  if(pTarget.screenY > 48 && pTarget.screenY < 126){
			  if(pTarget.screenX < 82){
				  //console.log("1 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "1";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 81 && pTarget.screenX < 158){
				  //console.log("2 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "2";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 157 && pTarget.screenX < 230){
				  //console.log("3 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "3";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 229){
				  //console.log("4 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "4";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }
		  }else if(pTarget.screenY > 125 && pTarget.screenY < 186){
			  if(pTarget.screenX < 82){
				  //console.log("5 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "5";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 81 && pTarget.screenX < 158){
				  //console.log("6 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "6";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 157 && pTarget.screenX < 230){
				  //console.log("7 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "7";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 229){
				  //console.log("8 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "8";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }
		  }else if(pTarget.screenY > 185 && pTarget.screenY < 246){
			  if(pTarget.screenX < 82){
				  //console.log("9 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "9";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 81 && pTarget.screenX < 158){
				  //console.log("10 Press");
				  if((!isPointAdded && headString.length < 7) || (isPointAdded && headString.length < 11)){
					  headString = headString + "0";
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 157 && pTarget.screenX < 230){
				  //console.log(". Press");				 
				  if(!isPointAdded){
					  headString = headString + ".";
					  produceSounds(false);
					  isPointAdded = true;
				  }else{
					  produceSounds(true);
				  }
			  }else if(pTarget.screenX > 229){
				  //console.log("<- Press");
				  if(headString.length > 0){
					  if(headString[headString.length-1] == "."){
						  isPointAdded = false;
					  }
					  headString = headString.substring(0, headString.length - 1);
					  produceSounds(false);
				  }else{
					  produceSounds(true);
				  }
			  }
		  }else if(pTarget.screenY > 245){
			  if(pTarget.screenX < 158){
				  //console.log("Okay Press");
				  produceSounds(false);
				  appendAndReadFile();
				  currentGameState = GAME_STATE.MainScreen;
			  }else{
				  //console.log("Cancel Press");
				  produceSounds(false);
				  currentGameState = GAME_STATE.MainScreen;				  
			  }			  
		  }
		  DrawAll();
	  }
    }
    
    c.addEventListener("touchmove", touchMoveHandler, false);    
    function touchMoveHandler(e) {
	  var pTarget = e.touches.item(0);
	  
	  if(currentGameState == GAME_STATE.MainScreen){
		  //console.log("touchmove CALLED");
		  if(icomButtonSelected){
			  if(!(pTarget.screenX < 150 && pTarget.screenY < 110)){
				  icomButtonSelected = false;				  
				  DrawAll();
			  }
		  }else if(expenseButtonSelected){
			  if(!(pTarget.screenX > 170 && pTarget.screenY < 110)){
				  expenseButtonSelected = false;				  
				  DrawAll();
			  }
		  }else if(resetButtonSelected){
			  if(!(pTarget.screenX > 20 && pTarget.screenX < 148 && pTarget.screenY > 256)){
				  resetButtonSelected = false;				  
				  DrawAll();
			  }
		  }else if(histButtonSelected){
			  if(!(pTarget.screenX > 172 && pTarget.screenX < 300 && pTarget.screenY > 256)){
				  histButtonSelected = false;				  
				  DrawAll();
			  }
		  }
	  }
    }
    
    c.addEventListener("touchend", touchEndHandler, false);    
    function touchEndHandler(e) {
	  var pTarget = e.touches.item(0);
	  
	  if(currentGameState == GAME_STATE.MainScreen){
		  //console.log("touchend CALLED");
		  if(icomButtonSelected){
			  icomButtonSelected = false;
			  currentGameState = GAME_STATE.NumPad;
			  addingIncome = true;
			  headString = "";
			  isPointAdded = false;
			  DrawAll();
		  }else if(expenseButtonSelected){
			  expenseButtonSelected = false;
			  currentGameState = GAME_STATE.NumPad;
			  addingIncome = false;
			  headString = "";
			  isPointAdded = false;
			  DrawAll();
		  }else if(resetButtonSelected){
			  resetButtonSelected = false;
			  Reset();
			  DrawAll();
		  }else if(histButtonSelected){
			  histButtonSelected = false;
			  History();
			  DrawAll();
		  }
	  }
    }
    
    c.addEventListener("touchcancel", touchCancelHandler, false);    
    function touchCancelHandler(e) {
	  var pTarget = e.touches.item(0);
	  
	  if(currentGameState == GAME_STATE.MainScreen){
		  //console.log("touchcancel CALLED");
		  if(icomButtonSelected){
			  icomButtonSelected = false;
			  DrawAll();
		  }else if(expenseButtonSelected){
			  expenseButtonSelected = false;
			  DrawAll();
		  }else if(resetButtonSelected){
			  resetButtonSelected = false;
			  DrawAll();
		  }else if(histButtonSelected){
			  histButtonSelected = false;
			  DrawAll();
		  }
	  }
    }
   //Below code is to keep the screen on
   tizen.power.request("SCREEN", "SCREEN_NORMAL");
});




function BackHistory(){
	$('#myCanvas').css('display', 'inline');
	$('#main_list').css('display', 'none');
	showingHistory = false;
}

function addRowInList(name) {
	$("#main_list_content ul").append('<li><a href="#">' + name + '</a></li>');
}

function Reset(){	
	if(confirm("¿Seguro que quieres borrar el historial completo? ¡No podrás recuperarlo!")){
		console.log("ok");
		var documentsDir;
		tizen.filesystem.resolve('documents', function(dir) {
			documentsDir = dir;
			//console.log("Mount point Name is " +  dir.path);
			documentsDir.deleteFile("documents/" + fileName);
			totalIncome = 0;
			totalExpense = 0;
			totalBalance = 0;
			DrawAll();
		}, function(e) {
			//console.log("Error" + e.message);
		}, "rw");
	}else{
		console.log("cancel");
	}

	
}


function updateIncomeExpenseAndBalance(fileContent){
	totalIncome = 0;
	totalExpense = 0;
	totalBalance = 0;
	//console.log("File content: " + fileContent); 
	var arrayy = fileContent.split(';');
	//console.log("arrayy length = " + arrayy.length);
	for ( var j = 0; j < arrayy.length; j++) {
		//console.log("arrayy["+j+"] = " + arrayy[j]);
		var numStr = arrayy[j];
		if(j != 0){
			if(numStr.slice(0,1) == "i"){
				numStr = numStr.slice(1,numStr.length);
				totalIncome = totalIncome + parseFloat(numStr);
			}else{
				numStr = numStr.slice(1,numStr.length);
				totalExpense = totalExpense + parseFloat(numStr);
			}
		}
	}
	totalBalance = (totalIncome - totalExpense);
	//console.log("totalIncome = " + totalIncome);
	//console.log("totalExpense = " + totalExpense);
	//console.log("totalBalance = " + totalBalance);
	DrawAll();
}

function produceSounds(isErrro){
	
	if(isErrro){
		//document.getElementById('ERROR').play();
		singleVibration(200);
	}else{
		//document.getElementById('CLICK').play();
	}
	
}
function singleVibration(time){
   navigator.vibrate(time);
}

function DrawAll(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	if(currentGameState == GAME_STATE.Splash){
		ctx.drawImage(document.getElementById("SPLASH"),0,0);
	}else if(currentGameState == GAME_STATE.MainScreen){
		
		ctx.drawImage(document.getElementById("BACKGROUND"),0,0);

		if(icomButtonSelected){
			ctx.drawImage(document.getElementById("INCOMEBUTTON"),17,17);
		}else if(expenseButtonSelected){
			ctx.drawImage(document.getElementById("EXPENSEBUTTON"),167,17);
		}else if(resetButtonSelected){
			ctx.drawImage(document.getElementById("RESETBUTTON"),49,253);
		}else if(histButtonSelected){
			ctx.drawImage(document.getElementById("HISTORYBUTTON"),169,253);
		}
		
		ctx.textAlign="right"; 
		ctx.font = "24px Arial";
		ctx.fillStyle="#FFFFFF";
		ctx.fillText((totalIncome.toFixed(2)).toLocaleString(),294,154);
		ctx.fillStyle="FFFFFF";
		ctx.fillText((totalExpense.toFixed(2)).toLocaleString(),294,188);
		if(totalBalance > 0){
			ctx.fillStyle="00FF00";
		}else{
			ctx.fillStyle="FF0000";
		}
		ctx.fillText((totalBalance.toFixed(2)).toLocaleString(),294,226);
		
	}else if(currentGameState == GAME_STATE.NumPad){
		
		ctx.drawImage(document.getElementById("NUMPAD"),0,0);
		
		ctx.textAlign="right"; 
		ctx.font = "40px Arial";
		ctx.fillStyle="#FFFFFF";
		ctx.fillText(headString.toLocaleString(),280,50);
	}
}

function History() {	
	var documentsDir;
	tizen.filesystem.resolve('documents', function(dir) {
		documentsDir = dir;
		documentsDir.listFiles(onsuccessHist, onerrorHist);
	}, function(e) {
		//console.log("Error" + e.message);
	}, "rw");
	$("#main_list_content ul").empty();
}
function onsuccessHist(files) {	
	if(files.length > 0){
		for ( var i = 0; i < files.length; i++) {
			if (files[i] != null && !files[i].isDirectory &&  files[i].name == fileName) {
				files[i].readAsText(function(str) {
					displayHistory(str);
				});
			}
		}
	}
}
function onerrorHist(error) {
	//console.log("The error " + error.message + " occurred while showing History");
}
function displayHistory(fileContent){
	//console.log("File content: " + fileContent); 
	var arrayy = fileContent.split(';');
	//console.log("arrayy length = " + arrayy.length);
	for ( var j = arrayy.length-1; j > 0;  j--) {
		//console.log("arrayy["+j+"] = " + arrayy[j]);
		var numStr = arrayy[j];
		if(j != 0){
			if(numStr.slice(0,1) == "i"){
				numStr = numStr.slice(1,numStr.length);
				addRowInList("+" + numStr);
			}else{
				numStr = numStr.slice(1,numStr.length);
				addRowInList("-" + numStr);
			}
		}
	}
	$('#myCanvas').css('display', 'none');
	$('#main_list').css('display', 'inline');
	showingHistory = true;
}

