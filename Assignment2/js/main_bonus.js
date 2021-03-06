//"use strict";

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
var params = {};
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
function init_app() {
    var manager = new imgManager(["./img/asteroid.png", "./img/space.png", "./img/sky.png"], start);
    //console.log(manager);
    manager.init();
    //console.log(manager);
}

function start(arrayImages) {
    //Pushing to the part1Objects array new Part1Constructor, each element that is pushed represents a canvas
    //and a question of the part 1.
    part1Objects.push(new Part1Constructor("asteroid-bonus", "0", {
        keydown: handleKeyDownOriginal,
        keyup: handleKeyUpOriginal,
        handlerKeys: part3HandlerKeys
    }, {
        torus: true,
        imgStatus: true,
        images: arrayImages,
        canShoot: true,
        shoot: false,
        bulletManager: new $BulletManager(5, 125, 10), //(max,velocity,length)
        asteroid: new $Asteroid(0, 0, 40, 40, 0, 100, arrayImages[0]) //(x,y,w,h,angle,velocity,image)
    }));
    //Since all the canvas are the same size, the initParams initializes the params object with the width and height of the first canvas element
    initParams(part1Objects[0].width, part1Objects[0].height);
    //dat GUI initialization
    initGUI(params, part1Objects[0].width, part1Objects[0].height, part1Folder);
    //Opening the folder so it is view for the user
    part1Folder.open();
    focusCanvas(part1Objects[0].canvasName, part1Objects[0].canvas);
    //starting the animation
    tick();
}

//Function that focusses the canvas, this function is more changing the color of the button to represent that a canvas is active. Note this function works because every html element with ID must be unique
//parameters: canvasName= canvas ID
//            self= selected element that is touched
function focusCanvas(canvasName, self) {
    //setting the global focus
    focus = canvasName;
    //selecting all HTML elements with class name buttonx, in the form of an array
    var buttons = document.getElementsByClassName('buttonx');
    //itterating over elements to change their state
    for (var i = 0; i < buttons.length; i++) {
        //Removing classes
        if (buttons[i].classList.contains('bg--primary')) {
            buttons[i].classList.remove('bg--primary');
        } else {
            buttons[i].classList.remove('button-muted');
        }
        //Inserting the classes for visual representation of the button
        if (buttons[i] === self) {
            buttons[i].classList.add('bg--primary');
        } else {
            buttons[i].classList.add('bg--muted');
        }
    }
    //searching for the selected element and giving it focus
    part1Objects.forEach(function (element) {
        if (element.canvasName === canvasName) {
            element.canvas.focus();

        }
    });
}

//Function that makes the necessary calculation for the animation process
//This function is from the original document
function animate() {
    var timeNow = new Date().getTime() / 1000; // All expressed in seconds
    if (params_animation.lastTime != 0) {
        params_animation.elapsed = (timeNow - params_animation.lastTime);
    } else {
        params_animation.startTime = timeNow;
    }
    params_animation.lastTime = timeNow;
}

//Variable that searches for the available request animation frame and points to it.
//This function is from the original document
var windowRequestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000 / 60);
        }
}());

