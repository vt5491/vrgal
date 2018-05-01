/* global AFRAME */

/**
* Handles events coming from the hand-controls.
* Determines if the entity is grabbed or released.
* Updates its position to move along the controller.
*/
AFRAME.registerComponent('grab', {
  init: function () {
    this.GRABBED_STATE = 'grabbed';
    //vt add
    console.log(`grab-vt.init entered`);
    this.grabbing = false;
    this.triggering = false;
    this.pointing = false;
    //vt end
    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);
    //vt add
    this.onGripDown = this.onGripDown.bind(this);
    this.onGripUp = this.onGripUp.bind(this);
    this.previousPosition = {};
    this.previousRotation = {};

    this.yAxis = new THREE.Vector3(0,1,0);

    // this.previousPosition.x = this.el.getAttribute('position').x;
    // this.previousPosition.y = this.el.getAttribute('position').y;
    // this.previousPosition.z = this.el.getAttribute('position').z;
    //vt end
  },

  play: function () {
    var el = this.el;
    el.addEventListener('hit', this.onHit);
    el.addEventListener('gripclose', this.onGripClose);
    el.addEventListener('gripopen', this.onGripOpen);
    //vt add
    //el.addEventListener('gripdown', this.onGripDown, {once: false});
    //el.addEventListener('gripdown', this.onGripDown, {once: true});
    el.addEventListener('gripdown', this.onGripDown);
    el.addEventListener('gripup', this.onGripUp);
    // el.addEventListener('triggerdown', this.onTriggerDown);
    // el.addEventListener('triggerup', this.onTriggerClose);
    //vt end
    // el.addEventListener('thumbup', this.onGripClose);
    // el.addEventListener('thumbdown', this.onGripOpen);
    //vt add
    el.addEventListener('pointup', this.onPointUp);
    el.addEventListener('pointdown', this.onPointDown);
    //vt end
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('hit', this.onHit);
    el.removeEventListener('gripclose', this.onGripClose);
    el.removeEventListener('gripopen', this.onGripOpen);
    //vt add
    // el.removeEventListener('triggerdown', this.onTriggerDown);
    // el.removeEventListener('triggerup', this.onTriggerClose);
    el.removeEventListener('gripdown', this.onGripDown);
    el.removeEventListener('gripup', this.onGripUp);
    //vt end
    // el.removeEventListener('thumbup', this.onGripClose);
    // el.removeEventListener('thumbdown', this.onGripOpen);
    //vt add
    el.removeEventListener('pointup', this.onPointUp);
    el.removeEventListener('pointdown', this.onPointDown);
    //vt end
  },

  onGripClose: function (evt) {
    // console.log(`now in onGripClose`);
    this.grabbing = true;
    //vt add
    this.gripping = false;
    //vt end
    // delete this.previousPosition;
    this.previousPosition = {};
  },

  onGripOpen: function (evt) {
    // console.log(`now in onGripOpen`);
    var hitEl = this.hitEl;
    this.grabbing = false;
    if (!hitEl) { return; }
    hitEl.removeState(this.GRABBED_STATE);
    this.hitEl = undefined;
  },

  //vt add
  onTriggerDown: function (evt) {
    console.log(`now in onTriggerDown`);
    this.triggering = true;
    // delete this.previousPosition;
    this.previousPosition = {};
  },

  onTriggerUp: function (evt) {
    this.triggering = false;
    // delete this.previousPosition;
  },

  onGripDown: function (evt) {
    // console.log(`now in onGripDown`);
    this.gripping = true;
    // delete this.previousRotation;
    this.previousRotation = {};
  },

  onGripUp: function (evt) {
    this.gripping = false;
    // delete this.previousPosition;
  },

  onPointUp: function (evt) {
    console.log(`grabVt.onPointUp: entered`);
    this.pointing = true;
    // this.gripping = false;
    // delete this.previousPosition;
  },

  onPointDown: function (evt) {
    console.log(`grabVt.onPointDown: entered`);
    this.pointing = false;
    // this.gripping = false;
    // delete this.previousPosition;
  },
  //vt end

  onHit: function (evt) {
    var hitEl = evt.detail.el;
    // If the element is already grabbed (it could be grabbed by another controller).
    // If the hand is not grabbing the element does not stick.
    // If we're already grabbing something you can't grab again.
    if (!hitEl || hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) { return; }
    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;
  },

  tick: function () {
    let dollyEl = document.querySelector('#dolly');
    // // console.log(`dollyEl.rot.y pre=${dollyEl.getAttribute('rotation').y}`);
    // let tmpRot = dollyEl.getAttribute('rotation');
    // // let tmpRot = Object.assign({}, dollyEl.getAttribute('rotation'));
    // tmpRot.y += 1.0;
    // dollyEl.setAttribute('rotation', tmpRot);
    // console.log(`dollyEl.rot.y post=${dollyEl.getAttribute('rotation').y}`);

    // let tmpPos = dollyEl.getAttribute('position');
    // // let tmpRot = Object.assign({}, dollyEl.getAttribute('rotation'));
    // tmpPos.y += 0.1;
    // dollyEl.setAttribute('position', tmpRot);
    // console.log(`dollyEl.post.y post=${dollyEl.getAttribute('position').y}`);
    if ((this.gripping && !this.grabbing) || this.pointing) {
      // let cameraEl = document.querySelector('#camera');
      // let cameraObj = cameraEl.object3D;
      var rotation;

      this.updateDeltaRot();
      // console.log(`grab-vt.tick: deltaRotation.y=${this.deltaRotation.y}`);
      let pullLeverage = 0.75;
      // let pullLeverage = 30.0;
      // let dollyObj = dollyEl.object3D;
      rotation = dollyEl.getAttribute('rotation');
      // rotation = cameraEl.getAttribute('rotation');
      dollyEl.setAttribute('rotation', {
        y: rotation.y - this.deltaRotation.y * pullLeverage
        // y: this.deltaRotation.y * pullLeverage,
      //   // z: rotation.z - this.deltaRotation.z * pullLeverage
      });
      // console.log(`grab-vt.tick: dollyEl.rotation.y=${dollyEl.getAttribute('rotation')}`);
      // cameraObj.rotation.y += this.deltaRotation.y * pullLeverage;
    }
    else if (this.grabbing) {
    // if (this.triggering) {
      this.updateDollyPos();
    /*
      var position;

      this.updateDeltaPos();
      let pullLeverage = 30.0;
      // take into consideration the rotaion angle so we move in a relative
      // and not absolute fashion.
      let deltaVec = new THREE.Vector3(this.deltaPosition.x, this.deltaPosition.y, this.deltaPosition.z);
      // console.log(`grab-vt.tick: now applying deltaVect`);
      deltaVec.applyAxisAngle(this.yAxis, dollyEl.getAttribute('rotation').y + 0 * Math.PI / 2.0);
      this.deltaPosition.x = deltaVec.x;
      this.deltaPosition.y = deltaVec.y;
      this.deltaPosition.z = deltaVec.z;
      // let dollyObj = dollyEl.object3D;
      position = dollyEl.getAttribute('position');
      // console.log(`grab.js.tick: pos.x old=${position.x}`);
      dollyEl.setAttribute('position', {
        x: position.x - this.deltaPosition.x * pullLeverage,
        y: position.y - this.deltaPosition.y * pullLeverage,
        z: position.z - this.deltaPosition.z * pullLeverage
      });
      */
      // position = dollyEl.getAttribute('position');
      // let rotPos = new THREE.Vector3(position.x, position.y, position.z);
      // rotPos.applyAxisAngle(this.yAxis, dollyEl.getAttribute('rotation').y);
      // position.x = rotPos.x;
      // position.y = rotPos.y;
      // position.z = rotPos.z;
      // console.log(`grab.js.tick: pos.x new=${dollyEl.getAttribute('position').x}`);
    }
  },

  updateDeltaPos: function () {
    var currentPosition = this.el.getAttribute('position');
    if (Object.keys(this.previousPosition).length === 0) {
      // need to do a deep copy
      this.previousPosition = Object.assign({}, currentPosition);
    }
    // else{
    //   console.log(`previousPosition not set...setting`);
    //   // previousPosition = currentPosition;
    //   this.previousPosition['x'] = currentPosition.x;
    //   this.previousPosition['y'] = currentPosition.y;
    //   this.previousPosition['z'] = currentPosition.z;
    // }
    var deltaPosition = {
      x: currentPosition.x - this.previousPosition.x,
      y: currentPosition.y - this.previousPosition.y,
      z: currentPosition.z - this.previousPosition.z
    };
    // console.log(`grab.js.updateDelta: deltaPosition.x=${deltaPosition.x}`);
    // this.previousPosition = currentPosition;
    // this.previousPosition['x'] = currentPosition.x;
    // this.previousPosition['y'] = currentPosition.y;
    // this.previousPosition['z'] = currentPosition.z;
    this.previousPosition = Object.assign({}, currentPosition);

    this.deltaPosition = deltaPosition;
  },

  updateDollyPos: function () {
    let yAxis = new THREE.Vector3(0,1,0);
    let deltaVec = new THREE.Vector3();
    // var controller = this.el.getAttribute('position').object3D;
    var controller = this.el.object3D;
    let sf = 30.0;
    let dollyEl = document.querySelector('#dolly');
    let dolly = dollyEl.object3D;
    if (Object.keys(this.previousPosition).length === 0) {
      // need to do a deep copy
      this.previousPosition = Object.assign({}, controller.position);
    }
    deltaVec.x = (controller.position.x - this.previousPosition.x) * sf
    deltaVec.y = (controller.position.y - this.previousPosition.y) * sf
    deltaVec.z = (controller.position.z - this.previousPosition.z) * sf
    deltaVec.applyAxisAngle(yAxis, dolly.rotation.y);
    // dolly.position.x = dolly.position.x - deltaVec.x;
    // dolly.position.y = dolly.position.y - deltaVec.y;
    // dolly.position.z = dolly.position.z - deltaVec.z;
    // dolly.position.x -= deltaVec.x;
    // dolly.position.y -= deltaVec.y;
    // dolly.position.z -= deltaVec.z;
    // debugger;
    let dollyPos = dollyEl.getAttribute('position');
    dollyPos.x -= deltaVec.x;
    dollyPos.y -= deltaVec.y;
    dollyPos.z -= deltaVec.z;

    this.previousPosition = Object.assign({}, controller.position);
  },


  //vt add
  updateDeltaRot: function () {
    var currentRotation = this.el.getAttribute('rotation');
    if (Object.keys(this.previousRotation).length === 0) {
      // need to do a deep copy
      this.previousRotation = Object.assign({}, currentRotation);
    }
    // var previousRotation = this.previousRotation || currentRotation;
    var deltaRotation = {
      x: currentRotation.x - this.previousRotation.x,
      y: currentRotation.y - this.previousRotation.y,
      z: currentRotation.z - this.previousRotation.z
    };
    // this.previousRotation = currentRotation;
    this.previousRotation = Object.assign({}, currentRotation);
    this.deltaRotation = deltaRotation;
  }
  //vt end
})
;
