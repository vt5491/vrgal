AFRAME.registerSystem('system-utils', {
  // Note: schemas don't seem to work for systems.  In spite of what the doc
  // says, you cannot refer to any system schema variables, either as
  // this.abc, or this.data.abc.  Ergo, just avoid using them.
  // Note: I also tried binding the event handler functions to 'this' context
  // (via a fat arrow), but still makes no difference.

  // schema: {
  //   // utilsSceneEl,
  //   abc: {type: 'int', default: 5},
  //   utilsSceneEl: {type: 'int'},
  // },
  init: function () {
    console.log(`system-utils.init: entered`);
    console.log(`system-utils: now enabling vttestevt listener`);
    window.addEventListener('vttestevt', this.onVtTestEvt);
    // console.log(`system-utils: prefix=${AFRAME.systems['system-base'].data.appPrefix}`);
    let scene = this.el.sceneEl;
    let base = scene.systems['system-base'];
    // this.utilsSceneEl = this.el.sceneEl;
    // this.abc = 7;
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
    window.addEventListener(appPrefixLc + '_' + 'create_view_source_btn', this.createViewSourceBtn);
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
  // createLink: (evt) => {
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
    let sceneEl = document.querySelector('a-scene');
    // let utils = scene.systems['system-utils'];
    // debugger;
    // console.log(`this.data.abc=${this.data.abc}, this.data.utilsSceneEl=${this.data.utilsSceneEl}`);
    // utils.addLinkHoverEvtListener(linkEl);

    // console.log(`system-utils: calling addLinkHoverEvtListener in new way`);
    // el.systems['system-utils'].addLinkHoverEvtListener(linkEl);
    sceneEl.systems['system-utils'].addLinkHoverEvtListener(linkEl);
    // this.sceneElement.systems['system-utils'].addLinkHoverEvtListener(linkEl);
    // debugger;
    // this.utilsSceneEl.systems['system-utils'].addLinkHoverEvtListener(linkEl);
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
      let sceneEl = document.querySelector('a-scene');
      sceneEl.systems['system-utils'].toggleVisibility(el);
      // let elVisibility = el.getAttribute("visible");
      // let newVisibility = !elVisibility;
      //
      // el.setAttribute("visible", String(newVisibility));
    });

    linkEl.addEventListener('mouseleave', (e) => {
      console.log(`SU:mouseleave activated`);
      // let el = document.querySelector('#img_0');
      let tgtId = e.target.id;
      let exampleRoot = tgtId.replace(/-link/, '');
      // debugger;
      let el = document.querySelector(`#${exampleRoot}-popup`);
      // toggle visibility
      let sceneEl = document.querySelector('a-scene');
      sceneEl.systems['system-utils'].toggleVisibility(el);
      // let elVisibility = el.getAttribute("visible");
      // let newVisibility = !elVisibility;
      //
      // el.setAttribute("visible", String(newVisibility));
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
    let pos = evt.detail.pos;
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

    // debugger;
    popupEl.setAttribute('src', src);
    popupEl.setAttribute('position', pos);
    popupEl.setAttribute('width', width);
    popupEl.setAttribute('height', height);
    popupEl.setAttribute('visible', visible);
    popupEl.id = id;

    // popupEl.appendChild(linkParentEl);
    linkParentEl.appendChild(popupEl);
  },
  toggleVisibility: function (el) {
      let elVisibility = el.getAttribute("visible");
      el.setAttribute("visible", String(!elVisibility));
      // let newVisibility = !elVisibility;
      //
      // el.setAttribute("visible", String(newVisibility));
      //
  },
  createViewSourceBtn: function (evt) {
    let src = evt.detail.src;
    let pos = evt.detail.pos;
    let exampleRoot = evt.detail.exampleRoot;
    let id = evt.detail.id;

    let linkParentEl = document.querySelector('#view-source-btns');
    let btnEl = document.createElement('a-circle');

    // add a hover button
    btnEl.setAttribute('position', pos);
    btnEl.setAttribute('radius', 0.25);
    btnEl.id = id;

    linkParentEl.appendChild(btnEl);

    // add 'view Source' text (toggled visible upon hover)
    let textEl = document.createElement('a-text');

    textEl.setAttribute('value', "View Source");
    textEl.setAttribute('position', {x: pos.x + 0.5, y: pos.y, z: pos.z});
    textEl.setAttribute('align', 'left');
    textEl.setAttribute('visible', 'false');
    textEl.id = `${exampleRoot}-viewSourceText`;

    linkParentEl.appendChild(textEl);

    // and add hover capability to show text upon button hover
    let sceneEl = document.querySelector('a-scene');
    sceneEl.systems['system-utils'].addViewSourceHoverListener(btnEl);

    // and emit a done event so ng2 can do any processing
    // sceneEl.dispatchEvent(new CustomEvent(
    //   'vrgal_view_source_btn_added',
    // { detail: {'exampleRoot': exampleRoot} }));
    //
    sceneEl.systems['system-utils'].addViewSourceClickHandler(btnEl, exampleRoot);
  },
  addViewSourceHoverListener: function(linkEl) {
    console.log(`SU.addViewSourceHoverListener: entered`);

    linkEl.addEventListener('mouseenter', (e) => {
      console.log(`SU.addViewSourceHoverListener:mouseenter activated`);
      // debugger;
      let tgtId = e.target.id;
      let exampleRoot = tgtId.replace(/-viewSourceBtn/, '')
      // let el = document.querySelector('#img_0');
      let el = document.querySelector(`#${exampleRoot}-viewSourceText`);
      // let el = e.target;
      // toggle visibility
      let sceneEl = document.querySelector('a-scene');
      sceneEl.systems['system-utils'].toggleVisibility(el);
      // let elVisibility = el.getAttribute("visible");
      // let newVisibility = !elVisibility;
      //
      // el.setAttribute("visible", String(newVisibility));
    });

    linkEl.addEventListener('mouseleave', (e) => {
      console.log(`SU.addViewSourceHoverListener:mouseleave activated`);
      // let el = document.querySelector('#img_0');
      let tgtId = e.target.id;
      let exampleRoot = tgtId.replace(/-viewSourceBtn/, '');
      // // debugger;
      let el = document.querySelector(`#${exampleRoot}-viewSourceText`);
      // let el = e.target;
      // toggle visibility
      let sceneEl = document.querySelector('a-scene');
      sceneEl.systems['system-utils'].toggleVisibility(el);
      // let elVisibility = el.getAttribute("visible");
      // let newVisibility = !elVisibility;
      //
      // el.setAttribute("visible", String(newVisibility));
    })
  },
  addViewSourceClickHandler: function(el, exampleRoot) {
    console.log(`addViewSourceClickHandler: entered`);
    el.addEventListener('click', (evt) => {
      // console.log(`system-utils: click for exampleRoot=${evt.detail.exampleRoot}`);
      console.log(`system-utils: click for exampleRoot=${exampleRoot}`);
      let sceneEl = document.querySelector('a-scene');
      // and emit a done event so ng2 can do any processing
      sceneEl.dispatchEvent(new CustomEvent(
        'vrgal_view_source_btn_clicked',
        { detail: {
          'exampleRoot': exampleRoot,
          'btnEl' : el,
        }
        }));
      /*
      let base = sceneEl.systems['system-base'];
      // debugger;
      // let fp = `${base.examplesPath}/${base.liftPrefix}${exampleRoot}.html`;})
      // let fp = 'assets/threejs-env/examples/vrize-webgl_mirror.html';
      let fp = `assets/threejs-env/examples/${base.data.liftPrefix}${exampleRoot}.html`;
      console.log(`addViewSourceClickHandler: fp=${fp}`);
      let callback = (rsp) => {
        console.log(`callback: rsp=${rsp}`);
      }
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
        }
      }
      xmlHttp.open("GET", fp, true); // true for asynchronous
      xmlHttp.send(null);
      */
    })
  }
  });
