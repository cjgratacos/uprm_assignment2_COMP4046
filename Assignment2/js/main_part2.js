"use strict";
/*
 * Carlos J. Gratacos (802-10-2990)
 * COMP4046 UPRM 15S1
 * Date: October 13, 2015
 * Description: Second Assignment Part 2: Interactive Transformation
 * The reason this JS file is written with a Function Constructor to operate every function from the prototype
 * chain of the Function Constructor(Part2Constructor) is for:
 *              1) Better performance, a JS Object performs better looking at the prototype than looking at the
 *                 Global variables or functions.
 *              2) Better way of abstraction, and I was planning on doing the bonus for Part 2, and this is an
 *                 excelent way of abstracting the Bonus from the Part, and not interfearing.
 */

//Singleton instance of the dat.GUI
var gui = new dat.GUI({
    autoplace: true
});
//Variable that is going to maintain the part 2 Function Constructor which controls everything
var part2Object = null;
//Initializing the App
function init_app() {
    //Creating the a new Prototypal Object of the Function Constructor Part2Constructor
    part2Object = new Part2Constructor(
        //Original Canvas ID
        "original",
        //Transformation Canvas ID
        "transform",
        //Parameters for the Dat GUI
        {
            'x0': 150,
            'y0': 20,
            'scale': 1.0,
            'angle': 0,
            'showImage': true
        },
        //Dat GUI folder
        gui.addFolder('Interactive Transformation'),
        //Mouse Event Handler Object
        {
            mousedown: onMouseDown,
            mouseup: onMouseUp,
            mousemove: onMouseMove,
            ondragpin: onDragRedPin
        }
    );
}
/* ### Mouse Event Handler ### */
//These are Part Specific Mouse Event Handler of the Part 2
// function: onMouseDown
// parameters: event = event Object, is passed by the JS eventHandler automatically
// Description: This function handles the event mousedown for Part 2
function onMouseDown(event) {
    //Converting from clients coordinate to canvas coordinate
    var rect = event.target.getBoundingClientRect();
    var xpix = event.clientX - rect.left;
    var ypix = event.clientY - rect.top;

    //Checking in which canvas the mouse just went down
    if (event.target == this.original.canvas) { //Orignal Canvas
        // TODO: Q1 - Add functionality to draw polylines instead of just single squares

        //Default setting context properties before drawing
        this.original.ctx.strokeStyle = '#ff8000'; // Orange
        this.original.ctx.lineWidth = 4;
        //Setting transformation context matrix to default
        this.original.ctx.setTransform(1, 0, 0, 1, 0, 0);
        //drawing square in the original canvas(Prototype)
        this.drawSquare(this.original.ctx, xpix, ypix, 4);
        //initialing the point($Point) inside the Object (Prototype)
        this.initPoint(xpix,ypix);
        //Drawing everything(Prototype)
        this.drawAll();

    } else if (event.target == this.transform.canvas) { // Transformation

        //Default setting context properties before drawing
        this.original.ctx.strokeStyle = '#ff8000'; // Orange
        this.original.ctx.lineWidth = 4;
        //Setting transformation context matrix to default
        this.original.ctx.setTransform(1, 0, 0, 1, 0, 0);

        //initialing the point($Point) inside the Object (Prototype)
        //beacuse in the initPoint function the third parameter is set to true, the point is initialized to the
        //transformation of point (xpix,ypix) from Transformation Canvas to (xpix,ypix) Original Canvas
        //initially, based on the params
        this.initPoint(xpix,ypix,true);
        //drawing square in the original canvas(Prototype)
        this.drawSquare(this.original.ctx, this.point.current_x, this.point.current_y, 4);
        //Drawing the current (xpix,ypix) to the Original Canvs
        this.drawAllInverse(xpix,ypix);

    }
}
// function: onMouseMove
// parameters: event = event Object, is passed by the JS eventHandler automatically
// Description: This function handles the event mousemove for Part 2
function onMouseMove(event) {
    //Checking in which canvas the mouse just move
    if (event.target == this.original.canvas) { // Original Canvas
        if (this.point !== null && this.point.active) { //Checking if the point is active, in other words, if the mouse is down
            //Converting from clients coordinate to canvas coordinate
            var rect = event.target.getBoundingClientRect();
            var xpix = event.clientX - rect.left;
            var ypix = event.clientY - rect.top;
            //initialing the point($Point) inside the Object (Prototype)
            this.point.setCurrent(xpix, ypix);
            //Drawing Polyline in the orinal canvas
            this.drawPolyline(this.original.ctx, this.point, xpix, ypix);
            //Drawing everything(Prototype)
            this.drawAll();
        }
    }else if(event.target == this.transform.canvas){ //Transform Canvas
        if (this.point !== null && this.point.active) { // Point is active meaning mouse is down
            //Converting from clients coordinate to canvas coordinate
            var rect = event.target.getBoundingClientRect();
            var xpix = event.clientX - rect.left;
            var ypix = event.clientY - rect.top;
            //Drawing everything(Prototype)
            this.drawAllInverse(xpix,ypix);
        }
    }
}
// function: onMouseUp
// parameters: event = event Object, is passed by the JS eventHandler automatically
// Description: This function handles the event mouseup for Part 2
function onMouseUp(event) {
    // Stop dragging
    this.dragRedPin = 0;
    // Deactivate point in other words, stops drawing
    if (this.point !== null) {
        this.point.deactivate();
    }
}
//This Function is not used
// function: onDragRedPin
// parameters: event = event Object, is passed by the JS eventHandler automatically
// Description: This function handles the event when the Ping is dragged for Part 2
function onDragRedPin(event) {
    //Converting from clients coordinate to canvas coordinate
    var rect = event.target.getBoundingClientRect()
    var xpix = event.clientX - rect.left
    var ypix = event.clientY - rect.top

    // Assume (event.target == canvas2)
    this.params.x0 = xpix;
    this.params.y0 = ypix;
    this.drawAll();
}
// Auxiliary: display mat3 matrix as HTML
mat3.toHTML = function (m) {
    var str = '<table class="matrixTable"><tbody>'

    str += '<tr><td>' + m[0].toFixed(2) + '</td><td>' + m[3].toFixed(2) + '</td><td>' + m[6].toFixed(2) + '</td></tr>';
    str += '<tr><td>' + m[1].toFixed(2) + '</td><td>' + m[4].toFixed(2) + '</td><td>' + m[7].toFixed(2) + '</td></tr>';
    str += '<tr><td>' + m[2].toFixed(2) + '</td><td>' + m[5].toFixed(2) + '</td><td>' + m[8].toFixed(2) + '</td></tr>';

    str += '</tbody></table>'

    return str
}

