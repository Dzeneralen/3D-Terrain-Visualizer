/*
* hg.filehandler.js 
* Containing functions to handle file reading
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

/** Globals are $, hg */

hg.filehandler = (function () {

	var configMap = {
		main_html : String()
			+ '<div class="hg-filehandler-dropbox"></div>',
		dropbox_infotext : '<div class="hg-filehandler-dropbox-text">Drop your files here</div>',
		callback_func : null
	},
	stateMap = {
		$container : null
	},
	jqueryMap = {},
	fileReader,
	initModule,
	checkFileApiSupport,
	initReader,
	onDragOver,
	onDropFile,
	readFileContentAsText,
	setJqueryMap;

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			$dropbox : $container.find( '.hg-filehandler-dropbox' )
		};
	};

	checkFileApiSupport = function () {
		if(window.File && window.FileReader && window.FileList && window.Blob){
			return true;
		} 
		return false;
	};

	readFileContentAsText = function ( files ) {
		console.log('Read file as text');
		var fileReader = new FileReader();

		fileReader.onload = function() {
			configMap.callback_func( fileReader.result );
		};

		fileReader.readAsText(files);
	};

	onDropFile = function ( event ) {
		event.preventDefault();
		event.stopPropagation();

		var i,
			files = event.dataTransfer.files || event.target.files;

		console.log('File dropped on dropbox');
		console.log(files);

		for(i = 0; i < files.length; i++)
		{
			readFileContentAsText(files[i], i);
		}		
	};

	onDragOver = function ( event ) {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	};

	initReader = function () {
		if( checkFileApiSupport() ){
			jqueryMap.$dropbox[0].addEventListener('dragover', onDragOver, false);
			jqueryMap.$dropbox[0].addEventListener('drop', onDropFile, false);
			jqueryMap.$dropbox[0].innerHTML = configMap.dropbox_infotext;

			return true;
		}

		alert('The File APIs are not fully supported in this browser.');
	};

	initModule = function ( $container, callback ) {
		stateMap.$container = $container;
		stateMap.$container.html( configMap.main_html );
		if(callback) { configMap.callback_func = callback; }
		setJqueryMap();

		initReader();

		return true;
	};

	return { initModule : initModule };
}());