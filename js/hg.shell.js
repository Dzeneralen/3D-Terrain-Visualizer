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
	setJqueryMap;

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			$webgl : $container.find( '.hg-shell-webgl' ),
			$sidebar : $container.find( '.hg-shell-sidebar' )
		};
	};

	initModule = function ( $container ) {
		stateMap.$container = $container;
		stateMap.$container.html( configMap.main_html );
		setJqueryMap();
	};


	/* Public methods */
	return {initModule : initModule};


}());