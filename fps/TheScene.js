/// The Model Facade class. The root node of the graph.

class TheScene extends Physijs.Scene {
  
  constructor (renderer, aCamera) {

    super();
    this.setGravity(new THREE.Vector3 (0, -50, 0));

    this.camera = aCamera;
    this.createCrosshair(renderer);

    this.avatar = null;
    this.map = null;
    this.enemies = null;
    this.skybox = null;
    this.Bullets = null;
    this.index = 0;
    this.maxBullets = 20;
    this.actualAmmo = 40; //Balas totales antes de acabar el juego
    this.score = 0;
    this.lastScore = 0;
    this.level = 1;

    this.createHUD();

    this.createAvatar();
    this.avatar.loadWeapons();
    this.place = this.createPlace();
    this.createEnemies(this.level);


    this.ambientLight = null;
    this.spotLight = null;
    this.spotLight2 = null;
    this.spotLight3 = null;
    this.flashLight = null;

    this.createLights();

    this.add(this.place);
  }
  
  createHUD() {
  }

  updateScore(newScore){
    var text = document.getElementById("score");
    this.score += newScore;
    text.innerHTML = "Puntuacion: " + this.score;
  }

  updateLevel() {
    var level = document.getElementById("level");
    level.innerHTML = "Nivel: " + this.level;
  }

  /// It creates the camera and adds it to the graph
  createCrosshair(renderer) {
    // Create the Crosshair
    var crosshair = new Crosshair();
    this.camera.add( crosshair );

    // Place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;
    crosshair.position.set((crosshairPercentX / 100) * 2 - 1, (crosshairPercentY / 100) * 2 - 1, -0.3);
  }

  onclick(event) {
    
  }
  
  /// It creates lights and adds them to the graph
  createLights() {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.03);
    this.add (this.ambientLight);
    
    this.flashLight = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 7, 20), new THREE.MeshPhongMaterial({color:0x000000}));
    this.flashLight.rotateX(Math.PI/2);
    this.camera.add(this.flashLight);
    
    this.spotLight = new THREE.SpotLight(0xffffff, 0.5, 50);
    this.spotLight.power = 5;
    this.spotLight.angle = 0.3;
    this.spotLight.decay = 1;
    this.spotLight.penumbra = 0.2;
    this.spotLight.distance = 300;
    this.spotLight.castShadow = true;
    this.spotLight.rotateX(Math.PI/2);

    this.flashLight.add(this.spotLight);
    this.flashLight.add(this.spotLight.target);
  }
  
  /// It creates the place
  createPlace() {
    var place = new THREE.Object3D();    

    //Creates the map
    this.map = new Map();
    for (var i = 0; i < this.map.getMapSize(); ++i) {
      this.add(this.map.getMap(i));
    }

    return place;
  }

  /// It creates the avatar
  createAvatar() {
    this.avatar = new Avatar(this.camera, this);
  }

  /// It creates the enemies
  createEnemies() {
    this.enemies = new Enemies(this, this.level);
  }

  endGame() {
    enableControls = false;
    controls.enabled = false;
    
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    jumping = false;

    blocker.style.display = 'block';
    instructions.style.display = '';
    instructions.style.fontSize = "50px";

    instructions.innerHTML = "Puntuacion total: " + this.score + ", pulsa la tecla P para jugar otra partida.";
  }
  
  /// 
  animate () {
    this.simulate();

    if (moveForward) this.avatar.moveForward();
    if (moveBackward) this.avatar.moveBackward();
    if (moveLeft) this.avatar.moveLeft();
    if (moveRight) this.avatar.moveRight();

    if (jumping) {
      this.avatar.jump();
    }

    this.avatar.updateControls();

    if (this.actualAmmo == 0) {
      this.endGame();
    }
  }

  /// It returns the camera
  getCamera () {
    return this.camera;
  }
  
  /// It returns the camera controls
  getCameraControls () {
    return this.controls;
  }
  
  /// It updates the aspect ratio of the camera
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }
  
  newLevel() {
    this.avatar.setInitialPosition();

    if(this.score - this.lastScore != 40)
      this.score = this.lastScore + 40;

    this.updateLevel();

    for (var i = 0; i < this.enemies.getEnemiesSize(); ++i) {
      this.remove(this.enemies.getEnemies(i));
    }
    // this.createEnemies();
    this.lastScore = this.score;
  }

  newGame() {
    blocker.style.display = 'none';
    enableControls = true;
    controls.enabled = true;
    this.avatar.setInitialPosition();
    this.actualAmmo = 40;
    this.updateAmmo();
    this.score = 0;
    this.updateScore(0);
    this.level = 1;
    this.updateLevel();

    for (var i = 0; i < this.enemies.getEnemiesSize(); ++i) {
      this.remove(this.enemies.getEnemies(i));
    }
    // this.createEnemies();
  }

}