//Functions that init the params necessary for the App and for the GUI to use
//This params are a singleton, every part share the same params
//parameters: width= width of the canvases (every canvas must be the same size)
//            height= height of the canvases
function initParams(width, height) {
    //initiate the params
    params = {
        'x0': width / 2,
        'y0': height / 2,
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

//Insert parameters to the dat GUI folder, from the params object and set their respective ranges
//parameters: params= object that must contain what is defined in the initParams function
//            width= width of the canvases
//            height= height of the canvases
//            part1Folder= dat GUI Folder instance
function initGUI(params, width, height, part1Folder) {
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

//Function that sets itself to the request animation frame,loops itself and invokes the necessary functions for doing an animation
function tick() {
    //calculating time and making the nessary changes to the params_animation
    animate();
    //handler key events if any for the focused canvas
    handleKeys();
    //Redra everything
    drawAll();
    //Setting itself to be called again
    windowRequestAnimFrame(tick);
}

//Functions that handlers Key events
function handleKeys() {
    //Iterating between every element inside the part1Objects
    part1Objects.forEach(function (element) {
        //only handle key events for the canvas that is focused or when no canvas is focused
        if (element.canvasName === focus) {
            element.handleKeys(params, params_animation);
        }
    });
}

//Function that Draws all
function drawAll() {
    //Iterating between every element inside the part1Objects
    part1Objects.forEach(function (element) {
        //only handle drawing of the focused element or if no element is focused, draw all, trick for when page loads everything is drawed
        if (element.canvasName === focus || focus === "") {
            //clear canvas and draw ship
            element.clear();
            element.drawShip(params);
        }
    });
}

//##################################
//Key Handlers
//##################################
//Original Key handler functions
//Original handleKeyDown Function
function handleKeyDownOriginal(event) {
    // Uncomment this to display key presses to find the keyCodes
    //console.log(event)
    event.preventDefault();

    this.currentlyPressedKeys[event.keyCode] = true;

    // Handle single key presses (for example for firing the gun)
    if (event.keyCode == 67) { // K
        console.log('Pressed "K"');
    }

    if (event.keyCode == 32 && !this.extraParams.shoot) { // Space
        console.log(event);
        this.extraParams.shoot = true;
    }
}

//Original handleKeyUp Function
function handleKeyUpOriginal(event) {
    this.currentlyPressedKeys[event.keyCode] = false;


    if (event.keyCode == 32) { // Space
        this.extraParams.shoot = false;
        this.extraParams.bulletManager.justFire = false;
    }
}

//Bonus: Key Handler Function
//adds movement when the parameter inSpace is true, or false
function part3HandlerKeys(event, params_animation) {
    // Rotation
    if (this.currentlyPressedKeys[37]) { //Left
        params.angle -= params.angleVelocity * params_animation.elapsed;
    }
    if (this.currentlyPressedKeys[39]) { // Right
        params.angle += params.angleVelocity * params_animation.elapsed;
    }

    if (params.angle > 180) params.angle -= 360;
    else if (params.angle < -180) params.angle += 360;

    //Translation
    if (this.currentlyPressedKeys[38]) { // Up
        // TODO: ship translation
        if (!params.inSpace) { //Not in space
            //Translate:
            //  x = x+(time * velocity * sin(Angle))
            //  y = y-(time * velocity * cos(Angle))
            params.x0 += params_animation.elapsed * params.velocity * (Math.sin(params.angle / 180 * Math.PI));
            params.y0 -= params_animation.elapsed * params.velocity * (Math.cos(params.angle / 180 * Math.PI));
        } else { //in space
            //  vx = vx+(time * acceleration * sin(Angle))
            //  vy = vy-(time * acceleration * cos(Angle))
            params.vx += params_animation.elapsed * params.acceleration * (Math.sin(params.angle / 180 * Math.PI));
            params.vy -= params_animation.elapsed * params.acceleration * (Math.cos(params.angle / 180 * Math.PI));
        }
    }
    if (this.currentlyPressedKeys[40]) { // Down
        if (!params.inSpace) { //Not in space
            //Translate:
            //  x = x-(time * velocity * sin(Angle))
            //  y = y+(time * velocity * cos(Angle))
            params.x0 -= params_animation.elapsed * params.velocity * (Math.sin(params.angle / 180 * Math.PI));
            params.y0 += params_animation.elapsed * params.velocity * (Math.cos(params.angle / 180 * Math.PI));
        } else { //In Space
            //  vx = vx-(time * acceleration * sin(Angle))
            //  vy = vy+(time * acceleration * cos(Angle))
            params.vx -= params_animation.elapsed * params.acceleration * (Math.sin(params.angle / 180 * Math.PI));
            params.vy += params_animation.elapsed * params.acceleration * (Math.cos(params.angle / 180 * Math.PI));
        }
    }
    if (params.inSpace) { //In space movement
        if (params.angle < -90 && params.angle > 90) { //If ship is looking down
            //Translate:
            //  x = x+(time * vx)
            //  y = y-(time * vy)
            params.x0 += params.vx * params_animation.elapsed;
            params.y0 -= params.vy * params_animation.elapsed;
        } else { //If ship is looking up
            //Translate:
            //  x = x+(time * vx)
            //  y = y+(time * vy)
            params.x0 += params.vx * params_animation.elapsed;
            params.y0 += params.vy * params_animation.elapsed;
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

    this.extraParams.bulletManager.moveBullets(params_animation.elapsed);
    this.extraParams.asteroid.moveAsteroid(params_animation.elapsed);
}



//##################################
//Part 1 Function Constructor
//##################################
//This function constructor abstract what is common and unique in each canvas and what they share.
//This function constructor is used to represent a canvas and their own handlers, it simplifies the code
//parameters: canvasName= canvas ID
//            canvasNumber= canvas Unique Number
//            keyHandlerObject= object containing methods: handlerKeys, keydown, keyup
//            extraParamets= object containing etra parameters to be use: torus, fire, etc. this is for knowing what the canvas or process inside the canvas can do
function Part1Constructor(canvasName, canvasNumber, keyHandlerObject, extraParameters) {
    //Initializing everything to null || {}
    this.canvasName = null;
    this.canvas = null;
    this.ctx = null;
    this.width = null;
    this.height = null;
    this.canvasNumber = null;
    this.handleKeys = null;
    this.currentlyPressedKeys = {};
    //Function that assigns and initializes the variables that are created above
    this.start(canvasName, canvasNumber, keyHandlerObject);

    this.extraParams = extraParameters || {
        torus: false,
        imgStatus: false,
        canShoot: false
    };

    if(this.extraParams.imgStatus){
        this.extraParams.asteroid.resetAsteroid(this.width,this.height,150,150);
    }
}

//Function that starts everything, this function initializes everything in the function constructor
//parameters: canvasName= canvas ID
//            canvasNumber= canvas Unique number
//             keyHandlerObject= object containing methods: handlerKeys, keydown, keyup
Part1Constructor.prototype.start = function (canvasName, canvasNumber, keyHandlerObject) {
    //Setting default and trivial stuffs
    this.canvasName = canvasName;
    this.canvas = document.getElementById(canvasName);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasNumber = canvasNumber;
    this.handleKeys = keyHandlerObject.handlerKeys.bind(this); //binding itself to the function handlerKey,this is due to that is an external function
    this.initKeys(keyHandlerObject);
}

//Function that inits the event listeners to the current canvas
//parameters: keyHandlerObject= object containing methods: handlerKeys, keydown, keyup
Part1Constructor.prototype.initKeys = function (keyHandlerObject) {
    //setting the attribute to the canvas
    this.canvas.setAttribute('tabindex', this.canvasNumber);
    //adding the keyup and keydown eventlistener and binding this to the keyHandlerObject functions
    this.canvas.addEventListener("keydown", keyHandlerObject.keydown.bind(this), true);
    this.canvas.addEventListener("keyup", keyHandlerObject.keyup.bind(this), true);
}

//Function that clears the canvas, it erases everything and sets it to its initial state
Part1Constructor.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
}

//Function that draws the ship on the canvas
//parameters: params= singleton params that is used in the app
Part1Constructor.prototype.drawShip = function (params) {
    //if torus is true, it draws the ship with the torus
    //else it does not draw the ship with the torus
    if (this.extraParams.torus) {
        this.drawShipTorus(params);
    } else {
        this.drawShipOriginal(params);
    }
}

//Function that draws the ship without the torus, it is the original drawShip
//parameters: params= singleton params that is used in the app
Part1Constructor.prototype.drawShipOriginal = function (params) {
    // Define transformation before drawing ship
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(params.x0, params.y0);
    this.ctx.rotate(params.angle / 180 * Math.PI);
    //Draw ship
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

//Function that draws the ship with torus
//parameters: params= singleton params that is used in the app
Part1Constructor.prototype.drawShipTorus = function (params) {
    // Define transformation before drawing ship
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (params.inSpace && this.extraParams.imgStatus) {
        this.ctx.drawImage(this.extraParams.images[1], 0, 0);
    } else if (this.extraParams.imgStatus == true) {
        this.ctx.drawImage(this.extraParams.images[2], 0, 0);
    }
    this.ctx.translate(params.x0, params.y0);
    this.ctx.rotate(params.angle / 180 * Math.PI);

    //checks if the current params points (x0,y0) are out of the canvas bounds, between (0,0) and (w,h)
    //If they are not, then they are set to their inverse ranges or bounds
    if (params.x0 > this.width) { // x0> width, then x0 = 0
        params.x0 = 0;
    } else if (params.x0 < 0) { // x0<0, then x0 = width
        params.x0 = this.width;
    }
    if (params.y0 > this.height) { // y0 >height, then y0= 0
        params.y0 = 0;
    } else if (params.y0 < 0) { // y0<0, then y0= height
        params.y0 = this.height
    }

    //draw the ship
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

    if (this.extraParams.shoot && !this.extraParams.bulletManager.justFire) {
        this.extraParams.bulletManager.insertBullet(params.x0, params.y0, params.angle);
        this.extraParams.bulletManager.justFire = true;
    }

    this.extraParams.bulletManager.drawBullets(this.ctx);
    this.extraParams.asteroid.draw(this.ctx);

    this.extraParams.bulletManager.checkBulletsBounds(this.width, this.height);
    this.extraParams.bulletManager.checkCollision(this.extraParams.asteroid);

    if (this.extraParams.bulletManager.mustRemove) {
        this.extraParams.bulletManager.removeBullets();
    }

    if (this.extraParams.asteroid.collision) {
        this.extraParams.asteroid.resetAsteroid(this.width, this.height, params.x0, params.y0, true);
    } else if (this.extraParams.asteroid.checkOutOfBound(this.width, this.height)) {
        this.extraParams.asteroid.resetAsteroid(this.width, this.height, params.x0, params.y0);
    }

}


//********************
//********************
//image manager
//It manages the image loading
//********************
//********************
function imgManager(imagesArrayName, callbackWhenLoaded) {
    this.imagesName = imagesArrayName;
    this.imagesLoaded = 0;
    this.imageArray = new Array();
    this.imagesCount = imagesArrayName.length;
    this.functionToCall = callbackWhenLoaded;
}

imgManager.prototype.init = function () {
    for (var i = 0; i < this.imagesCount; i++) {
        var image = new Image();
        image.onload = this.check.bind(this);
        image.src = this.imagesName[i];
        this.imageArray.push(image);
    }
}

imgManager.prototype.check = function () {

    this.imagesLoaded++;
    if (this.imagesLoaded == this.imagesCount) {
        this.functionToCall(this.imageArray);
    }
}



//********************
//********************
//Bullet Function Constructor
//It represents a single bullet
//********************
//********************
function $Bullet(x, y, angle) {
    this.angle = angle;
    this.x = x;
    this.y = y;
    this.outOfBounds = false;
}

$Bullet.prototype.move = function (velocity, elapsed) {
    //console.log(velocity,elapsed,this.x,this.y);
    this.x += elapsed * velocity * (Math.sin(this.angle / 180 * Math.PI));
    this.y -= elapsed * velocity * (Math.cos(this.angle / 180 * Math.PI));
}

$Bullet.prototype.draw = function (ctx, length) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle / 180 * Math.PI);

    ctx.strokeStyle = "orange";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, length);
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

$Bullet.prototype.checkBound = function (w, h) {
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
        return true;
    }
    return false;
}

$Bullet.prototype.deactivate = function () {
    this.outOfBounds = true;
}



//********************
//********************
//Bullet Manager Function Contructor
//It manages the bullet and verifies the collitions
//********************
//********************
function $BulletManager(maxBullets, velocity, bulletLength) {
    this.justFire = false;
    this.bulletLength = bulletLength;
    this.maxBullet = maxBullets;
    this.velocity = velocity;
    this.mustRemove = false;
    this.bullets = new Array();
}

$BulletManager.prototype.insertBullet = function (x, y, angle) {
    if (this.maxBullet > this.bullets.length) {
        this.bullets.push(new $Bullet(x, y, angle));
    }
}

$BulletManager.prototype.removeBullets = function () {
    var self = this;
    this.bullets.forEach(function (element, index, array) {
        if (element.outOfBounds) {
            array.splice(index, 1);
        }
    });
    self.mustRemove = false;
}

$BulletManager.prototype.checkBulletsBounds = function (w, h) {
    var self = this;
    this.bullets.forEach(function (element) {
        if (element.checkBound(w, h)) {
            element.deactivate();
            self.mustRemove = true;
        }
    });
}

$BulletManager.prototype.drawBullets = function (ctx) {
    var bulletLength = this.bulletLength;
    this.bullets.forEach(function (element) {
        element.draw(ctx, bulletLength);
    });
}

$BulletManager.prototype.moveBullets = function (elapsed) {
    var velocity = this.velocity;
    this.bullets.forEach(function (element) {
        element.move(velocity, elapsed);
    });
}

$BulletManager.prototype.checkCollision = function (asteroid) {
    var self = this;
    this.bullets.forEach(function (element) {
        if (asteroid.checkCollision(element)) {
            element.outOfBounds = true;
            self.mustRemove = true;
        }
    });
}


//********************
//********************
//Asteroid function constructor
//It manages the asteroid, it also represents the asteroid
//********************
//********************

function $Asteroid(x, y, w, h, angle, velocity, img) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.velocity = velocity;
    this.img = img;
    this.w = w;
    this.h = h;
    this.outOfBound = false;
    this.collision = false;
}

$Asteroid.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
}

