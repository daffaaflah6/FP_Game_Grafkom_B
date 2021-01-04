class Map {
  // import THREE from '../libs/three.js';  
  constructor () {
    this.map_size = 0;
    this.map = [];
    this.collidableMeshList = [];
    var mtlLoader = new THREE.MTLLoader();
    var objLoader = new THREE.OBJLoader();

    var loader = new THREE.TextureLoader();
    var textureMetal = loader.load ("imgs/walls.jpg");
    var textureBase = loader.load("imgs/floor.jpg");
    var textureBox = loader.load("imgs/box.jpg");

    var mat = Physijs.createMaterial(new THREE.MeshPhongMaterial ({map: textureMetal}),0,0);
    var matBase = Physijs.createMaterial(new THREE.MeshPhongMaterial ({map: textureBase}),0,0);
    var boxtexture = Physijs.createMaterial(new THREE.MeshPhongMaterial ({map: textureBox}),0,0);
    
    var start1 = new Physijs.BoxMesh (new THREE.BoxGeometry (200, 1, 200, 1, 1, 1), matBase, 0);
    start1.applyMatrix (new THREE.Matrix4().makeTranslation (0, -1, 0));
    start1.receiveShadow = true;
    start1.autoUpdateMatrix = false;
    start1.name = 'start1';
    this.map.push(start1);
    ++this.map_size;

    var roof1 = new Physijs.BoxMesh (new THREE.BoxGeometry (200, 0.0, 200, 1, 1, 1), matBase, 0);
    roof1.applyMatrix (new THREE.Matrix4().makeTranslation (0, 100, 0));
    roof1.receiveShadow = true;
    roof1.autoUpdateMatrix = false;
    roof1.name = 'roof1';
    this.map.push(roof1);
    ++this.map_size;

    var fenceS4 = new Physijs.BoxMesh (new THREE.BoxGeometry (200, 100, 20, 1, 1, 1), mat, 0);
    fenceS4.applyMatrix (new THREE.Matrix4().makeTranslation (0, 50, 100));
    fenceS4.receiveShadow = true;
    fenceS4.autoUpdateMatrix = false;
    fenceS4.name = 'fences4';
    this.map.push(fenceS4);
    ++this.map_size;

    var fenceE5 = new Physijs.BoxMesh (new THREE.BoxGeometry (20, 100, 200, 1, 1, 1), mat, 0);
    fenceE5.applyMatrix (new THREE.Matrix4().makeTranslation (100, 50, 0));
    fenceE5.receiveShadow = true;
    fenceE5.autoUpdateMatrix = false;
    fenceE5.name = 'fencee5';
    this.map.push(fenceE5);
    ++this.map_size;

    var fenceW6 = new Physijs.BoxMesh (new THREE.BoxGeometry (20, 100, 200, 1, 1, 1), mat, 0);
    fenceW6.applyMatrix (new THREE.Matrix4().makeTranslation (-100, 50, 0));
    fenceW6.receiveShadow = true;
    fenceW6.autoUpdateMatrix = false;
    fenceW6.name = 'fencew6';
    this.map.push(fenceW6);
    ++this.map_size;

    var fenceN7 = new Physijs.BoxMesh (new THREE.BoxGeometry (200, 100, 8, 1, 1, 1), mat, 0);
    fenceN7.applyMatrix (new THREE.Matrix4().makeTranslation (0, 50, -96));
    fenceN7.receiveShadow = true;
    fenceN7.autoUpdateMatrix = false;
    fenceN7.name = 'fencen7';
    this.map.push(fenceN7);
    ++this.map_size;

    var box = null;
    var boxes = [];

		for ( var i = 0; i < 20; i++ ) {
			box = new Physijs.SphereMesh(
				new THREE.SphereGeometry( 2, 32, 24 ),
				boxtexture
      );
      box.name = 'item';
			box.position.set(
				Math.random() * 100 - 25,
				10 + Math.random() * 5,
				Math.random() * 100 - 25
			);
			box.scale.set(
				Math.random() * 1 + 0.5,
				Math.random() * 1 + 0.5,
				Math.random() * 1 + 0.5
			);
			box.castShadow = true;
      this.map.push(box);
      boxes.push( box );
      ++this.map_size;
    }
    
    var table, wtable, tvf, plant1, bulb;

    mtlLoader.load( "models/table.mtl" , function ( materials ) {
        materials.preload();
        objLoader.setMaterials( materials );
        objLoader.load( "models/table.obj", function ( object ) {
            table = object;
            table.position.set(82, 0, -77.5);  
            table.scale.set(6.5, 6.5, 6.5);
            table.rotation.set(0, 0, 0);
            scene.add(table);
        });
    });
    mtlLoader.load( "models/wtable.mtl" , function ( materials ) {
        materials.preload();
        objLoader.setMaterials( materials );
        objLoader.load( "models/wtable.obj", function ( object ) {
            wtable = object;
            wtable.position.set(0, 0, 0);  
            wtable.scale.set(0.15, 0.15, 0.15);
            wtable.rotation.set(0, 0, 0);
            scene.add(wtable);
        });
    });
    mtlLoader.load( "models/tv-furn.mtl" , function ( materials ) {
        materials.preload();
        objLoader.setMaterials( materials );
        objLoader.load( "models/tv-furn.obj", function ( object ) {
            tvf = object;
            tvf.position.set(-107, -15, 110);  
            tvf.scale.set(1, 1, 1);
            tvf.rotation.set(0, 0, 0);
            scene.add(tvf);
        });
    });
    // mtlLoader.load( "models/y.mtl" , function ( materials ) {
    //     materials.preload();
    //     objLoader.setMaterials( materials );
    //     objLoader.load( "models/y.obj", function ( object ) {
    //         y = object;
    //         y.position.set(0, 0, 0);  
    //         y.scale.set(0, 0, 0);
    //         y.rotation.set(0, 0, 0);
    //         scene.add(y);
    //     });
    // });

    objLoader.load( "models/bulb.obj", function ( object ) {
        bulb = object; 
        bulb.position.set(82, 23.5, -85);  
        bulb.scale.set(3, 3, 3);
        bulb.rotation.set(-7.6, -5, 0);
        scene.add(bulb);
    });
    // objLoader.load( "models/x.obj", function ( object ) {
    //     x = object;
    //     x.position.set(0, 0, 0);  
    //     x.scale.set(0, 0, 0);
    //     x.rotation.set(0, 0, 0);
    //     scene.add(x);
    // });

    return this;
  }

  getMap(i) {
    return this.map[i];
  }

  getMapSize() {
    return this.map_size;
  }
}