//*************Part 2 Function Constructor*************//
//This function constructor contains every necessary information for the Part to run and satisfy the HW specifications
//parameters: canvasName1= Original Canvas ID
//            canvasName2= Transform Canvas ID
//            params= dat GUI parameters to use
//            datFolder = dat folder instance
//            eventHandlerObject = object containing properties as function with the following names
//                                 onmouseup, onmousedown, onmousemove, ondragpin
//
function Part2Constructor(canvasName1, canvasName2, params, datFolder, eventHandlerObject) {

    //Initialize Params
    this.params = params;

    //Initialize Canvas
    this.original = $CanvasObjectCreator(canvasName1);
    this.transform = $CanvasObjectCreator(canvasName2);

    //Initialize GUI Folder params
    this.initGUI(datFolder);

    //Initialize Mouse Event Handlers
    this.dragRedPin = 0; // This is not used
    this.initMouseEventListener(eventHandlerObject);

    //Define What happens when pin is dragged
    this.onDragRedPin = eventHandlerObject.ondragpin; // This is not used

    //creating a variable point, is going to be instanciate as a $Point
    this.point = null;

    //Initial Draw
    this.drawAll();
}
//Function that initializes the GUI, it binds to the datFolder the params and the callback functions for onChange
//parameters: datFolder= instance of the a folder of the dat.GUI
Part2Constructor.prototype.initGUI = function (datFolder) {
    //Open folder and assign the params object variables
    datFolder.open();
    datFolder.add(this.params, 'x0').min(0).max(this.transform.w).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'y0').min(0).max(this.transform.h).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'scale').min(0.01).max(2.5).step(0.01).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'angle').min(-180).max(180).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'showImage').onChange(this.drawAll.bind(this));
}
//Function that inits the Mouse event Listeners and callback
//parameters: eventHandlerObject= object that has methods functions defined, namely: mousedown, mousemove, mouseup
Part2Constructor.prototype.initMouseEventListener = function (eventHandlerObject) {
    //Setting event handler and binding this to each method function
    this.original.canvas.addEventListener("mousedown", eventHandlerObject.mousedown.bind(this), false);
    this.transform.canvas.addEventListener("mousedown", eventHandlerObject.mousedown.bind(this), false);
    this.original.canvas.addEventListener("mousemove", eventHandlerObject.mousemove.bind(this), false);
    this.transform.canvas.addEventListener("mousemove", eventHandlerObject.mousemove.bind(this), false);
    this.original.canvas.addEventListener("mouseup", eventHandlerObject.mouseup.bind(this), false);
    this.transform.canvas.addEventListener("mouseup", eventHandlerObject.mouseup.bind(this), false);
}
//Function that draws the Pin on both canvas, obtained from orignal file
Part2Constructor.prototype.drawPin = function () {
    // Reset canvases
    this.original.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    this.transform.ctx.setTransform(1, 0, 0, 1, 0, 0);
    //this.original.ctx.clearRect(0,0,w1,h1)  // Clear canvas
    this.transform.ctx.clearRect(0, 0, this.transform.w, this.transform.h);

    // Draw red pin on canvas 1
    this.original.ctx.strokeStyle = '#ff0000';
    this.original.ctx.lineWidth = 3;
    this.drawSquare(this.original.ctx, this.original.w / 2, 0, 10);

    // Draw red pin directly to canvas 2
    this.transform.ctx.strokeStyle = '#ff0000';
    this.transform.ctx.lineWidth = 3;
    this.drawSquare(this.transform.ctx, this.params.x0, this.params.y0, 10);
}

