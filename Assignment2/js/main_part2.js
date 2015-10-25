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

 var part2Folder = gui.addFolder('Interactive Transformation');

 var ctx1, ctx2;

 var params = {
     'x0': 150,
     'y0': 20,
     'scale' : 1.0,
     'angle': 0,
     'showImage': true
 }

 /* ### GUI ### */
 var gui;
 function initGUI() {
     gui = new dat.GUI({ autoPlace: true });

     gui.add(params, 'x0').min(0).max(w2).listen().onChange(drawAll);
     gui.add(params, 'y0').min(0).max(h2).listen().onChange(drawAll);
     gui.add(params, 'scale').min(0.01).max(2.5).step(0.01).listen().onChange(drawAll);
     gui.add(params, 'angle').min(-180).max(180).listen().onChange(drawAll);
     gui.add(params, 'showImage').onChange(drawAll);

     //var parent = document.getElementById('controls');
     //parent.appendChild(gui.domElement);
 }

 /* ### Mouse ### */
 var dragRedPin = 0
 function initMouse() {
     // To be called in start() after defininf canvas1 and canvas2
     canvas1.addEventListener("mousedown", onMouseDown, false);
     canvas2.addEventListener("mousedown", onMouseDown, false);
     canvas1.addEventListener("mousemove", onMouseMove, false);
     canvas2.addEventListener("mousemove", onMouseMove, false);
     canvas1.addEventListener("mouseup", onMouseUp, false);
     canvas2.addEventListener("mouseup", onMouseUp, false);
 }
 function onMouseDown(event) {
     var rect = event.target.getBoundingClientRect()
     xpix = event.clientX - rect.left
     ypix = event.clientY - rect.top

     // Uncomment for debugging
     //console.log("Mouse Down", event)
     //console.log("Pixel coordinates", xpix,ypix)

     if (event.target == canvas1) {

         // TODO: Q1 - Add functionality to draw polylines instead of just single squares

         ctx1.strokeStyle = '#ff8000'; // Orange
         ctx1.lineWidth = 4;
         ctx1.setTransform(1, 0, 0, 1, 0, 0)
         drawSquare(ctx1, xpix,ypix, 4)
         drawAll()
     } else if (event.target == canvas2) {
         // If close to the red pin
         if ((Math.abs(xpix-params.x0)<10) && (Math.abs(ypix-params.y0)<10)) {
             dragRedPin=1 // Set drag state to 1
             // Not really required to change (x0,y0) if this is done in mouseDrag
             // Uncomment for debugging
             //params.x0 = xpix; params.y0 = ypix;
             //drawAll()
         }
     }
 }
 function onMouseMove(event) {
     // Dispatch move event to drag if we are currently dragging the red pin
     if ((dragRedPin>0)&&(event.target == canvas2)) return onDragRedPin(event)
     // Ignore else
 }
 function onMouseUp(event) {
     // Stop dragging
     dragRedPin = 0;
 }
 function onDragRedPin(event) {
     var rect = event.target.getBoundingClientRect()
     xpix = event.clientX - rect.left
     ypix = event.clientY - rect.top

     // Assume (event.target == canvas2)
     params.x0 = xpix;
     params.y0 = ypix;
     drawAll()
 }

 /* ### Drawing ### */
 function drawSquare(ctx, x,y, w) {
     ctx.beginPath();
     ctx.moveTo(x-w/2, y-w/2);
     ctx.lineTo(x+w/2, y-w/2);
     ctx.lineTo(x+w/2, y+w/2);
     ctx.lineTo(x-w/2, y+w/2);
     ctx.lineTo(x-w/2, y-w/2);
     ctx.stroke();
 }
 function drawShape(cts, pts) {

     // TODO: Q2 - Draw shape corresponding to pts

 }
 function transformPoints(M, pts) {
     var pts2

     // TODO: Q3 - Transform shapes using affine transform

     return pts2
 }
 // Auxiliary: display mat3 matrix as HTML
 mat3.toHTML = function(m) {
     var str = '<table class="matrixTable"><tbody>'

     str += '<tr><td>'+m[0].toFixed(2)+'</td><td>'+m[3].toFixed(2)+'</td><td>'+m[6].toFixed(2)+'</td></tr>';
     str += '<tr><td>'+m[1].toFixed(2)+'</td><td>'+m[4].toFixed(2)+'</td><td>'+m[7].toFixed(2)+'</td></tr>';
     str += '<tr><td>'+m[2].toFixed(2)+'</td><td>'+m[5].toFixed(2)+'</td><td>'+m[8].toFixed(2)+'</td></tr>';

     str += '</tbody></table>'

     return str
 }

 function drawAll() {
     // Reset canvases
     ctx1.setTransform(1, 0, 0, 1, 0, 0) // Reset transform
     ctx2.setTransform(1, 0, 0, 1, 0, 0)
     //ctx1.clearRect(0,0,w1,h1)  // Clear canvas
     ctx2.clearRect(0,0,w2,h2)

     // Draw red pin on canvas 1
     ctx1.strokeStyle = '#ff0000';
     ctx1.lineWidth = 3;
     drawSquare(ctx1, w1/2,0, 10)

     // Draw red pin directly to canvas 2
     ctx2.strokeStyle = '#ff0000';
     ctx2.lineWidth = 3;
     drawSquare(ctx2, params.x0,params.y0, 10)


     // TODO: Q2 - Draw bounding box of canvas1 using drawShape()

     M = mat3.create()
     // TODO: Q3 - define the content of M
     matElem = document.getElementById('mat')
     matElem.innerHTML = 'M = '+mat3.toHTML(M)
     // console.log(M)

     // TODO: Q3 - Draw bounding box of canvas1 transformed to canvas2

     // TODO: Q5 - Copy canvas1 transformed into canvas2
 }


 /* ### Initialization ### */
 function start() {
     canvas1 = document.getElementById('canvas1');
     canvas2 = document.getElementById('canvas2');
     ctx1 = canvas1.getContext('2d')
     ctx2 = canvas2.getContext('2d')

     w1 = canvas1.width;
     h1 = canvas1.height;
     w2 = canvas2.width;
     h2 = canvas2.height;

     initGUI()
     initMouse()

     drawAll()
     // Note: no animation here: drawAll is called only when it needs refreshing
 }
