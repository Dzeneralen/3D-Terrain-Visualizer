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
			+ '<div class="hg-shell-sidebar-menu-controls"></div>',
		menu_title_text : String()
			+ '3D Terrain Viewer',
		menu_info_text : String()
			+ 'Use the arrowkeys to rotate the 3D model. You can also press + and - to zoom in and out.',
		controls : String()
			+ 'Controls go here'
	},
	stateMap = {
		$container : null,
		controlsInitiated : false
	},
	jqueryMap = {},
	initModule,
	initControls, 
	readInput,
	setJqueryMap;

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			$title : $container.find( '.hg-shell-sidebar-menu-title' ),
			$info : $container.find( '.hg-shell-sidebar-menu-info' ),
			$controls : $container.find( '.hg-shell-sidebar-menu-controls' )
		};
	};

	initControls = function( ) {
		if(controlsInitiated === true) { return; }

		//Do setup of eventListeners

		//Finally
		stateMap.controlsInitiated = true;
	};

	readInput = function( ) {
		//Do read input, and check that it is valid.. pass object to shell for creation
	};

	initModule = function ( $container ) {
		stateMap.$container = $container;
		stateMap.$container.html( configMap.main_html );
		setJqueryMap();

		jqueryMap.$title.html( configMap.menu_title_text );
		jqueryMap.$info.html( configMap.menu_info_text );
		jqueryMap.$controls.html( configMap.controls );

	};


	/* Public methods */
	return {initModule : initModule};


}());