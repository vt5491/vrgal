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

  // var lastDollyPos = new THREE.Vector3();
  // var prevDollyPos = {};
  // var prevControllerPos = {};
  // var prevLockedControllerPos = {};
  // // prevLockedControllerPos = Object.assign({}, prevControllerPos);
  //   // if (Object.keys(prevLockedControllerPos).length === 0) {
  //   //   // need to do a deep copy
  //     prevLockedControllerPos = Object.assign({}, prevControllerPos);
  //     prevLockedControllerPos.x = controller.position.x;
  //     prevLockedControllerPos.y = controller.position.y;
  //     prevLockedControllerPos.z = controller.position.z;
  //   // }
  // var startControllerPos = {};
  // startControllerPos = Object.assign({}, controller.position);
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
  // var lastDollyPos = {};
  // lastDollyPos = Object.assign({}, dolly.position);
  // endControllerPos = {};
  // endControllerPos = Object.assign({}, controller.position);
  // var sf = 100;
  var sf = 200;
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
  //
	//  Button events. How easy is this?!
	//  We’ll just use the “primary” button -- whatever that might be ;)
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
    gripping = true;
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
    gripping = false;
    checkForGrabbing();

    tickRun = false;

    lastControllerRot.x = controller.rotation.x;
    lastControllerRot.y = controller.rotation.y;
    lastControllerRot.z = controller.rotation.z;
  })

	// controller.addEventListener( 'grip press began', function( event ){
  function grabStart() {

    // console.log(`vrize_controller: grip press began detected`);
    // startControllerPos.x = controller.position.x;
    // startControllerPos.y = controller.position.y;
    // startControllerPos.z = controller.position.z;
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
    // console.log(`vrize_controller: grip press ended detected`);
    tickRun = false;

    // if (Object.keys(prevLockedControllerPos).length === 0) {
    //   // need to do a deep copy
    //   // prevLockedControllerPos = Object.assign({}, prevControllerPos);
    //   prevLockedControllerPos.x = controller.position.x;
    //   prevLockedControllerPos.y = controller.position.y;
    //   prevLockedControllerPos.z = controller.position.z;
    // }
    // else {
      // prevLockedControllerPos = Object.assign({}, prevControllerPos);
      // prevLockedControllerPos.x = prevControllerPos.x;
      // prevLockedControllerPos.y = prevControllerPos.y;
      // prevLockedControllerPos.z = prevControllerPos.z;
      // debugger;
    // prevLockedControllerPos.x = (controller.position.x - startControllerPos.x);
    // prevLockedControllerPos.y = (controller.position.y - startControllerPos.y);
    // prevLockedControllerPos.z = (controller.position.z - startControllerPos.z);
    lastControllerPos.x = controller.position.x;
    lastControllerPos.y = controller.position.y;
    lastControllerPos.z = controller.position.z;

    // lastDollyPos.x = firstDollyPos.x;
    // lastDollyPos.y = firstDollyPos.y;
    // lastDollyPos.z = firstDollyPos.z;
    // }

    // lastDollyPos = dolly.position;
    // lastDollyPos.x = dolly.position.x;
    // lastDollyPos.y = dolly.position.y;
    // lastDollyPos.z = dolly.position.z - 400;
    // moveDollyByGrip();
	}
	// controller.addEventListener( 'grip down', function( event ){
  //   console.log(`vrize_controller: grip press down detected`);
  //   // moveDollyByGrip();
	// })

  function getTickRun() {
    return tickRun;
  }


  function tick() {
    // dolly.position.x = lastDollyPos.x + controller.position.x * sf;
    // dolly.position.y = lastDollyPos.y + controller.position.y * sf;
    // dolly.position.z = lastDollyPos.z + controller.position.z * sf + 400;
    // dolly.position.x += controller.position.x * sf;
    // dolly.position.y += controller.position.y * sf;
    // dolly.position.z += controller.position.z * sf;
    // let deltaPos = getDeltaDollyPos();
    // console.log(`tick: deltaPos.x=${deltaPos.x},deltaPos.y=${deltaPos.y},deltaPos.z=${deltaPos.z}`);
    // dolly.position.x = dolly.position.x + (deltaPos.x * sf);
    // dolly.position.y = dolly.position.y + (deltaPos.y * sf);
    // dolly.position.z = dolly.position.z + (deltaPos.z * sf);
    if (grabbing) {
      updateDollyPos();
    }
    else if (gripping) {
      updateDollyRot();
    }

    // if (getTickRun()) {
    if (tickRun) {
      tickReq = requestAnimationFrame(tick);
    }

  }

  function updateDollyPos () {
    // let tmpController = controller.clone();
    let tmpControllerPos = controller.position.clone();
    // dolly.position.x = firstDollyPos.x - (controller.position.x - firstControllerPos.x) * sf;
    // dolly.position.y = firstDollyPos.y - (controller.position.y - firstControllerPos.y) * sf;
    // dolly.position.z = firstDollyPos.z - (controller.position.z - firstControllerPos.z) * sf;
    // let rotObjectMatrix = new THREE.Matrix4();
    // rotObjectMatrix.makeRotationFromQuaternion(controller.quaternion);
    // tmpControllerPos.applyAxisAngle( new THREE.Vector3(0,1,0), dolly.rotation.y );
    //Next we just have to apply a rotation to the quaternion using the created matrix
    // boxme1.quaternion.setFromRotationMatrix(rotObjectMatrix);
    // tmpControllerPos.multiply(rotObjectMatrix);
    // dolly.position.x = firstDollyPos.x - (tmpControllerPos.x - firstControllerPos.x) * sf;
    // dolly.position.y = firstDollyPos.y - (tmpControllerPos.y - firstControllerPos.y) * sf;
    // dolly.position.z = firstDollyPos.z - (tmpControllerPos.z - firstControllerPos.z) * sf;
    let yAxis = new THREE.Vector3(0,1,0);
    let deltaVec = new THREE.Vector3();
    deltaVec.x = (controller.position.x - firstControllerPos.x) * sf
    deltaVec.y = (controller.position.y - firstControllerPos.y) * sf
    deltaVec.z = (controller.position.z - firstControllerPos.z) * sf
    deltaVec.applyAxisAngle(yAxis, dolly.rotation.y);
    dolly.position.x = firstDollyPos.x - deltaVec.x;
    dolly.position.y = firstDollyPos.y - deltaVec.y;
    dolly.position.z = firstDollyPos.z - deltaVec.z;
    // console.log(`updateDollyPos: controller.rotation.y=${controller.rotation.y}`);
    // dolly.position.x = (firstDollyPos.x - (controller.position.x - firstControllerPos.x) * sf) * Math.cos(controller.rotation.y);
    // dolly.position.y = (firstDollyPos.y - (controller.position.y - firstControllerPos.y) * sf) * Math.sin(controller.rotation.y);
    // dolly.position.x = firstDollyPos.x -
    //   ( (controller.position.x - firstControllerPos.x) * Math.cos(controller.rotation.y)) * sf;
    // dolly.position.y = firstDollyPos.y -
    //   ( (controller.position.y - firstControllerPos.y) * Math.sin(controller.rotation.y)) * sf;
    // dolly.position.x = firstDollyPos.x -
    //   ( controller.position.x  * Math.cos(controller.rotation.y) - firstControllerPos.x) * sf;
    // dolly.position.y = firstDollyPos.y -
    //   ( controller.position.y  * Math.sin(controller.rotation.y) - firstControllerPos.y) * sf;
    // let theta = controller.rotation.y -  0.0 * Math.PI / 1.0;
    // let theta = dolly.rotation.y -  1.0 * Math.PI / 1.0;
    // let deltaX = controller.position.x - firstControllerPos.x;
    // let deltaZ = controller.position.z - firstControllerPos.z;
    // let r = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
    // console.log(`r=${r}`);
    // dolly.position.x = firstDollyPos.x - r * Math.cos(theta) * sf;
    // dolly.position.z = firstDollyPos.z - r * Math.sin(theta) * sf;
    // let deltaX = (controller.position.x - firstControllerPos.x) * Math.cos(theta) * sf * 1.0;
    // let deltaZ = (controller.position.z - firstControllerPos.z) * Math.sin(theta) * sf * 1.0;
    // let deltaX = (controller.position.x * Math.cos(theta) - firstControllerPos.x) * sf * 1.5;
    // let deltaZ = (controller.position.z * Math.sin(theta) - firstControllerPos.z) * sf * 1.5;

    // dolly.position.x = firstDollyPos.x - deltaX;
    // dolly.position.z = firstDollyPos.z - deltaZ;
      // (deltaX * Math.cos(theta) + deltaY * Math.sin(theta));


  }

  function updateDollyRot () {
    // dolly.rotation.x = (controller.rotation.x - firstControllerRot.x) * 1 + firstDollyRot.x;
    dolly.rotation.y = (controller.rotation.y - firstControllerRot.y) * 1 + firstDollyRot.y;
    // dolly.rotation.z = (controller.rotation.z - firstControllerRot.z) * 1 + firstDollyRot.z;
  }

  // function getDeltaDollyPos () {
  //   // var currentPosition = this.el.getAttribute('position');
  //   let currentDollyPos = {};
  //   currentDollyPos.x = dolly.position.x;
  //   currentDollyPos.y = dolly.position.y;
  //   currentDollyPos.z = dolly.position.z;
  //   // var currentPosition = dolly.position;
  //   if (Object.keys(prevDollyPos).length === 0) {
  //     // need to do a deep copy
  //     prevDollyPos = Object.assign({}, currentDollyPos);
  //   }
  //   console.log(`getDeltaDollyPos: currentDollyPos.x=${currentDollyPos.x},currentDollyPos.y=${currentDollyPos.y},currentDollyPos.z=${currentDollyPos.z}`);
  //   console.log(`getDeltaDollyPos: prevDollyPos.x=${prevDollyPos.x},prevDollyPos.y=${prevDollyPos.y},prevDollyPos.z=${prevDollyPos.z}`);
  //
  //   let currentControllerPos = {};
  //   currentControllerPos.x = controller.position.x + prevLockedControllerPos.x * 1;
  //   currentControllerPos.y = controller.position.y + prevLockedControllerPos.y * 1;
  //   currentControllerPos.z = controller.position.z + prevLockedControllerPos.z * 1;
  //   if (Object.keys(prevControllerPos).length === 0) {
  //     // need to do a deep copy
  //     prevControllerPos = Object.assign({}, currentControllerPos);
  //   }
  //
  //   let dollyDeltaX = currentDollyPos.x - prevDollyPos.x;
  //   let dollyDeltaY = currentDollyPos.y - prevDollyPos.y;
  //   let dollyDeltaZ = currentDollyPos.z - prevDollyPos.z;
  //   console.log(`getDeltaDollyPos: dollyDeltaX=${dollyDeltaX}, dollyDeltaY=${dollyDeltaY}, dollyDeltaZ=${dollyDeltaZ}`);
  //
  //   let controllerDeltaX = (currentControllerPos.x ) - prevControllerPos.x;
  //   let controllerDeltaY = (currentControllerPos.y ) - prevControllerPos.y;
  //   let controllerDeltaZ = (currentControllerPos.z ) - prevControllerPos.z;
  //   console.log(`getDeltaDollyPos: controllerDeltaX=${controllerDeltaX}, controllerDeltaY=${controllerDeltaY}, controllerDeltaZ=${controllerDeltaZ}`);
  //
  //   // var deltaPos = {
  //   //   x: dollyDeltaX + controllerDeltaX,
  //   //   y: dollyDeltaY + controllerDeltaY,
  //   //   z: dollyDeltaZ + controllerDeltaZ
  //   // };
  //   var deltaPos = {
  //     x:  controllerDeltaX,
  //     y:  controllerDeltaY,
  //     z:  controllerDeltaZ
  //   };
  //   prevDollyPos = Object.assign({}, currentDollyPos);
  //   prevControllerPos = Object.assign({}, currentControllerPos);
  //
  //   // this.deltaPosition = deltaPosition;
  //   return deltaPos;
  // };
  //
  // // function moveCameraByGrip(el) {
  // function moveDollyByGrip() {
  //   // let dollyEl = document.querySelector('#dolly') as AFrame.Entity;
  //   // let dollyObj = dolly;
  //   // let dollyObj = dollyEl.object3D;
  //
  //   // let controllerEl = document.querySelector('#oc-control-right');
  //   // let controllerEl = controller;
  //   // let controllerObj = controller.object3D;
  //   // let controllerObj = controller;
  //   // debugger;
  //   console.log(`moveDollyByGrip: cp.x=${controller.position.x},cp.y=${controller.position.y},cp.z=${controller.position.z}`);
  //   console.log(`moveDollyByGrip.pre: dp.x=${dolly.position.x},cp.y=${dolly.position.y},cp.z=${dolly.position.z}`);
  //
  //   let sf = 10;
  //   // dolly.position.x += controller.position.x * sf;
  //   // dolly.position.y += controller.position.y * sf;
  //   // dolly.position.z += controller.position.z * sf;
  //   dolly.position.x = controller.position.x * sf;
  //   dolly.position.y = controller.position.y * sf;
  //   dolly.position.z = controller.position.z * sf + 400;
  //
  //   console.log(`moveDollyByGrip.pst: dp.x=${dolly.position.x},cp.y=${dolly.position.y},cp.z=${dolly.position.z}`);
  // }


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

	//  Daddy, what happens when we die?

	controller.addEventListener( 'disconnected', function( event ){

		controller.parent.remove( controller )
	})
})
