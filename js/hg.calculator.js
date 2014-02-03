/*
* hg.calculator.js 
* Calculator doing the calculations for hg
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

/** Globals are $, hg */

hg.calculator = (function ( ) {

	var settableOptions = {
			x_dim : 0,
			y_dim : 0,
			maximumIterations : 5000,
			maximumChange : 0.001
		},
		heightGrid,
		lockedValues,
		createAreaSquare2D,
		solveHeightGrid,
		allocateHeightGrid,
		addKnownPoint,
		populateKnownValues,
		configureGrid,
		serializeElements,
		relaxPoint;

	createAreaSquare2D = function ( i_dim, j_dim ) {
		var array2D = [],
			i, j;

		for(i = 0; i < i_dim; i++)
		{
			array2D[i] = [];
			for(j = 0; j < j_dim; j++)
			{
				array2D[i][j] = 0;
			}
		}

		return array2D;
	};	

	serializeElements = function () {
		var i,
			j,
			max = -9999999,
			min = 999999,
			tempElement,
			counter,
			elementsArray;


		if(heightGrid === undefined) { return false; }

		elementsArray = new Float32Array(settableOptions.x_dim * settableOptions.y_dim);

		counter = 0;
		for(i = 0; i < settableOptions.x_dim; i++)
		{
			for(j = 0; j < settableOptions.y_dim; j++)
			{
				tempElement = heightGrid[i][j];
				//console.log("Tempvalue at",counter, "is", tempElement);
				elementsArray[counter] = tempElement;
				counter++;

				max = (max < tempElement) ? tempElement : max;
				min = (min > tempElement) ? tempElement : min;

			}
		}

		return {
			x_dim : settableOptions.x_dim,
			y_dim : settableOptions.y_dim,
			elements : elementsArray,
			min : min,
			max : max
		};
	};

	allocateHeightGrid = function () {
		heightGrid = createAreaSquare2D( settableOptions.x_dim, settableOptions.y_dim );
		lockedValues = createAreaSquare2D( settableOptions.x_dim, settableOptions.y_dim );
	};

	configureGrid = function ( options ) {
		var key;
		if( options === undefined ) { return false; }

		for(key in options)
		{
			if ( settableOptions.hasOwnProperty(key) && options.hasOwnProperty(key) ) {
				settableOptions[key] = options[key];
				//console.log("KEYCHANGE", key);
			}
		}

	};

	addKnownPoint = function ( i, j, heightValue ) {
		try 
		{
			heightGrid[i][j] = +(heightValue);
			console.log("Locking Values at ", i, j);
			lockedValues[i][j] = 1;
		} 
		catch ( error ) 
		{
			console.log("There is something wrong with data at point ["+i+","+j+"].. Value is "+heightValue);
		}
	};

	populateKnownValues = function ( pointArray ) {
		var i,
			point,
			numberOfPoints;

		if( pointArray === undefined) { return false; }
		numberOfPoints = pointArray.length;

		allocateHeightGrid();

		for(i = 0; i < numberOfPoints; i++)
		{	
			point = pointArray[i];
			addKnownPoint(point.x, point.y, point.value);
			console.log("Trying to lock at", point.x, point.y);
			//console.log("Trying to add", +(point.x), +(point.y), +(point.value));
		}

		console.log("HGrid: ",heightGrid);
		console.log("LGrid: ",lockedValues);
	};

	relaxPoint = function ( i, j, x_dim, y_dim) {
		if(lockedValues[i][j] === 1) { return false; }
		//if(i === j) {console.log("Same",i,j);}

		x_dim = x_dim - 1;
		y_dim = y_dim - 1;

		if(	(i > 0 && i < x_dim) && (j > 0 && j < y_dim)	){
			//if(i === j) {console.log("Same",i,j);}
			heightGrid[i][j] = (heightGrid[i+1][j] + heightGrid[i-1][j] + heightGrid[i][j+1] + heightGrid[i][j-1]) * 0.25;
		}
		/* Along left side */
		else if(i === 0 && (j > 0 && j < y_dim)) {
			heightGrid[i][j] = (2.0 * heightGrid[i+1][j] + heightGrid[i][j+1] + heightGrid[i][j-1]) * 0.25;
		}

		/* Along right side	*/
		else if(i === x_dim && (j > 0 && j < y_dim)) {
			heightGrid[i][j] = (2.0 * heightGrid[i-1][j] + heightGrid[i][j+1] + heightGrid[i][j-1]) * 0.25;
		}

		/* Along the top */	
		else if(j === y_dim && (i > 0 && i < x_dim)) {
			heightGrid[i][j] = (heightGrid[i+1][j] + heightGrid[i-1][j] + 2.0 * heightGrid[i][j-1]) * 0.25;
		}

		/* Along the bottom	*/
		else if(j === 0 && (i > 0 && i < x_dim)) {
			heightGrid[i][j] = (heightGrid[i+1][j] + heightGrid[i-1][j] + 2.0 * heightGrid[i][j+1]) * 0.25;
		}	 

		/* Bottom Left */
		else if(i === 0 && j === 0) {
			heightGrid[i][j] = (2.0 * heightGrid[i+1][j] + 2.0 * heightGrid[i][j+1]) * 0.25;
		}

		/* Top Right */
		else if(i === x_dim && j === y_dim) {
			heightGrid[i][j] = (2.0 * heightGrid[i][j-1] + 2.0 * heightGrid[i-1][j]) * 0.25;
		}


		/* Bottom Right */
		else if(i === x_dim && j === 0) {
			heightGrid[i][j] = (2.0 * heightGrid[i-1][j] + 2.0 * heightGrid[i][j+1]) * 0.25;
		}

		/* Top left */
		else if(i === 0 && j === y_dim) {
			heightGrid[i][j] = (2.0 * heightGrid[i+1][j] + 2.0 * heightGrid[i][j-1]) * 0.25;
		}
	};

	solveHeightGrid = function () {
		var i, 
			j, 
			iterationNumber, 
			maximumIterations = settableOptions.maximumIterations, 
			x_dim = settableOptions.x_dim,
			y_dim = settableOptions.y_dim,
			numberOfSatisfied, 
			oldValue, 
			allSatisfiedCount = settableOptions.x_dim * settableOptions.y_dim,
			maximumChange = settableOptions.maximumChange;

		for(iterationNumber = 0; iterationNumber < maximumIterations; iterationNumber++)
		{
			numberOfSatisfied = 0;

			for(i = 0; i < x_dim; i++)
			{
				for(j = 0; j < y_dim ; j++)
				{
					oldValue = heightGrid[i][j];
					relaxPoint(i, j, x_dim, y_dim);
					if( Math.abs( oldValue - heightGrid[i][j] ) < maximumChange ) { numberOfSatisfied++; }
				}
			}

			if(numberOfSatisfied === allSatisfiedCount)
			{
				console.log("Rate of change at an acceptable level after "+iterationNumber+" iterations!");
				return true;
			}
		}

		return false;
	};

	/* Public Functions */
	return { solveHeightGrid : solveHeightGrid,
			 populateKnownValues : populateKnownValues,
			 configureGrid : configureGrid,
			 serializeElements : serializeElements };
}());