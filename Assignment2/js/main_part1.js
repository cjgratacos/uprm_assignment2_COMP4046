"use strict";

/*
 * Carlos J. Gratacos (802-10-2990)
 * COMP4046 UPRM 15S1
 * Date: October 13, 2015
 * Description: Second Assignment
 *
 * Note for this File to work all canvas that are going to be used most be of the same size.
 */


// Single instance of the DAT GUI used for the Assignment
// Each part has their own folder

var gui = new dat.GUI({
    autoplace: true
});

var part1Folder = gui.addFolder('Animation and Keyboard');

var params ={};

var focus = "";
var params_animation = {
        startTime: 0,
        lastTime: 0,
        elapsed: 0,
        totalElapsed: 0
};

var part1Objects = new Array();

function init_app(){

    part1Objects.push(new Part1Constructor("asteroid-original","0",{
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys: handlerKeysOriginal
    }));
    part1Objects.push(new Part1Constructor("asteroid-q2a","1",{
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys:part2HandlerKeys
    }));
    part1Objects.push(new Part1Constructor("asteroid-q2b","2",{
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys:part2HandlerKeys
    },{
        torus:true
    }));
    part1Objects.push(new Part1Constructor("asteroid-q3","3",{
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys:part3HandlerKeys
    },{
        torus:true
    }));

    initParams(part1Objects[0].width,part1Objects[0].height);
    initGUI(params,part1Objects[0].width,part1Objects[0].height,part1Folder);

    part1Folder.open();
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
