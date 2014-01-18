/*
* hg.shell.js 
* Shell controlling everything for hg
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

/** Globals are $, hg */

hg.shell = (function () {

	var configMap = {
		main_html : String()
			+ '<div class="hg-shell-webgl"></div>'
			+ '<div class="hg-shell-sidebar"></div>',
		sidebar_title : 'Tools inc'
	},
	stateMap = {
		$container : null
	},
	jqueryMap = {},
	initModule,
	parseTextString,
	parsePointFromString,
	setJqueryMap;

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			$webgl : $container.find( '.hg-shell-webgl' ),
			$sidebar : $container.find( '.hg-shell-sidebar' )
		};
	};

	parsePointFromString = function ( string ) {
		var x,
			y, 
			height,
			tempArray;

		tempArray = string.split(' ');
		x = tempArray[0];
		y = tempArray[1];
		height = tempArray[2];

		if( height !== 'undefined' ) {
			console.log('x: '+x+" y: "+y+" height: "+height);
		}


	};

	parseTextString = function ( string ) {
		var i,
			numLines,
			stringArray = string.split('\n');

		numLines = stringArray.length;

		for(i = 0; i < numLines; i++)
		{	
			parsePointFromString( stringArray[i] );
		}
	};

	initModule = function ( $container ) {
		stateMap.$container = $container;
		stateMap.$container.html( configMap.main_html );
		setJqueryMap();

		hg.filehandler.initModule( jqueryMap.$sidebar, parseTextString );
	};


	/* Public methods */
	return {initModule : initModule};


}());