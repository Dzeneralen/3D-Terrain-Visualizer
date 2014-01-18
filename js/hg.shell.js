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
	setJqueryMap;

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			$webgl : $container.find( '.hg-shell-webgl' ),
			$sidebar : $container.find( '.hg-shell-sidebar' )
		};
	};

	parseTextString = function ( string ) {
		var i,
			numLines,
			stringArray = string.split('\n');

		numLines = stringArray.length;

		for(i = 0; i < numLines; i++)
		{
			console.log(stringArray[i]);
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