//Function that draws a square, used for drawing mostly the starting point of a draw and for the pin
//parameters: ctx= canvas context
//            x= x-value on where to start the drawing
//            y= y-value on where to start the drawing
//            w= width of the square to draw
Part2Constructor.prototype.drawSquare = function (ctx, x, y, w) {
    //Drawing the square
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - w / 2);
    ctx.lineTo(x + w / 2, y - w / 2);
    ctx.lineTo(x + w / 2, y + w / 2);
    ctx.lineTo(x - w / 2, y + w / 2);
    ctx.lineTo(x - w / 2, y - w / 2);
    ctx.stroke();
}

//Function that draws lines from the given array of points, the points most be complete if it is a shape,
//In other words: (pts[0],pts[1])=(pts[pts.lenght-2],pts[pts.lenght-2])
//parameters: ctx= canvas context
//            pts= Array of points in the shape
Part2Constructor.prototype.drawShape = function (ctx, pts) {
    // TODO: Q2 - Draw shape corresponding to pts
    //Drawing shape
    ctx.beginPath();
    //Iteration of the point to make like
    ctx.moveTo(pts[0], pts[1]);
    for (var i = 2; i < pts.length - 1; i += 2) {
        ctx.lineTo(pts[i], pts[i + 1]);
    }
    ctx.stroke();

}

//Function that transform the points pts from one space to another using Matrix M (Affine Transformation)
//parameters: M = 3x3 Matrix that represents the Affine Transformation
//            pts= Array of points of the shape
//return: pts2= Array of transformed point
Part2Constructor.prototype.transformPoints = function (M, pts) {
    //variables to hold the results
    var pts2 = new Array;
    var v3 = vec3.create();
    // TODO: Q3 - Transform shapes using affine transform
    //Iteration over pts
    for (var i = 0; i < pts.length - 1; i += 2) {
        //setting v3 current point 3x1 vector
        vec3.set(v3, pts[i], pts[i + 1], 1);
        //Apply transformation to the v3
        vec3.transformMat3(v3, v3, M);
        //Save transform points in v3 to pts2
        pts2.push(v3[0], v3[1]);
    }
    //return pts2 = transformed points
    return pts2;
}

//Function that transform the 3x3 Matrix using the params variable from the Part2Constructor Object
// the operations applied in orders are: Translation->Scale->Rotation->Translation
//parameters: M= 3x3 matrix that is going to be trnasformed
//This function is the answer to Q3C.
Part2Constructor.prototype.transformMat = function (M) {
    //Translation to params.x0, params.y0
    mat3.translate(M, M, [this.params.x0, this.params.y0]);
    //Scale of params.scale
    mat3.scale(M, M, [this.params.scale, this.params.scale]);
    //Rotation of params.angle
    mat3.rotate(M, M, this.params.angle);
    //Translation to w1/2,0
    //This translation makes Point (w1/2,0) to params.x0,params.y0
    //When applying this translation the red pin is move from the border to the top center
    mat3.translate(M, M, [-(this.original.w / 2), 0]);
}

