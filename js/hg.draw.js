/*
* hg.draw.js 
* Doing the WebGL 3D initialization and handling
* You can append '\n' on the shader scripts to be able to have line debugging 
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

/** Globals are $, hg */

hg.draw = (function () {

	var configMap = {
		main_html : '<canvas id="webgl" style="width:100%;height:100%;">Please use a browser which supports the Canvas element</canvas>',
		vertex_shader : String() 
			+ 'attribute vec3 a_VertexPosition;'
		    + 'attribute vec3 a_VertexColor;'
		    /*+ 'uniform mat4 u_MVMatrix;'*/
		    + 'uniform mat4 u_PMatrix;'
		    + 'varying vec4 v_Color;'
		    + 'void main(void) {'
		    +    'gl_Position = u_PMatrix * vec4(a_VertexPosition, 1.0);'
		    +    'v_Color = vec4(a_VertexColor, 1.0);'
		    + '}',
		fragment_shader : String()
			+ 'precision mediump float;'
		    + 'varying vec4 v_Color;'
		    + 'void main(void) {'
		    +    'gl_FragColor = v_Color;'
		    + '}'
	},
	shaderVariables = {
		a_VertexPosition : null,
		a_VertexColor : null,
		u_MVMatrix : null,
		u_PMatrix : null
	},
	stateMap = {
		$container : null
	},
	PMatrix,
	MVMatrix,
	jqueryMap,
	webgl,
	initModule,
	setJqueryMap,
	initGL,
	getVertexShader,
	getFragmentShader,
	getColorValue,
	cameraChangeEvent,
	getShaderVariables,
	initializeVertexData,
	initializeFacesData,
	initializeMatrixes,
	setupVertexData,
	setupFaces,
	initializeMesh,
	drawMesh,
	resizeCanvas,
	initShaders;

	getShaderVariables = function( webgl, program ) {
		/* Attributes */
		shaderVariables.a_VertexPosition = webgl.getAttribLocation( program, 'a_VertexPosition' );
		shaderVariables.a_VertexColor = webgl.getAttribLocation( program, 'a_VertexColor' );

		/* Uniforms*/
		//shaderVariables.u_MVMatrix = webgl.getUniformLocation( program, 'u_MVMatrix' );
		shaderVariables.u_PMatrix = webgl.getUniformLocation( program, 'u_PMatrix' );
	};

	resizeCanvas = function () {
		mat4.perspective(PMatrix, 3.14/2, webgl.viewportWidth / webgl.viewportHeight, 0, 1000  );
	};

	initializeMatrixes = function () {
		PMatrix = new Float32Array([
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0,
			]);

		MVMatrix = new Float32Array([
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0,
			]);

		webgl.uniformMatrix4fv(shaderVariables.u_PMatrix, false, PMatrix);
		//webgl.uniformMatrix4fv(shaderVariables.u_MVMatrix, false, MVMatrix);
	};

	setupFaces = function( x_dim, y_dim ) {
		var i,
			j,
			offset,
			tempArray = [];

		for(i = 0; i + 1 < x_dim; i++)
		{
			for(j = 0; j + 1 < y_dim; j++)
			{	
				offset = i * y_dim;
				/* First Triangle, left bottom */
				tempArray.push(j + offset);			//First vertex 
				tempArray.push(j + 1 + offset);		//Vertex to the right
				tempArray.push(j + y_dim + offset);	//Vertex above the first one

				/* Second Triangle, right top */
				tempArray.push(j + y_dim + offset);		//Vertex above the first one
				tempArray.push(j + 1 + offset);			//Vertex to the right of the first one
				tempArray.push(j + y_dim + 1 + offset);	//Vertex to the right of the one above the first one

			}
		}
		return  new Uint16Array(tempArray);
	};

	drawMesh = function( x_dim, y_dim ) {
		var i,
			j,
			offset = 2;

		webgl.clear( webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT );

		webgl.drawElements(webgl.TRIANGLES, 6 * x_dim * y_dim, webgl.UNSIGNED_BYTE, 0);

	};

	setupVertexData = function( x_dim, y_dim, heightArray, min_z, max_z ){
		var i,
			j,
			colorValue,
			tempArray = [],
			maxDim,
			offsetX,
			offsetY;

			maxDim = (x_dim > y_dim)? x_dim : y_dim;
			offsetX = (x_dim - 1) * 0.5;
			offsetY = (y_dim - 1) * 0.5;

			
			offsetY = 0;
			offsetX = 0;

		for(i = 0; i < x_dim; i++)
		{
			for(j = 0; j < y_dim; j++)
			{
				tempArray.push( (i - offsetX) / maxDim );	// X-coord
				tempArray.push( (j - offsetY) / maxDim );	// Y-coord
				tempArray.push( heightArray[i+j] / (2*max_z) );	// Z-coord

				colorValue = getColorValue(heightArray[i+j], min_z, max_z);
				tempArray.push(colorValue.r);			// Color value r
				tempArray.push(colorValue.g);			// Color value g
				tempArray.push(colorValue.b);			// Color value b
				
			}
		}

		return new Float32Array(tempArray);

	};

	initializeFacesData = function( facesArray ) {
		var facesBuffer = webgl.createBuffer();
		webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, facesBuffer);
		webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, facesArray, webgl.STATIC_DRAW);
	};

	initializeVertexData = function( floatArray ) {
		if( floatArray === undefined) { return false; }

		var FSIZE = floatArray.BYTES_PER_ELEMENT,
			vertexBuffer = webgl.createBuffer();

		webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, floatArray, webgl.STATIC_DRAW);

		/* Points x,y,z */
		webgl.vertexAttribPointer(shaderVariables.a_VertexPosition, 3, webgl.FLOAT, false, FSIZE * 6, 0);
		webgl.enableVertexAttribArray(shaderVariables.a_VertexPosition);

		/* Colors r,g,b */
		webgl.vertexAttribPointer(shaderVariables.a_VertexColor, 3, webgl.FLOAT, false, FSIZE * 6, FSIZE * 3);
		webgl.enableVertexAttribArray(shaderVariables.a_VertexColor);
	};

	initializeMesh = function ( grid ) {
		var x_dim,
			y_dim,
			min_z,
			max_z,
			elements,
			vertexArray,
			facesArray;

		x_dim = grid.x_dim;
		y_dim = grid.y_dim;
		elements = grid.elements;
		min_z = grid.min;
		max_z = grid.max;

		// Set up the vertexArray
		vertexArray = setupVertexData( x_dim, y_dim, elements, min_z, max_z );

		// Set up Faces with that array in mind
		facesArray = setupFaces( x_dim, y_dim );

		// Initialize the vertex data to webgl
		initializeVertexData( vertexArray );

		// Initialize the faces data to webgl
		initializeFacesData( facesArray );
		console.log("yay");

		// Initiaalize the Projection, View and Model Matrix
		// Blabla...
		initializeMatrixes();

		// Initialize the keyboardListeners
		// Blabla...

		// Start Drawing
		// Blabla...
		drawMesh(x_dim, y_dim);


	};

	cameraChangeEvent = function( key ) {
		switch( key ){
			case 'up':
				break;
			case 'down':
				break;
			case 'left':
				break;
			case 'right':
				break;
			default:
				break;
		}
	};

	getColorValue = function( value, minValue, maxValue ) {
		var intervalValue = (value - minValue) / (maxValue - minValue);
		return { r : intervalValue,
				 g : 3*(intervalValue * (1.0 - intervalValue)),
				 b : 1 - intervalValue
				};
	};

	getFragmentShader = function() {
		if( webgl === undefined ) { return; }
		var fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);

		webgl.shaderSource( fragmentShader, configMap.fragment_shader);
		webgl.compileShader(fragmentShader);

        if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
            alert(webgl.getShaderInfoLog(fragmentShader));
            return null;
        }

        return fragmentShader;
	};

	getVertexShader = function() {
		if( webgl === undefined ) { return; }
		var vertexShader = webgl.createShader(webgl.VERTEX_SHADER);

		webgl.shaderSource( vertexShader, configMap.vertex_shader);
		webgl.compileShader(vertexShader);

        if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
            alert(webgl.getShaderInfoLog(vertexShader));
            return null;
        }

        return vertexShader;
	};

	initShaders = function() {
		var fragmentShader = getFragmentShader(),
			vertexShader = getVertexShader(),
			shaderProgram = webgl.createProgram();

		webgl.attachShader(shaderProgram, vertexShader);
		webgl.attachShader(shaderProgram, fragmentShader);
		webgl.linkProgram(shaderProgram);

		if(!webgl.getProgramParameter(shaderProgram, webgl.LINK_STATUS)){
			console.log("Could not initialize shaders");
			return;
		}

		// Bind the uniform and varying variables to something
		getShaderVariables( webgl, shaderProgram );

		webgl.useProgram(shaderProgram);



	};

	setJqueryMap = function() {
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			$canvas : $container.find('#webgl')
		};
	};

	initGL = function() {
		if(!window.WebGLRenderingContext) {
			alert("Your browser does not support WebGL, see http://get.webgl.org for more info!");
			return;
		}

		webgl = jqueryMap.$canvas[0].getContext('webgl');

		if(!webgl){
			alert("Could not initialize WebGL, see http://get.webgl.org for more info!");
			return;
		}

		initShaders();

		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
		webgl.enable(webgl.DEPTH_TEST);
		webgl.clear(webgl.COLOR_BUFFER_BIT);

		//Something strange is going on here.
		console.log("Height before init", webgl.viewportHeight);
		webgl.viewportWidth = jqueryMap.$canvas[0].clientWidth;
		webgl.viewportHeight = jqueryMap.$canvas[0].clientHeight;
		console.log("Height after init", webgl.viewportHeight);
		PMatrix = mat4.create();
		resizeCanvas();




	};

	initModule = function( $container ) {
		stateMap.$container = $container;
		stateMap.$container.html( configMap.main_html );
		setJqueryMap();
		initGL();
		console.log("WebGL Running");
	};

	return { initModule : initModule,
			 initializeMesh : initializeMesh };
}());