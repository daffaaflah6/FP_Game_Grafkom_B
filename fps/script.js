
/// Several functions, including the main

/// The scene graph
scene = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

renderer = null;

camera = null;
controls = null;
moveForward = false;
moveBackward = false;
moveLeft = false;
moveRight = false;
jumping = false;
fire = false;
enableControls = true; //habilita la entrada de datos por ratón y teclado
torch = true;
objs = [];
INTERSECTED = null;
intersects = [];

function createGUI (withStats) {
  var gui = new dat.GUI();

  if (withStats) stats = initStats();
  for(i=0; i < scene.children.length; i++){
    objs.push(scene.children[i]);  
  }
}

function initStats() {

  var stats = new Stats();

  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  $("#Stats-output").append( stats.domElement );

  return stats;
}

function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}

function onMouseDown (event) {
  if (enableControls) {
    if(event.buttons == 1 && blocker.style.display == 'none') {
      scene.onclick(event);
      console.log(intersects);
      if(intersects[0].object.name == 'item'){
        removeEntity(intersects[0].object);
      }
      // removeEntity(intersects[0].object);
    }
  }
}

function onMouseMove (event) {
  var cameraDirection = controls.getDirection(new THREE.Vector3(0, 0, 1)).clone();
  event.preventDefault();

  var raycaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);
  this.intersects = raycaster.intersectObjects(objs);
  if ( intersects.length == 2 ) {

    if ( INTERSECTED != intersects[ 0 ].object &&  intersects[ 0 ].object.name == 'item') {

      if ( INTERSECTED ) {
        INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        removeEntity(INTERSECTED);
      }

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }
}

function removeEntity(object) {
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove( object );
  scene.animate();
}

function onKeyDown (event) {
  if (enableControls) {
    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        jumping = true;
        break;

      case 70: // f
        torch = true;
        break;

      case 81: // q
        if (!fire) scene.changeWeapon();
        break;
    }
  }

  if (event.keyCode == 80 && enableControls == false) { // p
    scene.newGame();
  }
}

function onKeyUp (event) {
  if (enableControls) {
    switch( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 70: // f
        torch = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  }
}

/// It processes the wheel rolling of the mouse
function onMouseWheel (event) {
  if (enableControls) {
    // if (!disparando) scene.changeWeapon();
  }
}

/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;
  return renderer;
}

/// It renders every frame
function render() {
  requestAnimationFrame(render);
  detectCollision(scene.getCamera());
  stats.update();
  scene.animate();
  renderer.render(scene, scene.getCamera());
  scene.simulate();
}

function detectCollision(camera, scene) {
  // console.log(camera);
}

/// The main function
$(function () {
  'use strict';
  Physijs.scripts.worker = '../libs/physijs_worker.js';
  Physijs.scripts.ammo = '../libs/ammo.js';


  var instructions = document.getElementById( 'instructions' );
  var title = document.getElementById('title');
  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

        controlsEnabled = true;
        controls.enabled = true;

        enableControls = true;

        blocker.style.display = 'none';

      } else {


        blocker.style.display = 'block';

        instructions.style.display = '';

        //title.innerHTML = "PAUSA";
        instructions.style.fontSize = "50px";
        instructions.innerHTML = "PAUSE";

        enableControls = false;
        controls.enabled = false;

      }

    };

    var pointerlockerror = function ( event ) {

      instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {

      instructions.style.display = 'none';

      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      element.requestPointerLock();

    }, false );

  } else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

  }

  var controlsEnabled = false;
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // liseners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener ("mousemove", onMouseMove, true);
  window.addEventListener ("keydown", onKeyDown, true);
  window.addEventListener ("keyup", onKeyUp, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement, camera);
  controls = new THREE.PointerLockControls (camera);
  scene.add( controls.getObject() );

  createGUI(true);

  render();
});
