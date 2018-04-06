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
    window.addEventListener(appPrefixLc + '_' + 'create_img_asset', this.createImgAsset);
    window.addEventListener(appPrefixLc + '_' + 'create_popup_img', this.createExamplePopupImg);
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
  // We call createLink at the aframe level (as opposed to the ng2 level) because
  // a-frame is a little better fit for doing DOM maniuplation (true?).
  // Actually, I am doing the event listener DOM stuff at the ng2 level, not here.
  // no..changed my mind again.  I might be doing it at the a-frame level
  // because it's a timing thing ..e.g you have to make sure you do this when a-frame
  // is ready for it (?)
  createLink: function (evt) {
    // console.log(`system-utils.createLink: url=${url}, pos=${pos}, title=${title}`)
    // console.log(`system-utils.createLink: name=${evt.target.vrgal_createlink_name}`)
    console.log(`system-utils.createLink: entered, evt.detail.title=${evt.detail.title}`);
    // let href = evt.target['vrgal_createlink'].href
    // let pos = evt.target['vrgal_createlink'].pos
    // let title = evt.target['vrgal_createlink'].title
    let href = evt.detail.href;
    let pos = evt.detail.pos;
    let title = evt.detail.title;
    let id = evt.detail.id;
    let image = evt.detail.image;

    console.log(`system-utils.createLink: href=${href}`)

    let linkParentEl = document.querySelector('#links');
    let linkEl = document.createElement('a-link');
    //
    linkEl.setAttribute('position', pos);
    linkEl.setAttribute('title', title);
    // linkEl.setAttribute('position', {x: -3, y: 0, z: 0});
    // linkEl.setAttribute('title', 'Dynamic Link');
    linkEl.setAttribute('href', href);
    linkEl.setAttribute('image', image);
    linkEl.id = id;
    //
    linkParentEl.appendChild(linkEl);

    // addLinkHoverEvtListener(linkEl);
    // this.addLinkHoverEvtListener(linkEl);
    // calling a helper method in an afame system cannot be done using 'this'.
    let scene = document.querySelector('a-scene');
    let utils = scene.systems['system-utils'];
    // debugger;
    utils.addLinkHoverEvtListener(linkEl);
  },

  // add a 'mouseenter' listener so we can show a popup screen print of what
  // the example looks like.
  // helper method
  addLinkHoverEvtListener: function(linkEl) {
    console.log(`SU.addLinkHoverEvtListener: entered`);

    linkEl.addEventListener('mouseenter', (e) => {
      console.log(`SU:mouseenter activated`);
      // debugger;
      let tgtId = e.target.id;
      let exampleRoot = tgtId.replace(/-link$/, '')
      // let el = document.querySelector('#img_0');
      let el = document.querySelector(`#${exampleRoot}-popup`);
      // toggle visibility
      let elVisibility = el.getAttribute("visible");
      let newVisibility = !elVisibility;

      el.setAttribute("visible", String(newVisibility));
    });

    linkEl.addEventListener('mouseleave', (e) => {
      console.log(`SU:mouseleave activated`);
      // let el = document.querySelector('#img_0');
      let tgtId = e.target.id;
      let exampleRoot = tgtId.replace(/-link$/, '');
      // debugger;
      let el = document.querySelector(`#${exampleRoot}-popup`);
      // toggle visibility
      let elVisibility = el.getAttribute("visible");
      let newVisibility = !elVisibility;

      el.setAttribute("visible", String(newVisibility));
    })
  },
  createImgAsset: function (evt) {
    let src = evt.detail.src;
    let id = evt.detail.id;

    let assetsParentEl = document.querySelector('a-assets');
    let imgAssetEl = document.createElement('img');

    imgAssetEl.setAttribute('src', src);
    imgAssetEl.id = id;

    assetsParentEl.appendChild(imgAssetEl);
  },
  createExamplePopupImg: function (evt) {
    let src = evt.detail.src;
    let pos = evt.detail.id;
    let width = evt.detail.width;
    let height = evt.detail.height;
    let visible = evt.detail.visible;
    let title = evt.detail.title;
    let linkId = evt.detail.linkId;
    let id = evt.detail.id;

    // let linkParentEl = document.getElementById(linkId);
    // let linkParentEl = document.querySelector('a-scene');
    // let linkParentEl = document.querySelector('a-scene');
    let linkParentEl = document.querySelector('#popups');
    let popupEl = document.createElement('a-image');

    popupEl.setAttribute('src', src);
    popupEl.setAttribute('position', pos);
    popupEl.setAttribute('width', width);
    popupEl.setAttribute('height', height);
    popupEl.setAttribute('visible', visible);
    popupEl.id = id;

    // popupEl.appendChild(linkParentEl);
    linkParentEl.appendChild(popupEl);
  }

});
