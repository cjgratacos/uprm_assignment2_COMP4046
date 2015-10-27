"use strict";

/*
 * Carlos J. Gratacos
 * COMP4046 UPRM 15S1
 * Date: October 27, 2015
 * Description: Second Assignment Part 1: Animation and keyword
 *
 * Note for this File to work all canvas that are going to be used most be of the same size.
 *
 * This file contains the necessary infromation and functionality to satisfy the requirements of the part 1 for
 * the project. It display different animation canvas in which you can interact with them one at a time. They all
 * share the same GUI params, and each canvas satisfies the requirement to the question on the cavas name.
 * Eachcanvas can be activated by pressing the button under it.
 * This canvas uses a function constructor for representing the canvas, this is because it abstract the necessary
 * informartion, and it follows more with the language design in which is optimize.
 *
 * This part is used for the Bonus
 */

// Single instance of the DAT GUI used for the Assignment
// Each part has their own folder
var gui = new dat.GUI({
    autoplace: true
});
//Dat GUI folder
var part1Folder = gui.addFolder('Animation and Keyboard');
//params object
var params ={};
//variable used for keeping the id name of the current focus canvas
var focus = "";
//object with parameters used for the animation process
var params_animation = {
        //first time calculation
        startTime: 0,
        //represents the last time it was used or animated
        lastTime: 0,
        //current - lasttime
        elapsed: 0,
        //current - startTime
        totalElapsed: 0
};

//Array that will contain objects of Part1Constructor, which each element in the array represents a canvas
var part1Objects = new Array();

//Function that inits everything, it is should be called when the HTML body is loaded
function init_app(){
    //Pushing to the part1Objects array new Part1Constructor, each element that is pushed represents a canvas
    //and a question of the part 1.
    part1Objects.push(new Part1Constructor("asteroid-original","0",{ //canvas ID and unique number
        //Object containing specific Event handler objects for the purpouse of this canvas | original
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys: handlerKeysOriginal
    }));
    part1Objects.push(new Part1Constructor("asteroid-q2a","1",{ //canvas ID and unique number
        //Object containing specific Event handler objects for the purpouse of this canvas | q2a
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys:part2HandlerKeys
    }));
    part1Objects.push(new Part1Constructor("asteroid-q2b","2",{ //canvas Id and unique number
        //Object containing specific Event handler objects for the purpouse of this canvas | q2b
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys:part2HandlerKeys
    },{//object is passed where this object has a tourus attribute, which is boolean
        torus:true
    }));
    part1Objects.push(new Part1Constructor("asteroid-q3","3",{//canvas Id and unique number
        //Object containing specific Event handler objects for the purpouse of this canvas | q3
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys:part3HandlerKeys
    },{//object is passed where this object has a tourus attribute, which is boolean
        torus:true
    }));
    //Since all the canvas are the same size, the initParams initializes the params object with the width and height of the first canvas element
    initParams(part1Objects[0].width,part1Objects[0].height);
    //dat GUI initialization
    initGUI(params,part1Objects[0].width,part1Objects[0].height,part1Folder);
    //Opening the folder so it is view for the user
    part1Folder.open();
    //starting the animation
    tick();
}


function focusCanvas(canvasName,self){
    focus = canvasName;
    var buttons = document.getElementsByClassName('buttonx');
    for(var i = 0; i < buttons.length;i++){
        if(buttons[i].classList.contains('bg--primary')){
        buttons[i].classList.remove('bg--primary');
        }else{
            buttons[i].classList.remove('button-muted');
        }

        if(buttons[i] === self){
            buttons[i].classList.add('bg--primary');
        }else{
            buttons[i].classList.add('bg--muted');
        }
    }
    part1Objects.forEach(function(element){
        if(element.canvasName === canvasName){
            element.canvas.focus();

        }
    });
}

function animate(){
        var timeNow = new Date().getTime() / 1000; // All expressed in seconds
        if (params_animation.lastTime != 0) {
            params_animation.elapsed = (timeNow - params_animation.lastTime);
        } else {
            params_animation.startTime = timeNow;
        }
        params_animation.lastTime = timeNow;
}

var windowRequestAnimFrame =(function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            }
}());

