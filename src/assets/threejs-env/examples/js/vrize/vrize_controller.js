// created 2018-02-19
//
// Attempt to add an a-frame <laser-control> to the existing three.js scene
//
console.log(`vrize_cntrl: now adding body vrize-init event`);
// document.querySelector('a-scene').addEventListener('loaded', function () {...})
// let canvas = document.querySelector('canvas');
// canvas.addEventListener(("loaded"), addAfCntrl);

// let body = document.querySelector('window');
window.addEventListener(("vrize-init"), addAfCntrl);
// window.addEventListener(("onload"), addAfCntrl);

var controller;
function addAfCntrl(event) {
  console.log(`vrize_cntrl.addAfCntrl: entered, dolly=${dolly}`);

  // controller = new THREE.ViveController();
  // dolly.add( controller );
  //
  // var loader = new THREE.OBJLoader();
  // loader.setPath( 'models/obj/vive-controller/' );
  // loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {
  //
  //   var loader = new THREE.TextureLoader();
  //   loader.setPath( 'models/obj/vive-controller/' );
  //
  //   let controller_tmp = object.children[ 0 ];
  //   controller_tmp.material.map = loader.load( 'onepointfive_texture.png' );
  //   controller_tmp.material.specularMap = loader.load( 'onepointfive_spec.png' );
  //   controller_tmp.castShadow = true;
  //   controller_tmp.receiveShadow = true;
  //
  //   controller.add( controller_tmp.clone() );
  //   // debugger;
  // })
}

