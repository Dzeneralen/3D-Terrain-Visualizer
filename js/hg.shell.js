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
			+ '<div class="hg-shell-sidebar">'
			+ '<div class="hg-shell-sidebar-menu"></div>'
			+ '<div class="hg-shell-sidebar-filedrop"></div>'
			+ '</div>',
		sidebar_title : 'Tools inc'
	},
	stateMap = {
		$container : null,
		x_dim : 50,
		y_dim : 50
	},
	jqueryMap = {},
	initModule,
	parseTextStringToPoints,
	parsePointFromString,
	parseInputFromMenu,
	setJqueryMap;

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			$webgl : $container.find( '.hg-shell-webgl' ),
			$sidebar : $container.find( '.hg-shell-sidebar' ),
			$sidebar_menu : $container.find( '.hg-shell-sidebar-menu' ),
			$sidebar_filedrop : $container.find( '.hg-shell-sidebar-filedrop' )
		};
	};

	parseInputFromMenu = function( form ) {

		stateMap.x_dim = parseInt(form.x_dim.value, 10);
		stateMap.y_dim = parseInt(form.y_dim.value, 10);

		if(form.pointEntry.value.length > 4)
		{
			parseTextStringToPoints(form.pointEntry.value);
		}
	}

	parsePointFromString = function ( string ) {
		var x,
			y, 
			value,
			tempArray;

		tempArray = string.split(' ');
		x = tempArray[0];
		y = tempArray[1];
		value = tempArray[2];

		if( typeof value !== 'undefined' ) {
			return {
				x : x,
				y : y,
				value : value
			};
		}
		return false;


	};

	parseTextStringToPoints = function ( string ) {
		var i,
			numLines,
			point,
			pointArray,
			populateObj = {},
			solverObj = {},
			stringArray = string.split('\n');

		numLines = stringArray.length;
		pointArray = [];

		for(i = 0; i < numLines; i++)
		{	
			point = false;
			point = parsePointFromString( stringArray[i] );
			if ( point ) { pointArray.push( point ); }
		}
		
		if( pointArray.length > 0 ){
			//Call a function in hg.calculator.js
			populateObj.x_dim = stateMap.x_dim;
			populateObj.y_dim = stateMap.y_dim;
			populateObj.maximumChange = 0.0001;

			hg.calculator.configureGrid( populateObj );
			hg.calculator.populateKnownValues( pointArray );
			hg.calculator.solveHeightGrid( solverObj );

			var serializedGrid = hg.calculator.serializeElements();
			hg.draw.initializeMesh(serializedGrid);



		}
	};



	initModule = function ( $container ) {
		stateMap.$container = $container;
		stateMap.$container.html( configMap.main_html );
		setJqueryMap();

		hg.shell.menu.initModule( jqueryMap.$sidebar_menu );

		hg.filehandler.initModule( jqueryMap.$sidebar_filedrop, parseTextStringToPoints );
		hg.draw.initModule( jqueryMap.$webgl );

	};


	/* Public methods */
	return {initModule : initModule,
			parseInputFromMenu : parseInputFromMenu};


}());