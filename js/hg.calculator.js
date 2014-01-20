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

	var heightGrid,
		lockedValues,
		createAreaSquare2D,
		solveHeightGrid,
		allocateHeightGrid,
		addKnownPoint,
		populateKnownValues,
		relaxPoint;

	createAreaSquare2D = function ( dim ) {
		var array2D = [],
			i, j;

		for(i = 0; i < dim; i++)
		{
			array2D[i] = [];
			for(j = 0; j < dim; j++)
			{
				array2D[i][j] = 0;
			}
		}

		return array2D;
	};	

	allocateHeightGrid = function ( dim ) {
		heightGrid = createAreaSquare2D( dim );
		lockedValues = createAreaSquare2D( dim );
	};

	addKnownPoint = function ( i, j, heightValue ) {
		try 
		{
			heightGrid[i][j] = +(heightValue);
			lockedValues[i][j] = 1;
		} 
		catch ( error ) 
		{
			console.log("There is something wrong with data at point ["+i+","+j+"].. Value is "+heightValue);
		}
	};

	populateKnownValues = function ( obj ) {
		/* Read the file specifics */
		var i,
			dim,
			point,
			numberOfPoints;

		if( obj === undefined) { return false; }

		dim = obj.dim || 0;
		numberOfPoints = obj.array.length || 0;

		allocateHeightGrid( dim );

		for(i = 0; i < numberOfPoints; i++)
		{	
			point = obj.array[i];
			addKnownPoint(point.x, point.y, point.value);
		}

		console.log("HGrid: ",heightGrid);
		console.log("LGrid: ",lockedValues);


		/* Add the value to the grid */
	};

	relaxPoint = function ( i, j, dim) {

		if(lockedValues[i][j] === 1) { return false; }

		dim = dim - 1;

		if((i > 0 && i < dim) && (j > 0 && j < dim)){
			heightGrid[i][j] = (heightGrid[i+1][j] + heightGrid[i-1][j] + heightGrid[i][j+1] + heightGrid[i][j-1]) * 0.25;
		}
		/* Along left side */
		else if(i === 0 && (j > 0 && j < dim)) {
			heightGrid[i][j] = (2.0 * heightGrid[i+1][j] + heightGrid[i][j+1] + heightGrid[i][j-1]) * 0.25;
		}

		/* Along right side	*/
		else if(i === dim && (j > 0 && j < dim)) {
			heightGrid[i][j] = (2.0 * heightGrid[i-1][j] + heightGrid[i][j+1] + heightGrid[i][j-1]) * 0.25;
		}

		/* Along the top */	
		else if(j === dim && (i > 1 && i < dim)) {
			heightGrid[i][j] = (heightGrid[i+1][j] + heightGrid[i-1][j] + 2.0 * heightGrid[i][j-1]) * 0.25;
		}

		/* Along the bottom	*/
		else if(j === 0 && (i > 0 && i < dim)) {
			heightGrid[i][j] = (heightGrid[i+1][j] + heightGrid[i-1][j] + 2.0 * heightGrid[i][j+1]) * 0.25;
		}	 

		/* Bottom Left */
		else if(i === 0 && j === 0) {
			heightGrid[i][j] = (2.0 * heightGrid[i+1][j] + 2.0 * heightGrid[i][j+1]) * 0.25;
		}

		/* Top Right */
		else if(i === dim && j === dim) {
			heightGrid[i][j] = (2.0 * heightGrid[i][j-1] + 2.0 * heightGrid[i-1][j]) * 0.25;
		}


		/* Bottom Right */
		else if(i === dim && j === 0) {
			heightGrid[i][j] = (2.0 * heightGrid[i-1][j] + 2.0 * heightGrid[i][j+1]) * 0.25;
		}

		/* Top left */
		else if(i === 0 && j === dim) {
			heightGrid[i][j] = (2.0 * heightGrid[i+1][j] + 2.0 * heightGrid[i][j-1]) * 0.25;
		}
	};

	solveHeightGrid = function ( obj ) {
		if( obj === undefined ) { console.log("No object in solver");  return false; }

		var i, 
			j, 
			iterationNumber, 
			maximumIterations = obj.maximumIterations || 1000, 
			dim = obj.dim || 50,
			numberOfSatisfied, 
			oldValue, 
			allSatisfiedCount = dim * dim,
			maximumChange = obj.maximumChange || 0.001;

		for(iterationNumber = 0; iterationNumber < maximumIterations; iterationNumber++)
		{
			numberOfSatisfied = 0;

			for(i = 0; i < dim; i++)
			{
				for(j = 0; j < dim ; j++)
				{
					oldValue = heightGrid[i][j];
					relaxPoint(i, j, dim);
					if( Math.abs( oldValue - heightGrid[i][j] ) < maximumChange ) { numberOfSatisfied++; }
				}
			}

			if(numberOfSatisfied === allSatisfiedCount)
			{
				console.log("Rate of change at an acceptable level after "+iterationNumber+" iterations!");
				console.log("DONE HGrid: ",heightGrid);
				return true;
			}
		}

		return false;
	};

	/* Public Functions */
	return { solveHeightGrid : solveHeightGrid,
			 populateKnownValues : populateKnownValues };
}());