// this.el.sceneEl.addEventListener('camera-set-active', function (evt) {
// scene.addEventListener('camera-set-active', function (evt) {
//   console.log(`vrize_cntrl.camare-set-active: camera=${evt.detail.cameraEl}`);
// });
window.addEventListener( 'vr controller connected', function( event ){
  console.log(`vrize_controller.VRController now activated!`);
  // THREE.VRController.verbosity = 1

	//  Here it is, your VR controller instance.
	//  It’s really a THREE.Object3D so you can just add it to your scene:

	var controller = event.detail
  console.log(`controller.style=${controller.style}`);
	// scene.add( controller )
  //vt add
  // controller.position.y = 400;
  //vt end
	dolly.add( controller )


	//  HEY HEY HEY! This is important. You need to make sure you do this.
	//  For standing experiences (not seated) we need to set the standingMatrix
	//  otherwise you’ll wonder why your controller appears on the floor
	//  instead of in your hands! And for seated experiences this will have no
	//  effect, so safe to do either way:

	controller.standingMatrix = renderer.vr.getStandingMatrix()


	//  And for 3DOF (seated) controllers you need to set the controller.head
	//  to reference your camera. That way we can make an educated guess where
	//  your hand ought to appear based on the camera’s rotation.

	//vt controller.head = window.camera
  //vt key!
	controller.head = window.dolly

	//  Right now your controller has no visual.
	//  It’s just an empty THREE.Object3D.
	//  Let’s fix that!

	var
	meshColorOff = 0xDB3236,//  Red.
	meshColorOn  = 0xF4C20D;//  Yellow.

  // controller pos
  var firstControllerPos = {};
  firstControllerPos = Object.assign({}, controller.position);
  var lastControllerPos = {};
  lastControllerPos = Object.assign({}, controller.position);
  var firstDollyPos = {};

  // controller rot
  var firstControllerRot = {};
  firstControllerRot = Object.assign({}, controller.rotation);
  var lastControllerRot = {};
  lastControllerRot = Object.assign({}, controller.rotation);
  var firstDollyRot = {};
  // var sf = 100;
  // var sf = 200;
  //TODO: consider using controls.maxDistance - controls.minDistance in the lifted
  // script (OrbitControls) to scale sf apporpriately.
  var sf = 400;
  var tickRun = false;
  // var sf = 1.1;
  var tickReq;
  var gripping = false;
  var triggering = false;
  var aButtonPressing = false;
  var grabbing = false;

	controllerMaterial = new THREE.MeshStandardMaterial({

		color: meshColorOff
	}),
	controllerMesh = new THREE.Mesh(

		new THREE.CylinderGeometry( 0.005, 0.05, 0.1, 6 ),
		controllerMaterial
	),
	handleMesh = new THREE.Mesh(

		new THREE.BoxGeometry( 0.03, 0.1, 0.03 ),
		controllerMaterial
	)

	controllerMaterial.flatShading = true
	controllerMesh.rotation.x = -Math.PI / 2
	handleMesh.position.y = -0.05
	controllerMesh.add( handleMesh )
	controller.userData.mesh = controllerMesh//  So we can change the color later.
	controller.add( controllerMesh )

	// castShadows( controller )
	// receiveShadows( controller )


	// //  Allow this controller to interact with DAT GUI.
  //
	// var guiInputHelper = dat.GUIVR.addInputObject( controller )
	// scene.add( guiInputHelper )
  //
	//  Check out the THREE.VRController.supported{} object to see
	//  all the named buttons we’ve already mapped for you!
	controller.addEventListener( 'primary press began', function( event ){

		event.target.userData.mesh.material.color.setHex( meshColorOn )
		// guiInputHelper.pressed( true )
	})

	controller.addEventListener( 'primary press ended', function( event ){

		event.target.userData.mesh.material.color.setHex( meshColorOff )
		// guiInputHelper.pressed( false )
	})

	controller.addEventListener( 'trigger press began', function( event ){
    triggering = true;
    checkForGrabbing();
    console.log(`vrize_controller: trigger press began detected`);
    if (controller.style === 'vive') {
      grabbing = true;
      grabStart();
    }
	})

	controller.addEventListener( 'trigger press ended', function( event ){
    triggering = false;
    checkForGrabbing();
    console.log(`vrize_controller: trigger press ended detected`);
    if (controller.style === 'vive') {
      grabbing = false;
      grabEnd();
    }
	})

	controller.addEventListener( 'A press began', function( event ){
    aButtonPressing = true;
    checkForGrabbing();
    console.log(`vrize_controller: A press began detected`);
	})

	controller.addEventListener( 'A press ended', function( event ){
    aButtonPressing = false;
    checkForGrabbing();
    console.log(`vrize_controller: A press ended detected`);
	})

  // oculus "go back to prior page"
	controller.addEventListener( 'thumbstick press began', function( event ){
    console.log(`vrize_controller: thumbstick press began detected`);
    window.history.back();
	})

  // vive "go back to prior page"
	controller.addEventListener( 'menu press began', function( event ){
    console.log(`vrize_controller: menu press began detected`);
    window.history.back();
	})

	controller.addEventListener( 'grip press began', function( event ){
    if (!grabbing) {
      gripping = true;
    }
    checkForGrabbing();

    firstControllerRot.x = controller.rotation.x;
    firstControllerRot.y = controller.rotation.y;
    firstControllerRot.z = controller.rotation.z;

    firstDollyRot.x = dolly.rotation.x;
    firstDollyRot.y = dolly.rotation.y;
    firstDollyRot.z = dolly.rotation.z;
    tickRun = true;
    tick();
  })

	controller.addEventListener( 'grip press ended', function( event ){
    // gripping = false;
    if (!grabbing) {
      gripping = false;
    }
    checkForGrabbing();

    tickRun = false;

    lastControllerRot.x = controller.rotation.x;
    lastControllerRot.y = controller.rotation.y;
    lastControllerRot.z = controller.rotation.z;
  })

	// controller.addEventListener( 'grip press began', function( event ){
  function grabStart() {
    //vt add
    // we need to pre-emptively set gripping to false, so that if the a-key
    // and trigger-key are released before the grip-key (during a "grab-end"
    // operation), we don't get a lingering rotation due to the grip-key
    // being residually active.
    gripping = false;
    //vt end

    firstControllerPos.x = controller.position.x;
    firstControllerPos.y = controller.position.y;
    firstControllerPos.z = controller.position.z;

    firstDollyPos.x = dolly.position.x;
    firstDollyPos.y = dolly.position.y;
    firstDollyPos.z = dolly.position.z;
    tickRun = true;
    tick();
	}

	// controller.addEventListener( 'grip press ended', function( event ){
  function grabEnd () {
    //vt add
    // gripping = false;
    //vt end
    // console.log(`vrize_controller: grip press ended detected`);
    tickRun = false;

    lastControllerPos.x = controller.position.x;
    lastControllerPos.y = controller.position.y;
    lastControllerPos.z = controller.position.z;
	}

  function getTickRun() {
    return tickRun;
  }


  function tick() {
    if (grabbing) {
      updateDollyPos();
    }
    // else if (gripping) {
    else if (gripping && !grabbing) {
      updateDollyRot();
    }

    if (tickRun) {
      tickReq = requestAnimationFrame(tick);
    }

  }

  function updateDollyPos () {
    let tmpControllerPos = controller.position.clone();
    let yAxis = new THREE.Vector3(0,1,0);
    let deltaVec = new THREE.Vector3();
    deltaVec.x = (controller.position.x - firstControllerPos.x) * sf
    deltaVec.y = (controller.position.y - firstControllerPos.y) * sf
    deltaVec.z = (controller.position.z - firstControllerPos.z) * sf
    deltaVec.applyAxisAngle(yAxis, dolly.rotation.y);
    dolly.position.x = firstDollyPos.x - deltaVec.x;
    dolly.position.y = firstDollyPos.y - deltaVec.y;
    dolly.position.z = firstDollyPos.z - deltaVec.z;
  }

  function updateDollyRot () {
    dolly.rotation.y = (controller.rotation.y - firstControllerRot.y) * 1 + firstDollyRot.y;
  }

  function checkForGrabbing() {
    if (gripping && triggering && aButtonPressing) {
      grabbing = true;
      grabStart();
    }
    else {
      grabbing = false;
      grabEnd();
    }
    console.log(`checkForGrabbing: grabbing=${grabbing}`);
  }

	controller.addEventListener( 'disconnected', function( event ){

		controller.parent.remove( controller )
	})
})