$Asteroid.prototype.moveAsteroid = function (elapsed) {
    if (this.angle < -90 && this.angle > 90) {
        this.x += elapsed * this.velocity * (Math.sin(this.angle / 180 * Math.PI));
        this.y -= elapsed * this.velocity * (Math.cos(this.angle / 180 * Math.PI));
    } else {
        this.x += elapsed * this.velocity * (Math.sin(this.angle / 180 * Math.PI));
        this.y += elapsed * this.velocity * (Math.cos(this.angle / 180 * Math.PI));
    }
}

$Asteroid.prototype.resetAsteroid = function (w,h, x, y, destroy) {
    destroy = destroy || false;

    if (Math.random() >= 0.5) {
        this.x = getRandomArbitrary(w + 10, w + 29);
    } else {
        this.x = -getRandomArbitrary(10, 29);
    }
    if (Math.random() >= 0.5) {
        this.y = getRandomArbitrary(h + 10, h + 29);
    } else {
        this.y = -getRandomArbitrary(10, 29);
    }

    this.angle = Math.atan((y-this.y)/(x-this.x))*(180/Math.PI);

    if (destroy) {
        this.collision = false;
    } else {
        this.outOfBound = false;
    }
}

$Asteroid.prototype.checkCollision = function (bullet) {
    //console.log("checking collision",bullet);
    if (!this.collision && bullet.x >= this.x && bullet.x <= this.x+this.w && bullet.y >= this.y && bullet.y <= this.y+this.h)     {
        this.collision = true;
    }

    return this.collision;
}

$Asteroid.prototype.checkOutOfBound = function (w, h) {
    if (this.x <= -60 || this.x >= w + 60 || this.y <= -60 || this.y >= h + 60) {
        this.outOfBound = true;
    }
    return this.outOfBound;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
