"use strict";
/*
 * Carlos J. Gratacos (802-10-2990)
 * COMP4046 UPRM 15S1
 * Date: October 13, 2015
 * Description: Second Assignment
 *
 *
 */

var gui = new dat.GUI({
    autoplace: true
});

var part2Object = null;

function init_app() {
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

/* ### GUI ### */


/* ### Mouse Event Handler ### */
function onMouseDown(event) {
    var rect = event.target.getBoundingClientRect();
    var xpix = event.clientX - rect.left;
    var ypix = event.clientY - rect.top;

    // Uncomment for debugging
    //console.log("Mouse Down", event)
    //console.log("Pixel coordinates", xpix, ypix)

    if (event.target == this.original.canvas) {

        // TODO: Q1 - Add functionality to draw polylines instead of just single squares


        this.original.ctx.strokeStyle = '#ff8000'; // Orange
        this.original.ctx.lineWidth = 4;
        this.original.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawSquare(this.original.ctx, xpix, ypix, 4);

        if (this.point === null || this.point === undefined) {
            this.point = new $Point(xpix, ypix);
        } else {
            this.point.resetPoint(xpix, ypix);
        }

        this.drawAll();
    } else if (event.target == this.transform.canvas) {
        // If close to the red pin
        if ((Math.abs(xpix - this.params.x0) < 10) && (Math.abs(ypix - this.params.y0) < 10)) {
            this.dragRedPin = 1 // Set drag state to 1
                // Not really required to change (x0,y0) if this is done in mouseDrag
                // Uncomment for debugging
                //params.x0 = xpix; params.y0 = ypix;
                //drawAll()
        }
    }
}

function onMouseMove(event) {
    // Dispatch move event to drag if we are currently dragging the red pin
    if ((this.dragRedPin > 0) && (event.target == this.transform)) return this.onDragRedPin(event);
    // Ignore else
    if (this.point !== null && this.point.active) {
        var rect = event.target.getBoundingClientRect();
        var xpix = event.clientX - rect.left;
        var ypix = event.clientY - rect.top;
        this.point.setCurrent(xpix, ypix);
        this.drawPolyline(this.original.ctx, this.point, xpix, ypix);
        this.drawAll();
    }
}

function onMouseUp(event) {
    // Stop dragging
    this.dragRedPin = 0;
    if (this.point !== null) {
        this.point.deactivate();
    }
}


function onDragRedPin(event) {
    var rect = event.target.getBoundingClientRect()
    var xpix = event.clientX - rect.left
    var ypix = event.clientY - rect.top

    // Assume (event.target == canvas2)
    this.params.x0 = xpix;
    this.params.y0 = ypix;
    this.drawAll()
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


//Part 2 Function Constructor
function Part2Constructor(canvasName1, canvasName2, params, datFolder, eventHandlerObject) {

    //Initialize Params
    this.params = params;

    //Initialize Canvas
    this.original = $CanvasObjectCreator(canvasName1);
    this.transform = $CanvasObjectCreator(canvasName2);

    //Initialize GUI Folder params
    this.initGUI(datFolder);
    //var parent = document.getElementById('controls');
    //parent.appendChild(gui.domElement);


    //Initialize Mouse Event Handlers
    this.dragRedPin = 0;
    this.initMouseEventListener(eventHandlerObject);

    //Define What happens when pin is dragged
    this.onDragRedPin = eventHandlerObject.ondragpin;

    this.point = null;


    this.drawAll();
    this.drawBoundingBox(this.original.ctx, this.original.boundingBoxPoints);
}

Part2Constructor.prototype.initGUI = function (datFolder) {
    datFolder.open();
    datFolder.add(this.params, 'x0').min(0).max(this.transform.w).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'y0').min(0).max(this.transform.h).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'scale').min(0.01).max(2.5).step(0.01).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'angle').min(-180).max(180).onChange(this.drawAll.bind(this));
    datFolder.add(this.params, 'showImage').onChange(this.drawAll.bind(this));
}

