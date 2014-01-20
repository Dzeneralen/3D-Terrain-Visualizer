/*
* hg.draw.js 
* Doing the WebGL 3D initialization and handling
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
		main_html : '<canvas id="webgl" style="width:100%;height:100%;"></canvas>',
		vertex_shader : String() 
			+ 'attribute vec3 aVertexPosition;'
		    + 'attribute vec4 aVertexColor;'
		    + 'uniform mat4 uMVMatrix;'
		    + 'uniform mat4 uPMatrix;'
		    + 'varying vec4 vColor;'
		    + 'void main(void) {'
		    +    'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);'
		    +    'vColor = aVertexColor;'
		    + '}',
		fragment_shader : String()
			+ 'precision mediump float;'
		    + 'varying vec4 vColor;'
		    + 'void main(void) {'
		    +    'gl_FragColor = vColor;'
		    + '}'
	},
	stateMap = {
		$container : null
	},
	jqueryMap,
	webgl,
	initModule,
	setJqueryMap,
	initGL,
	getVertexShader,
	getFragmentShader,
	getColorValue,
	cameraChangeEvent,
	initShaders;

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

		webgl.useProgram(shaderProgram);

		// Bind the uniform and varying variables to something


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

		//Something strange is going on here.
		console.log("Height before init", webgl.viewportHeight);
		webgl.viewportWidth = jqueryMap.$canvas[0].width;
		webgl.viewportHeight = jqueryMap.$canvas[0].height;
		console.log("Height after init", webgl.viewportHeight);


	};

	initModule = function( $container ) {
		stateMap.$container = $container;
		stateMap.$container.html( configMap.main_html );
		setJqueryMap();
		initGL();
		console.log("WebGL Running");
	};

	return { initModule : initModule };
}());