//Function that draws the content of a canvas to a nother canvas
//parameters: M= 3x3 matrix in which the transformation on ctx is going to be applied
//            ctx= contest of canvas that is going to be drawed in
//            canvasImage = image or canvas in which is going to be drawed
Part2Constructor.prototype.drawImage = function (M, ctx, canvasImage) {
    //setting transform to context by using the values of the matrix
    ctx.setTransform(M[0], M[1], M[3], M[4], M[6], M[7]);
    //drawing canvas context to ctx
    ctx.drawImage(canvasImage, 0, 0);
    //resseting the transformation context
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

//Function that draws everything from canvas orignal to canvas transform. It practically draws all
Part2Constructor.prototype.drawAll = function () {

    this.drawPin();

    // TODO: Q2 - Draw bounding box of canvas1 using drawShape()

    var M = mat3.create();
    // TODO: Q3 - define the content of M
    this.transformMat(M);
    this.transform.boundingBoxPoints = this.transformPoints(M, this.original.boundingBoxPoints);
    // console.log(M)

    // TODO: Q3 - Draw bounding box of canvas1 transformed to canvas2

    this.drawImage(M, this.transform.ctx, this.original.canvas);

    this.drawBoundingBox(this.original.ctx, this.original.boundingBoxPoints);
    this.drawBoundingBox(this.transform.ctx, this.transform.boundingBoxPoints);

    // TODO: Q5 - Copy canvas1 transformed into canvas2



    //Translate the Matrix M to [(this.original.w / 2), 0] so the GUI appears synchronize with the location of          the red Pin
    mat3.translate(M, M, [(this.original.w / 2), 0]);
    //Draw the Matrix in the HTML
    var matElem = document.getElementById('mat');
    matElem.innerHTML = 'M = ' + mat3.toHTML(M);
}

Part2Constructor.prototype.drawAllInverse = function (xpix,ypix) {
    this.drawPin();

    var M = mat3.create();
    var v2 = vec2.create();
    this.transformMat(M);
    mat3.invert(M,M);
    vec2.transformMat3(v2,[xpix,ypix],M);
    this.point.setCurrent(v2[0],v2[1]);
    this.drawPolyline(this.original.ctx,this.point);

    this.drawBoundingBox(this.transform.ctx, this.transform.boundingBoxPoints);
    this.drawAll();
}

Part2Constructor.prototype.initPoint = function(xpix,ypix,inverse){
    inverse = inverse || false;

    if (this.point === null || this.point === undefined) {
            this.point = new $Point(xpix, ypix);
        } else {
            this.point.resetPoint(xpix, ypix);
        }

    if(inverse){
        var M = mat3.create();
        var v2 = vec2.create();
        this.transformMat(M);
        mat3.invert(M,M);
        vec2.transformMat3(v2,[xpix,ypix],M);
        this.point.setCurrent(v2[0],v2[1]);
    }
}

Part2Constructor.prototype.drawPolyline = function (ctx, point) {
    ctx.strokeStyle = '#ff8000'; // Orange
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(point.last_x, point.last_y);
    ctx.lineTo(point.current_x, point.current_y);
    //ctx.closePath();
    ctx.stroke();
}

Part2Constructor.prototype.drawBoundingBox = function (ctx, points) {
    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = 6;
    this.drawShape(ctx, points);
}



//*************$Point Function Constructor for Part 2*************//
// This Function Constructor is used to represent a point in the canvas that the user is currently on
//It is used for painting the canvas when active.
//It is tried to follow the singleton pattern in JS
//parameters: x= x-value in xy-coordinate
//            y= y-value in xy-coordinate
function $Point(x, y) {
    //initial point
    this.initial_x = x;
    this.initial_y = y;
    //current point
    this.current_x = x;
    this.current_y = y;
    //last point
    this.last_x = 0;
    this.last_y = 0;
    //point status
    this.active = true;
}
//
$Point.prototype.setCurrent = function (x, y) {
    this.last_x = this.current_x;
    this.last_y = this.current_y;
    this.current_x = x;
    this.current_y = y;
}

$Point.prototype.getDifference_x = function () {
    return this.current_x - this.last_x;
}

$Point.prototype.getDifference_y = function () {
    return this.current_y - this.last_y;
}

$Point.prototype.deactivate = function () {
    this.active = false;
}


//Function that resets the $Point variable to the original, it helps keeping a single instance of this Function
// contructor and reseting the same point instead of recreating it
//parameters: x= x-value in xy-coordinate
//            y= y-value in xy-coordinate
$Point.prototype.resetPoint = function (x, y) {
    this.initial_x = x;
    this.initial_y = y;
    this.current_x = x;
    this.current_y = y;
    this.last_x = 0;
    this.last_y = 0;
    this.active = true;
}

////Canvas Object Creator
//This function is used to create an object out a canvas id, this object contains: canvas name, canvas, canvas context, canvas width, canvas height, array of bounding box for the canvas
//parameters: canvasName= canvas ID
function $CanvasObjectCreator(canvasName) {
    //obtaining the canvas element
    var canvas = document.getElementById(canvasName);
    //returning and obtaining a canvas object that is used by this part
    return {
        //canvas name
        name: canvasName,
        //canvas element
        canvas: canvas,
        //canvas context
        ctx: canvas.getContext('2d'),
        //canvas width
        w: canvas.width,
        //canvas height
        h: canvas.height,
        //canvas bounding box
        boundingBoxPoints: [0, 0, canvas.width, 0, canvas.width, canvas.height, 0, canvas.height, 0, 0]
    };
}