Part2Constructor.prototype.initMouseEventListener = function (eventHandlerObject) {
    this.original.canvas.addEventListener("mousedown", eventHandlerObject.mousedown.bind(this), false);
    this.transform.canvas.addEventListener("mousedown", eventHandlerObject.mousedown.bind(this), false);
    this.original.canvas.addEventListener("mousemove", eventHandlerObject.mousemove.bind(this), false);
    this.transform.canvas.addEventListener("mousemove", eventHandlerObject.mousemove.bind(this), false);
    this.original.canvas.addEventListener("mouseup", eventHandlerObject.mouseup.bind(this), false);
    this.transform.canvas.addEventListener("mouseup", eventHandlerObject.mouseup.bind(this), false);
}

Part2Constructor.prototype.drawPin = function () {
    // Reset canvases
    this.original.ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform
    this.transform.ctx.setTransform(1, 0, 0, 1, 0, 0)
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

Part2Constructor.prototype.drawSquare = function (ctx, x, y, w) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - w / 2);
    ctx.lineTo(x + w / 2, y - w / 2);
    ctx.lineTo(x + w / 2, y + w / 2);
    ctx.lineTo(x - w / 2, y + w / 2);
    ctx.lineTo(x - w / 2, y - w / 2);
    ctx.stroke();
}

Part2Constructor.prototype.drawShape = function (ctx, pts) {

    // TODO: Q2 - Draw shape corresponding to pts

    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (var i = 2; i < pts.length - 1; i += 2) {
        ctx.lineTo(pts[i], pts[i + 1]);
    }
    ctx.stroke();

}

Part2Constructor.prototype.transformPoints = function (M, pts) {
    var pts2 = new Array;
    var v3 = vec3.create();
    // TODO: Q3 - Transform shapes using affine transform

    for (var i = 0; i < pts.length - 1; i += 2) {
        vec3.set(v3, pts[i], pts[i + 1], 1);
        vec3.transformMat3(v3, v3, M);
        pts2.push(v3[0], v3[1]);
    }
    return pts2;
}

Part2Constructor.prototype.transformMat = function (M) {
    mat3.translate(M, M, [this.params.x0, this.params.y0]);
    mat3.scale(M, M, [this.params.scale, this.params.scale]);
    mat3.rotate(M, M, this.params.angle);
    mat3.translate(M, M, [-(this.original.w / 2), 0]);
}
Part2Constructor.prototype.drawImage = function (M,ctx,canvasImage) {
    ctx.setTransform(M[0], M[1], M[3], M[4], M[6], M[7]);
    ctx.drawImage(canvasImage,0,0);
    ctx.setTransform(1,0,0,1,0,0);
}

Part2Constructor.prototype.drawAll = function () {

    this.drawPin();

    // TODO: Q2 - Draw bounding box of canvas1 using drawShape()

    var M = mat3.create();
    // TODO: Q3 - define the content of M
    this.transformMat(M);
    this.transform.boundingBoxPoints = this.transformPoints(M, this.original.boundingBoxPoints);
    // console.log(M)

    // TODO: Q3 - Draw bounding box of canvas1 transformed to canvas2

    this.drawImage(M,this.transform.ctx,this.original.canvas);
    this.drawBoundingBox(this.transform.ctx, this.transform.boundingBoxPoints);

    // TODO: Q5 - Copy canvas1 transformed into canvas2

    mat3.translate(M, M, [(this.original.w / 2), 0]);
    var matElem = document.getElementById('mat');
    matElem.innerHTML = 'M = ' + mat3.toHTML(M);
}

Part2Constructor.prototype.drawPolyline = function (ctx, point, x, y) {
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


////Point Function Constructor for Part 2
function $Point(x, y) {
    this.initial_x = x;
    this.initial_y = y;
    this.current_x = x;
    this.current_y = y;
    this.last_x = 0;
    this.last_y = 0;
    this.active = true;
}

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
function $CanvasObjectCreator(canvasName) {
    var canvas = document.getElementById(canvasName);
    return {
        name: canvasName,
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        w: canvas.width,
        h: canvas.height,
        boundingBoxPoints: [0, 0, canvas.width, 0, canvas.width, canvas.height, 0, canvas.height, 0, 0]
    };
}
