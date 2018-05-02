// Save the state of selected scene components between link transferrals.
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
      console.log(`sticky-state: lastDollyPos.z=${lastDollyPos.z}`);
      this.el.setAttribute('position', lastDollyPos);
    }

    let lastDollyRot = JSON.parse(sessionStorage.getItem(`${appPrefix}_lastDollyRot`));

    // Rotation, while being saved, doesn't behave as I expect, so coment out for now
    // if (lastDollyRot) {
    //   // this.el.setAttribute('rotation', lastDollyRot);
    //   console.log(`sticky-state.init: lastDollyRot.y=${lastDollyRot.y}`);
    //   // this.el.object3D.rotation = lastDollyRot;
    //   this.el.object3D.rotation.x = lastDollyRot.x;
    //   this.el.object3D.rotation.y = lastDollyRot.y;
    //   this.el.object3D.rotation.z = lastDollyRot.z;
    // }
    // debugger;

    // sessionStorage.setItem('lastPos', JSON.stringify({x: 0, y: 0, z:20}))
    // sessionStorage.getItem('VRGAL_lastPos')
    // let lastDollyPos = JSON.parse(sessionStorage.getItem('VRGAL_lastDollyPos'));
    // let scene = this.el.sceneEl;
    // scene.addEventListener('click', function (evt){
    //   console.log(`scene level click handler: entered`);
    //   // debugger;
    // })
    // this.el.addEventListener('play', (evt) => {
    //   console.log(`sticky-state.play: event handler driven`);
    //   console.log(`sticky-state.play: currentTarget.rotation.y=${evt.currentTarget.object3D.rotation.y}`);
    //   // debugger;
    // })
    //
    // this.el.addEventListener('componentchanged', (evt) => {
    //   console.log(`sticky-state.componentchanged: event handler driven`);
    //   console.log(`sticky-state.componentchanged: currentTarget.rotation.y=${evt.currentTarget.object3D.rotation.y}`);
    //   // debugger;
    // })

    // While position is not reset upon component initialization (dolly init)
    // rotation is.  Thus we have to set rotation to our saved state upon
    // component initialization.
    this.el.addEventListener('componentinitialized', (evt) => {
      console.log(`sticky-state.componentinitialized: event handler driven`);
      console.log(`sticky-state.componentinitialized: currentTarget.rotation.y=${evt.currentTarget.object3D.rotation.y}`);
      console.log(`sticky-state.componentinitialized: lastDollyRot.y=${lastDollyRot.y}`);
      // debugger;
      if (lastDollyRot) {
        evt.currentTarget.object3D.rotation.x = lastDollyRot.x;
        evt.currentTarget.object3D.rotation.y = lastDollyRot.y;
        evt.currentTarget.object3D.rotation.z = lastDollyRot.z;
      }
    })
  }
});
