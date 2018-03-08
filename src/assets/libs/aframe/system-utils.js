AFRAME.registerSystem('system-utils', {
  init: function () {
    console.log(`system-utils.init: entered`);
    console.log(`system-utils: now enabling vttestevt listener`);
    window.addEventListener('vttestevt', this.onVtTestEvt);
    // console.log(`system-utils: prefix=${AFRAME.systems['system-base'].data.appPrefix}`);
    let scene = this.el.sceneEl
    let base = scene.systems['system-base'];
    //TODO: update base to have this as a convenience method
    // let appPrefixLc = String.prototype.toLocaleLowerCase(base.data.appPrefix);
    let appPrefixLc = 'vrgal';
    console.log(`system-utils:prefix=${appPrefixLc}`);
    // window.addEventListener(appPrefixLc + 'addexample', this.onAddExample);
    let sceneEl = this.el
    sceneEl.addEventListener(appPrefixLc + 'addexample', this.onAddExample);
    window.addEventListener(appPrefixLc + '_' + 'createlink', this.createLink);
  },
  onVtTestEvt: function () {
    console.log(`system-utils.onVtTestEvt: now in vttestevt handler`);
  },
  onAddExample: function () {
    console.log(`system-utils.onAddExample: now in addexample handler`);
    let linkParentEl = document.querySelector('#links');
    let linkEl = document.createElement('a-link');
    // linkEl.setAttribute('geometry', {
    //   primitive: 'box',
    //   height: 3,
    //   width: 1
    // });
    linkEl.setAttribute('position', {x: -3, y: 0, z: 0});
    linkEl.setAttribute('title', 'Dynamic Link');
    linkEl.setAttribute('href', "assets/threejs-env/examples/vrize_webgl_geometry_cube.html");
    linkParentEl.appendChild(linkEl);
  },
  // This is essential 'onAddExample' with a different name
  // createLink: function (url, pos, title) {
  createLink: function (evt) {
    // console.log(`system-utils.createLink: url=${url}, pos=${pos}, title=${title}`)
    // console.log(`system-utils.createLink: name=${evt.target.vrgal_createlink_name}`)
    console.log(`system-utils.createLink: entered, evt.detail.title=${evt.detail.title}`);
    // let href = evt.target['vrgal_createlink'].href
    // let pos = evt.target['vrgal_createlink'].pos
    // let title = evt.target['vrgal_createlink'].title
    let href = evt.detail.href
    let pos = evt.detail.pos
    let title = evt.detail.title
    console.log(`system-utils.createLink: href=${href}`)

    let linkParentEl = document.querySelector('#links');
    let linkEl = document.createElement('a-link');
    //
    linkEl.setAttribute('position', pos);
    linkEl.setAttribute('title', title);
    // linkEl.setAttribute('position', {x: -3, y: 0, z: 0});
    // linkEl.setAttribute('title', 'Dynamic Link');
    linkEl.setAttribute('href', href);
    //
    linkParentEl.appendChild(linkEl);
  }
});
