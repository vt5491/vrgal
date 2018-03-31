// log(`now in vrize_kbd`);

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var xSpeed = 5.1;
  var ySpeed = 5.1;
  var zSpeed = 5.1;

  var speed = 5.1;

  // let directionVector = new THREE.Vector3(0, 0, 0);
  let directionVector = new THREE.Vector3(1, 1, 1);
  let rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

  // rotationEuler.set(THREE.Math.degToRad(dolly.rotation.x), THREE.Math.degToRad(dolly.rotation.y), 0);
  rotationEuler.set(0, THREE.Math.degToRad(dolly.rotation.y), 0);
  directionVector.applyEuler(rotationEuler);

  directionVector.multiplyScalar(xSpeed);

  var deltaTheta = 5.0 * Math.PI / 180.0;

  switch( event.key) {
    // move
    case 'w':
      // dolly.position.z -= zSpeed;
      console.log(`vrize_kbd: w key pressed. dolly.position.z pre=${dolly.position.z}`);
      // dolly.position.z -= directionVector.z;
      dolly.translateZ(-speed);
      console.log(`vrize_kbd: dolly.position.z post=${dolly.position.z}`);
    break;
    case 's':
      // dolly.position.z += zSpeed;
      // dolly.position.z += directionVector.z;
      dolly.translateZ(+speed);
    break;
    case 'a':
      // dolly.position.x -= xSpeed;
      dolly.translateX(-speed);
    break;
    case 'd':
      // dolly.position.x += xSpeed;
      dolly.translateX(+speed);
    break;
    // up and down
    case 'p':
      dolly.position.y += ySpeed;
    break;
    case 'x':
      dolly.position.y += ySpeed;
    break;
    case 'n':
      dolly.position.y -= ySpeed;
    break;
    case 'z':
      dolly.position.y -= ySpeed;
    break;
    // rotate
    case 'q':
      dolly.rotation.y += deltaTheta;
    break;
    case 'e':
      dolly.rotation.y -= deltaTheta;
    break;
    // history
    case 'b':
    case 'v':
      // go back to prior scene
      window.history.back();
    break;
  }
  event.preventDefault();
  event.stopPropagation();
  return false;
};