function initParams(width,height){

    params = {
            'x0': width/2,
            'y0': height/2,
            'angle': 0,
            'inSpace': false,
            'bounceOnBorder': false,
            'angleVelocity': 180, // 1 turn in 2s
            'velocity': 20,
            'vx': 0,
            'vy': 0,
            'acceleration': 0.1
        };
}
function initGUI(params,width,height,part1Folder) {
        part1Folder.add(params, 'x0').min(0).max(width).step(1); //.listen()
        part1Folder.add(params, 'y0').min(0).max(height).step(1); //.listen()
        part1Folder.add(params, 'angle').min(-180).max(180).step(1); //.listen()
        part1Folder.add(params, 'inSpace');
        part1Folder.add(params, 'bounceOnBorder');
        part1Folder.add(params, 'angleVelocity').min(0).max(720).step(0.1); // 720 deg max in 1s
        part1Folder.add(params, 'velocity').min(0).max(50).step(0.1); // 50 pix max in 1s
        part1Folder.add(params, 'vx').min(-50).max(+50).step(0.1); //.listen()
        part1Folder.add(params, 'vy').min(-50).max(+50).step(0.1); //.listen()
        part1Folder.add(params, 'acceleration').min(0).max(+50).step(0.1);

}

function tick() {
    animate();
    handleKeys();
    drawAll();
    windowRequestAnimFrame(tick);
}

function handleKeys() {
    part1Objects.forEach(function(element){
        if(element.canvasName ===focus || focus ===""){
         element.handleKeys(params,params_animation);
        }
    });
}

function drawAll() {
    part1Objects.forEach(function(element) {
       if(element.canvasName === focus || focus ===""){
            element.clear();
            element.drawShip(params);
       }
    });
}

//##################################
//Key Handlers
//##################################
//Original Key handler functions
function handleKeyDownOriginal (event) {
    // Uncomment this to display key presses to find the keyCodes
    //console.log(event)
    event.preventDefault();

    this.currentlyPressedKeys[event.keyCode] = true;

    // Handle single key presses (for example for firing the gun)
    //console.log(event);
    if (event.keyCode == 67) { // K
        console.log('Pressed "K"');
    }
}

function handleKeyUpOriginal(event) {
    this.currentlyPressedKeys[event.keyCode] = false;
}

function handlerKeysOriginal(params,params_animation){
    // Rotation
    if (this.currentlyPressedKeys[37]) { //Left
        params.angle -= params.angleVelocity * params_animation.elapsed
    }
    if (this.currentlyPressedKeys[39]) { // Right
        params.angle += params.angleVelocity * params_animation.elapsed
    }
    if (params.angle > 180) params.angle -= 360;
    else if (params.angle < -180) params.angle += 360;

    if (this.currentlyPressedKeys[38]) { // Up
        // TODO: ship translation
    }
    if (this.currentlyPressedKeys[40]) { // Down
        // TODO: ship translation
    }
}



//Part 2: Key Handler
function part2HandlerKeys(event,params_animation){
    // Rotation
    if (this.currentlyPressedKeys[37]) { //Left
        params.angle -= params.angleVelocity * params_animation.elapsed;
    }
    if (this.currentlyPressedKeys[39]) { // Right
        params.angle += params.angleVelocity * params_animation.elapsed;
    }

    if (params.angle > 180) params.angle -= 360;
    else if (params.angle < -180) params.angle += 360;

    if (this.currentlyPressedKeys[38]) { // Up
        // TODO: ship translation
        if(!params.inSpace){
             params.x0 += params_animation.elapsed*params.velocity*(Math.sin(params.angle / 180 * Math.PI));
             params.y0 -= params_animation.elapsed*params.velocity*(Math.cos(params.angle / 180 * Math.PI));
        }
    }
    if (this.currentlyPressedKeys[40] && !params.inSpace) { // Down
        if(!params.inSpace){
            params.x0 -= params_animation.elapsed*params.velocity*(Math.sin(params.angle / 180 * Math.PI));
            params.y0 += params_animation.elapsed*params.velocity*(Math.cos(params.angle / 180 * Math.PI));
        }
    }
}


//Part 3: Key Handler

