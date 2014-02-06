/*
* hg.shell.menu.js 
* Shellmenu controlling input for hg
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

/** Globals are $, hg */

hg.shell.menu = (function () {

	var configMap = {
		main_html : String()
			+ '<div class="hg-shell-sidebar-menu-title"></div>'
			+ '<div class="hg-shell-sidebar-menu-info"></div>'
			+ '<div class="hg-shell-sidebar-menu-controls"></div>'
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
			$container : $container
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