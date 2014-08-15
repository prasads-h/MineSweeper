/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
    	/*
    	 * These events are fired by corodova framework
    	 */
    	
        document.addEventListener('deviceready', this.onDeviceReady, false);
        /*
         * pause event is triggered when u go out of the game screen in device
         */
        document.addEventListener('pause', function(){
        	if(MS_OBJ && !MS_OBJ.isPaused){
        		MS_OBJ.pauseGame();
        	}
        }, false);
        /*
         * resume event is triggered when you bring up the background game 
         */
        document.addEventListener('resume', function(){
        	if(MS_OBJ && MS_OBJ.isPaused && !jQuery("#pauseBtn").hasClass('paused')){
        		MS_OBJ.resumeGame();
        	}
        }, false);        
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){console.log("hello fs");}, onFileOpenError);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
*/
        console.log('Received Event::::::::::::: ' + id);
    }
};


/*
 * 	File wirting and reading for Highest scores
 */

var __fileSystem, __fileEntry, __fileWriter, __fileReader;

function gotFileSystem(fileSystem) {
	__fileSystem = fileSystem;
	//fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, onFileOpenError);
}

var _File = {};

_File.getFileSystem = function(callback, onError){
	console.log("yes in getfilesystem");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, callback, onError || onFileOpenError);
}

/*
 * All file operations work based on event generations
 * fileReader: function to be called once after reading the file
 * onError : optional error callback to be called during any error like FileNotFound
 */
_File.readHSFile = function(fileReader, onError){
	var fs;
	this.getFileSystem(function(_fs){ console.log("fs received");readFile(_fs);}, onError);
	function readFile(fs){
		console.log("read filesystem");
		fs.root.getFile("HighestScores.txt", null, gotFileEntry, onError|| onFileOpenError);
	}
	function gotFileEntry(fileEntry){
		console.log("read fielentry in read");
		fileEntry.file(gotFile,onError || onFileOpenError);
	}
	
	function gotFile(file){
		readAsText(file);
		function readAsText(file) {
	        var reader = new FileReader();
	        reader.onloadend = function(evt) {
	            console.log("Read as text");
	            console.log(evt.target.result);
	            fileReader(evt.target.result); // callign the fileReader call back here
	        };
	        reader.readAsText(file);
	    }
	}
	
}

_File.writeHSScore = function(newname, newscore){
	var self = this;
	this.readHSFile(onReading, onError);
	
	function onReading(result){		
		writeContent.call(self, result);
	}
	
	function onError(){
		writeContent.call(self, "");
	}
	
	
	function writeContent(fileContent){
		console.log("file content issss "+ fileContent);
		this.getFileSystem(function(_fs){ console.log("fs received");readFile(_fs);});
		function readFile(fs){
			console.log("read filesyste");
			fs.root.getFile("HighestScores.txt", {create: true, exclusive: false}, gotFileEntry, onFileOpenError);
		}
		function gotFileEntry(fileEntry){
			console.log("read fielentry in read");
			fileEntry.createWriter(gotFileWriter, onFileOpenError);
		}
		
		function getNameScores(){
			var res = {};
			if(fileContent != ""){
				console.log("filecontnet in namescores " + fileContent);
				var sc = fileContent.split("\t");
				console.log("after split " + sc);
				for(var i=0; i< sc.length; i++){
					if(i%2 !=0){					
						res[sc[i-1]] = sc[i]; // name with score;
					}
				}
			}	
			
			res[newname] = newscore; // overrides the value if present
			console.log('new result ' + JSON.stringify(res));
			return res;
		}
		
		function gotFileWriter(writer) {	  
			console.log("FileWriter asfsdfsfs");
	        var nameScores = getNameScores();
	        var keys = Object.keys(nameScores);
	        var len = keys.length;
	        
	        
	        writeFile(keys, 0, len);
	        
		        function writeFile(keys, index, len){
		        	
		        	console.log("writing "+ keys[index] + " "+ nameScores[keys[index]]);
		        	writer.write(keys[index] + "\t" + nameScores[keys[index]] +"\t");
		        	index++;
		        	writer.onwriteend = function(evt){
		        		if(index == len) return;
		        		writer.seek(writer.length);
		        		
		        		writeFile(keys, index, len);
		        	}	        	
		        }
	        	
	       }
	    }
	}
	


function onFileOpenError(evt){
	if(evt.code){
		console.log("error occured "+ evt.code);
		if(evt.code == 1){
			alert("No Highest Scores");
		}
	}else if(evt.target){
		console.log("error occured target "+ evt.target.error.code);
	}else{
		console.log("unable to catch error "+ evt);
	}	
}
