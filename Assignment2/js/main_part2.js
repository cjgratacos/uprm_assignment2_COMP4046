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
            mousedown:onMouseDown,
            mouseup:onMouseUp,
            mousemove:onMouseMove,
            ondragpin:onDragRedPin
        }
    );
}

/* ### GUI ### */


/* ### Mouse Event Handler ### */
function onMouseDown(event) {
    var rect = event.target.getBoundingClientRect()
    xpix = event.clientX - rect.left;
    ypix = event.clientY - rect.top;

    // Uncomment for debugging
    //console.log("Mouse Down", event)
    //console.log("Pixel coordinates", xpix,ypix)

    if (event.target == this.original.canvas) {

        // TODO: Q1 - Add functionality to draw polylines instead of just single squares

        this.original.ctx.strokeStyle = '#ff8000'; // Orange
        this.original.ctx.lineWidth = 4;
        this.original.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawSquare(this.original.ctx, xpix, ypix, 4);
        this.drawAll()
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
    if ((this.dragRedPin > 0) && (event.target == this.transform)) return this.onDragRedPin(event)
        // Ignore else
}

function onMouseUp(event) {
    // Stop dragging
    this.dragRedPin = 0;
}


function onDragRedPin(event) {
    var rect = event.target.getBoundingClientRect()
    xpix = event.clientX - rect.left
    ypix = event.clientY - rect.top

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

    var canvas1 = document.getElementById(canvasName1);
    var canvas2 = document.getElementById(canvasName2);

    //Initialize Params
    this.params = params;

    //Initialize Canvas
    this.original = {
        name: canvasName1,
        canvas: canvas1,
        ctx: canvas1.getContext('2d'),
        w: canvas1.width,
        h: canvas1.height
    };
    this.transform = {
        name: canvasName2,
        canvas: canvas2,
        ctx: canvas2.getContext('2d'),
        w: canvas2.width,
        h: canvas2.height
    };

    //Initialize GUI Folder params
    datFolder.open();
    datFolder.add(params, 'x0').min(0).max(canvas2.width).listen().onChange(this.drawAll);
    datFolder.add(params, 'y0').min(0).max(canvas2.height).listen().onChange(this.drawAll);
    datFolder.add(params, 'scale').min(0.01).max(2.5).step(0.01).listen().onChange(this.drawAll);
    datFolder.add(params, 'angle').min(-180).max(180).listen().onChange(this.drawAll);
    datFolder.add(params, 'showImage').onChange(this.drawAll);
    //var parent = document.getElementById('controls');
    //parent.appendChild(gui.domElement);


    //Initialize Mouse Event Handlers
    this.dragRedPin = 0;

    canvas1.addEventListener("mousedown", eventHandlerObject.mousedown.bind(this), false);
    canvas2.addEventListener("mousedown", eventHandlerObject.mousedown.bind(this), false);
    canvas1.addEventListener("mousemove", eventHandlerObject.mousemove.bind(this), false);
    canvas2.addEventListener("mousemove", eventHandlerObject.mousemove.bind(this), false);
    canvas1.addEventListener("mouseup", eventHandlerObject.mouseup.bind(this), false);
    canvas2.addEventListener("mouseup", eventHandlerObject.mouseup.bind(this), false);

    //Define What happens when pin is dragged
    this.onDragRedPin = eventHandlerObject.ondragpin;
}


Part2Constructor.prototype.drawPin = function () {
    // Reset canvases
    this.original.ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform
    this.transform.ctx.setTransform(1, 0, 0, 1, 0, 0)
        //this.original.ctx.clearRect(0,0,w1,h1)  // Clear canvas
    this.transform.ctx.clearRect(0, 0, w2, h2);

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


Part2Constructor.prototype.drawShape = function (cts, pts) {

    // TODO: Q2 - Draw shape corresponding to pts

}

Part2Constructor.prototype.transformPoints = function (M, pts) {
    var pts2

    // TODO: Q3 - Transform shapes using affine transform

    return pts2
}

Part2Constructor.prototype.drawAll = function () {

    this.drawPin();

    // TODO: Q2 - Draw bounding box of canvas1 using drawShape()

    M = mat3.create()
        // TODO: Q3 - define the content of M
    matElem = document.getElementById('mat')
    matElem.innerHTML = 'M = ' + mat3.toHTML(M)
        // console.log(M)

    // TODO: Q3 - Draw bounding box of canvas1 transformed to canvas2

    // TODO: Q5 - Copy canvas1 transformed into canvas2
}
