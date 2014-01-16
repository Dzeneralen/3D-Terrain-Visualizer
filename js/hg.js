/*
* hg.js 
* Root js file
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

/** Globals are $, hg */

var hg = (function () {
	var initModule = function( $container ) {
		hg.shell.initModule( $container );
	};

	/* Public methods */
	return {initModule: initModule};
}());