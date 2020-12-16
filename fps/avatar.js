class Avatar {

    constructor(camera, scene) {

        var mat = Physijs.createMaterial(new THREE.MeshPhongMaterial ({color: 0x000000}), 1, 0);
        this.avatar = new THREE.Mesh (new THREE.BoxGeometry (5, 5, 5), mat);
        // this.avatar = new Physijs.BoxMesh(
        //     new THREE.BoxGeometry (5, 5, 5),
        //     new THREE.MeshPhongMaterial ({color: 0x000000}), 
        //     1, {restitution: .9, friction: .1});
        this.avatar.material.transparent = true;
        this.avatar.material.opacity = 0.0;
        this.avatar.position.y = 20;
        this.avatar.__dirtyPosition = true;
        scene.add(this.avatar);
        this.camera = camera;
        this.controls = controls;
        this.activeWeapon = null;
        this.goingUp = true;
        this.recoil = true;
        this.posLimite = 82;
        this.flashlight = null;
        this.raycaster = new THREE.Raycaster();
        this.scene = scene;
        this.lockMoveForward = false;
        this.rotationMatrices = [];

        var cameraHolder = new THREE.Object3D();
        cameraHolder.name = "camera";
        cameraHolder.add(this.camera);
        this.avatar.add(cameraHolder);

        var rotationMatrixF = new THREE.Matrix4();
		rotationMatrixF.makeRotationY(0);
		this.rotationMatrices.push(rotationMatrixF); // forward direction.

		var rotationMatrixB = new THREE.Matrix4();
		rotationMatrixB.makeRotationY(180 * Math.PI / 180);
		this.rotationMatrices.push(rotationMatrixB);

		var rotationMatrixL = new THREE.Matrix4();
		rotationMatrixL.makeRotationY(90 * Math.PI / 180);
		this.rotationMatrices.push(rotationMatrixL);

		var rotationMatrixR = new THREE.Matrix4();
		rotationMatrixR.makeRotationY((360 - 90) * Math.PI / 180);
        this.rotationMatrices.push(rotationMatrixR);

        this.sound = new Howl({
            src: ['sounds/footsteps.mp3'], volume: 0.5
        });
        
        var options = {
			speedFactor: 0.5,
			delta: 1,
			rotationFactor: 0.002,
			maxPitch: 55,
			hitTest: true,
			hitTestDistance: 20
		};
        this.config = $.extend({
            speedFactor: 0.5,
            delta: 1,
            rotationFactor: 0.002,
            maxPitch: 55,
            hitTest: true,
            hitTestDistance: 20
        }, options);
    }

    getPosition() {
        var pos = new THREE.Vector3();
        pos.x = this.avatar.position.x;
        pos.y = this.avatar.position.y;
        pos.z = this.avatar.position.z;
        return pos;
    }

    setInitialPosition() {
        this.avatar.position.set(0, 2.5, 0);
    }

    getActiveWeapon() {
        return this.activeWeapon;
    }

    jump() {
        if (this.goingUp) {
            // if (this.avatar.position.y > 30) this.goingUp = false;
            // else this.avatar.position.y += 0.75;
        } else {
            // if (this.avatar.position.y >= 2 && this.avatar.position.y <= 20) {
            //     jumping = false;
            //     this.goingUp = true;
            // } else this.avatar.position.y -= 0.75;
        }
    }

    updateControls() {
        controls.getObject().position.set(this.avatar.position.x, this.avatar.position.y+5, this.avatar.position.z);
    }

    playWalkSound(){
        // setTimeout(() => {
        //     this.sound.play();
        // }, 1000);
    }

    moveForward() {
        var target = this.camera.getWorldDirection();
        // this.hitTest();

        if(!this.lockMoveForward){
            var nextPosition = target.x + this.avatar.position.x;
            if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
                this.avatar.translateX( target.x );
            nextPosition = target.z + this.avatar.position.z;
            if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
                this.avatar.translateZ( target.z );
        }
    }

    moveBackward() {
        var target = this.camera.getWorldDirection();
        var nextPosition = -target.x + this.avatar.position.x;
        if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
            this.avatar.translateX( -target.x );
        nextPosition = -target.z + this.avatar.position.z;
        if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
            this.avatar.translateZ( -target.z );
    }

    moveLeft() {
        var target = this.camera.getWorldDirection();
        var nextPosition = target.z + this.avatar.position.x;
        if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
            this.avatar.translateX( target.z );
        nextPosition = -target.x + this.avatar.position.z;
        if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
            this.avatar.translateZ( -target.x );
    }

    moveRight() {
        var target = this.camera.getWorldDirection();
        var nextPosition = -target.z + this.avatar.position.x;
        if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
            // this.avatar.addListener('collision', function(){
            //     console.log('collide');
            // });
            this.avatar.translateX( -target.z );
        nextPosition = target.x + this.avatar.position.z;
        if(nextPosition <= this.posLimite && nextPosition >= -this.posLimite)
            this.avatar.translateZ( target.x );
    }

    changeWeapon() {
        if (this.activeWeapon == 0) {
            this.flashlight.material.transparent = true;
            this.flashlight.material.opacity = 0.0;
            this.activeWeapon = 1;
        }
    }

    animateWeapon() {

    }

    loadWeapons() {
        var thatCamera = this.camera;
        var that = this;

        var mtlLoader = new THREE.MTLLoader();
        var objLoader = new THREE.OBJLoader();
        var texture = null;

        mtlLoader.setPath( "models/" );
        mtlLoader.load( "material.mtl" , function ( materials ) {
            materials.preload();
            
            objLoader.setMaterials( materials );
            objLoader.setPath( "models/" );
            objLoader.load( "flashlight.obj", function ( object ) {
                texture = THREE.ImageUtils.loadTexture('models/flashlighttexture.png');
                object.children[0].material = new THREE.MeshLambertMaterial({map: texture});
                //m4a1_s
                object.children[0].position.set(0, 0, 0);
                object.children[0].scale.set(0.2, 0.2, 0.2);
                object.children[0].rotation.set(0.1, 3.4, 0);
                object.children[0].position.set(2, -0.8, -2);
                that.flashlight = object.children[0];
                thatCamera.add(that.flashlight);
                that.activeWeapon = 0;
            });
        });
    }

    getDirection2(v) {
        var direction = new THREE.Vector3(0, 0, -0.1);
        var rotation = new THREE.Euler(0, 0, 0, 'XYZ');
        var rx = this.avatar.getObjectByName("camera").rotation.x;
        var ry = this.avatar.rotation.y;

        rotation.set(rx, ry, 0);
        v.copy(direction).applyEuler(rotation);
        return v;
    }

    hitTest() {
        this.unlockAllDirection();
        var cameraDirection = this.getDirection2(new THREE.Vector3(0, 0, 0));
        let hitObject = [];

        // console.log(this.rotationMatrices);
        for(var i=0; i<4; i++){
            var direction = cameraDirection.clone();
            direction.applyMatrix4(this.rotationMatrices[i]);
            var rayCaster = new THREE.Raycaster(this.avatar.position, direction);
            var intersects = rayCaster.intersectObject(this.scene,  true); 

            if ((intersects.length > 0 && intersects[0].distance < this.config.hitTestDistance)) {
				this.lockDirectionByIndex(i);
				hitObject.push(intersects[0]);
				// console.log(intersects[0].object.name, i);
			}
        }

        // return hitObject;
    }

    lockDirectionByIndex(index) {
		if (index == 0)
			this.lockMoveForward = true;
		else if (index == 1)
			self.lockMoveBackward(true);
		else if (index == 2)
			self.lockMoveLeft(true);
		else if (index == 3)
			self.lockMoveRight(true);
    }

    unlockAllDirection() {
        this.lockMoveForward = false;
    }
}