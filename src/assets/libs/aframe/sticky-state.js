
AFRAME.registerComponent('sticky-state', {

  init: function () {
    console.log(`sticky-state.js: now in init`);
    // debugger;
    // console.log(`sticky-pos.init: pre: el.components.position.z=${this.el.components.position.z}`);
    // this.el.components.position.z = 12;
    // let base = document.querySelector('a-scene').systems['system-base'];
    let scene = this.el.sceneEl
    let base = scene.systems['system-base'];
    // let utils = scene.systems['system-utils'];
    // debugger;
    console.log(`base.data.appPrefix=${base.data.appPrefix}`);
    // let appPrefix = 'VRGAL';
    let appPrefix = ( (base && base.data.appPrefix) || 'VRGAL');
    // if (base) {
    //   appPrefix = base.data.appPrefix;
    // }
    // let lastDollyPos = JSON.parse(sessionStorage.getItem('VRGAL_lastDollyPos'));
    let lastDollyPos = JSON.parse(sessionStorage.getItem(`${appPrefix}_lastDollyPos`));

    if (lastDollyPos) {
      this.el.setAttribute('position', lastDollyPos);
    }

    let lastDollyRot = JSON.parse(sessionStorage.getItem(`${appPrefix}_lastDollyRot`));
    // debugger;

    // Rotation, while being saved, doesn't behave as I expect, so coment out for now
    // if (lastDollyRot) {
    //   this.el.setAttribute('rotation', lastDollyRot);
    // }

    // sessionStorage.setItem('lastPos', JSON.stringify({x: 0, y: 0, z:20}))
    // sessionStorage.getItem('VRGAL_lastPos')
    // let lastDollyPos = JSON.parse(sessionStorage.getItem('VRGAL_lastDollyPos'));
    // let scene = this.el.sceneEl;
    // scene.addEventListener('click', function (evt){
    //   console.log(`scene level click handler: entered`);
    //   // debugger;
    // })

    // debugger;
    // let rayCaster = document.querySelectorAll('a-entity[laser-controls]')[0];

    // rayCaster.addEventListener('raycaster-intersected', function(evt) {
    // rayCaster.addEventListener('raycaster-intersection', function(evt) {
    //   // console.log('sticky-pos: raycaster-intersected event triggered');
    //   console.log('sticky-pos: raycaster-intersection event triggered');
    //   // debugger;
    //
    // })


    // this.el.setAttribute('position', { z: 12});
    // console.log(`sticky-pos.init: post: el.components.position.z=${this.el.components.position.z}`);
//
    // this.el.addEventListener('play', function (evt) {
    //   console.log(`entity loaded`);
    //   console.log(`evt pos pre=${evt.target.components.position.z}`);
    //   // evt.target.components.position.z = 20;
    //   evt.target.setAttribute('position', { z: 20});
    //   // debugger;
    //   console.log(`evt pos post=${evt.target.components.position.z}`);
    //   // if (evt.detail.name === 'position') {
    //   //   console.log('Entity has moved from', evt.detail.oldData, 'to', evt.detail.newData, '!');
    //   // }
    // });
  }
});
