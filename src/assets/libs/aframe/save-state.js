AFRAME.registerComponent('save-state', {
  schema: {
    on: {default: 'click'},
  },
  init: function () {
    console.log(`save-state.init: entered`);
    this.saveState = this.saveState.bind(this)
  },

  play: function () {
    console.log(`save-state.play: entered`);
    this.updateEventListener();
  },

  updateEventListener: function () {
    var el = this.el;
    if (!el.isPlaying) { return; }
    this.removeEventListener();
    // debugger;
    // el.addEventListener(this.data.on, this.saveState);

    // el.getChildren()[0].addEventListener(this.data.on, this.saveState);
    // add an event listener to each getChildren
    let links = el.getChildren();

    for(let i=0; i < links.length; i++) {
      links[i].addEventListener(this.data.on, this.saveState);
    }
  },

  removeEventListener: function () {
    var on = this.data.on;
    if (!on) { return; }
    this.el.removeEventListener(on, this.saveState);
  },

  saveState: function () {
    console.log(`save-state: now in function saveState`);
    let scene = this.el.sceneEl;
    // let dolly =
    // debugger;
    let base = scene.systems['system-base'];
    let appPrefix = ( (base && base.data.appPrefix) || 'VRGAL');

    let dolly = scene.querySelector('#dolly');

    let dollyPos = dolly.getAttribute('position');
    sessionStorage.setItem(`${appPrefix}_lastDollyPos`, JSON.stringify(dollyPos));

    let dollyRot = dolly.getAttribute('rotation');
    sessionStorage.setItem(`${appPrefix}_lastDollyRot`, JSON.stringify(dollyRot));
  },
});