function part3HandlerKeys(event,params_animation){
     // Rotation
    if (this.currentlyPressedKeys[37]) { //Left
        params.angle -= params.angleVelocity * params_animation.elapsed;
    }
    if (this.currentlyPressedKeys[39]) { // Right
        params.angle += params.angleVelocity * params_animation.elapsed;
    }

    if (params.angle > 180) params.angle -= 360;
    else if (params.angle < -180) params.angle += 360;


    if (this.currentlyPressedKeys[38]) { // Up
        // TODO: ship translation
        if(!params.inSpace){
             params.x0 += params_animation.elapsed*params.velocity*(Math.sin(params.angle / 180 * Math.PI));
             params.y0 -= params_animation.elapsed*params.velocity*(Math.cos(params.angle / 180 * Math.PI));
        }else{
            params.vx += params_animation.elapsed*params.acceleration*(Math.sin(params.angle / 180 * Math.PI));
            params.vy -= params_animation.elapsed*params.acceleration*(Math.cos(params.angle / 180 * Math.PI));
        }
    }
    if (this.currentlyPressedKeys[40]) { // Down
        if(!params.inSpace){
            params.x0 -= params_animation.elapsed*params.velocity*(Math.sin(params.angle / 180 * Math.PI));
            params.y0 += params_animation.elapsed*params.velocity*(Math.cos(params.angle / 180 * Math.PI));
        }else{
            params.vx -= params_animation.elapsed*params.acceleration*(Math.sin(params.angle / 180 * Math.PI));
            params.vy += params_animation.elapsed*params.acceleration*(Math.cos(params.angle / 180 * Math.PI));
        }
    }
    if(params.inSpace){
      if(params.angle < -90 && params.angle >90){
        params.x0 += params.vx*params_animation.elapsed;
        params.y0 -= params.vy*params_animation.elapsed;
      }else{
        params.x0 += params.vx*params_animation.elapsed;
        params.y0 += params.vy*params_animation.elapsed;
      }
      //Reduce Acceleration
      // if(params.vx >= 1){
      //   params.vx -= 0.01;
      // }else if(params.vx <= -1){
      //   params.vx +=0.01;
      // }
      // if(params.vy >=1){
      //   params.vy -= 0.01;
      // }else if(params.vy <= -1){
      //   params.vy +=0.01;
      // }
    }
}



//##################################
//Part 1 Function Constructor
//##################################
function Part1Constructor (canvasName,canvasNumber,keyHandlerObject,extraParameters) {
    this.canvasName = null;
    this.canvas = null;
    this.ctx = null;
    this.width = null;
    this.height = null;
    this.canvasNumber = null;
    this.handleKeys = null;
    this.currentlyPressedKeys = {};
    this.start(canvasName,canvasNumber,keyHandlerObject);

    this.extraParams = extraParameters || {torus:false};
}

Part1Constructor.prototype.start = function (canvasName,canvasNumber,keyHandlerObject) {
        this.canvasName = canvasName;
        this.canvas = document.getElementById(canvasName);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.canvasNumber = canvasNumber;
        this.handleKeys = keyHandlerObject.handlerKeys.bind(this);
        this.initKeys(keyHandlerObject);
}

Part1Constructor.prototype.initKeys = function(keyHandlerObject){
    this.canvas.setAttribute('tabindex',this.canvasNumber);
    this.canvas.addEventListener("keydown",keyHandlerObject.keydown.bind(this),true);
    this.canvas.addEventListener("keyup",keyHandlerObject.keyup.bind(this),true);
}

Part1Constructor.prototype.clear = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
}

Part1Constructor.prototype.drawShip = function(params){

   if(this.extraParams.torus){
       this.drawShipTorus(params);
   }else{
       this.drawShipOriginal(params);
   }
}
Part1Constructor.prototype.drawShipOriginal = function(params){
     // Define transformation before drawing ship
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(params.x0, params.y0);
    this.ctx.rotate(params.angle / 180 * Math.PI);

    this.ctx.beginPath();
    this.ctx.moveTo(0, -20);
    this.ctx.lineTo(10, 10);
    this.ctx.lineTo(-10, 10);
    this.ctx.lineTo(0, -20);
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Reset canvas transformation after drawing
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
}
Part1Constructor.prototype.drawShipTorus = function(params){
     // Define transformation before drawing ship
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(params.x0, params.y0);
    this.ctx.rotate(params.angle / 180 * Math.PI);


    if(params.x0 > this.width){
        params.x0 = 0;
    }else if(params.x0 < 0){
        params.x0 = this.width;
    }

    if(params.y0 > this.height){
        params.y0 = 0;
    }else if(params.y0 < 0){
        params.y0 = this.height
    }

    this.ctx.beginPath();
    this.ctx.moveTo(0, -20);
    this.ctx.lineTo(10, 10);
    this.ctx.lineTo(-10, 10);
    this.ctx.lineTo(0, -20);
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Reset canvas transformation after drawing
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
}
