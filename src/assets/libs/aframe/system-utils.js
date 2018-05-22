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
    // window.addEventListener(appPrefixLc + '_' + 'add_link_hover', this.addLinkHoverEvtListener);
  },
  onVtTestEvt: function () {
    console.log(`system-utils.onVtTestEvt: now in vttestevt handler`);
  },
  // Note: I don't think this is actually being driven anywhere. Ok to delete?
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
  // This is essentially 'onAddExample' with a different name
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
    let example_id = evt.detail.example_id;

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

    // add a click event listener so we can increment the clicks count for the examples
    console.log(`SystemUtils.onAddExample: now adding click listener`);
    // linkEl.addEventListener('click', this.inc_clicks);
    // sceneEl.addEventListener('click', this.inc_clicks);
    // sceneEl.addEventListener('mouseenter', this.inc_clicks);
    // linkEl.addEventListener('mouseenter', (e) => {console.log(`hi from mousketeer`)});
    // linkEl.addEventListener('mouseenter', sceneEl.systems['system-utils'].inc_clicks);
    // linkEl.addEventListener('mouseenter', sceneEl.systems['system-utils'].inc_clicks, {'abc': 7});
    linkEl.addEventListener('click', (evt) => {
      let info = {};
      info.example_id = example_id;
      sceneEl.systems['system-utils'].inc_clicks(evt, info);
    // linkEl.addEventListener(type, listener, this, ev, options)
    })
  },

  //defunct: moved to ng examples.service
  // add a 'mouseenter' listener so we can show a popup screen print of what
  // the example looks like.
  // helper method
  addLinkHoverEvtListener: function(linkEl) {
    // console.log(`SU.addLinkHoverEvtListener: entered`);

    linkEl.addEventListener('mouseenter', (e) => {
      // console.log(`SU:mouseenter activated`);
      // debugger;
      let tgtId = e.target.id;
      let exampleRoot = tgtId.replace(/-link$/, '')
      // let el = document.querySelector('#img_0');
      // debugger;
      let el = document.querySelector(`#${exampleRoot}-popup`);

      if (el) {
        // toggle visibility
        let sceneEl = document.querySelector('a-scene');
        sceneEl.systems['system-utils'].toggleVisibility(el);
      }
    });

    linkEl.addEventListener('mouseleave', (e) => {
      // console.log(`SU:mouseleave activated`);
      // let el = document.querySelector('#img_0');
      let tgtId = e.target.id;
      let exampleRoot = tgtId.replace(/-link/, '');
      // debugger;
      let el = document.querySelector(`#${exampleRoot}-popup`);
      // toggle visibility
      if (el) {
        let sceneEl = document.querySelector('a-scene');
        sceneEl.systems['system-utils'].toggleVisibility(el);
      }
    })
  },
  inc_clicks: function (evt, info) {
    // debugger;
    // console.log(`SystemUtils.inc_clicks: evt=${evt}`);
    // console.log(`SystemUtils.inc_clicks: evt.target=${evt.target}`);
    console.log(`SystemUtils.inc_clicks: info.example_id=${info.example_id}`);
    let server = 'http://192.168.1.147:3000';
    xhr = new XMLHttpRequest();

    // xhr.open('PUT', 'myservice/username?id=some-unique-id'); Note: the
    // 'false' makes it synchronous.  We have to do is synchronously otherwise
    // the 'onload' event is not driven becuase the example web page has already
    // assumed control, and the onload event handler is no longer there.
    // xhr.open('PUT',
    // `${server}/examples/${info.example_id}/stats/increment.json`, false);
    // Note: I now have to set this to true otherwise I get error: Synchronous
    // XMLHttpRequest on the main thread is deprecated because of its
    // detrimental effects to the end user’s experience.^ and then a network
    // error and the link doens't work TODO: figure out a way to update stats
    // asynchronously (?) maybe turn the onload into a service worker, not tied
    // to client?
    xhr.open('PUT', `${server}/examples/${info.example_id}/stats/increment.json`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      console.log(`onLoad: xhr.status=${xhr.status}`);
      // if (xhr.status === 200 && xhr.responseText !== newName) {
      //   alert('Something went wrong.  Name is now ' + xhr.responseText);
      // }
      // else if (xhr.status !== 200) {
      //   alert('Request failed.  Returned status of ' + xhr.status);
      // }
    };
    // xhr.send(encodeURI('name=' + newName));
    // Note: what's in send is the put body.
    xhr.send(JSON.stringify({'clicks' : null}));
  },
  createImgAsset: function (evt) {
    let src = evt.detail.src;
    // let defaultSrc = src.replace(/[^/]*$/, "webgl_mirror_thumb.png")
    // let onErrorSrc = `this.src='${defaultSrc}'`;
    // let onErrorSrc = `console.log('onerror: hi2');this.src=#cokeThumb`;
    let id = evt.detail.id;

    let assetsParentEl = document.querySelector('a-assets');
    let imgAssetEl = document.createElement('img');

    // imgAssetEl.addEventListener('error', e => {console.log('error mofo');this.src='#cokeThumb'});
    // imgAssetEl.addEventListener('error', e => {console.log('error mofo');this.src='assets/img/coke-label.jpg'});
    // imgAssetEl.addEventListener('error', function(e){console.log('error mofo');this.src='assets/img/coke-label.jpg'});
    imgAssetEl.addEventListener('error', function(e){this.src='assets/img/coke-label.jpg'});
    // imgAssetEl.addEventListener('error', function(e){this.src='#cokeThumb'});

    imgAssetEl.setAttribute('src', src);
    // imgAssetEl.setAttribute('onerror', defaultSrc);
    // imgAssetEl.setAttribute('onerror', onErrorSrc);
    // imgAssetEl.setAttribute('onprogress', onErrorSrc);
    imgAssetEl.id = id;

    assetsParentEl.appendChild(imgAssetEl);
  },
  createExamplePopupImg: function (evt) {
    let src = evt.detail.src;
    // let defaultSrc = src.replace(/[^/]*$/, "webgl_mirror_thumb.png")
    // let defaultSrc = "assets/img/thumbs/webgl_mirror_thumb.png";
    // let defaultSrc = "/assets/img/thumbs/webgl_mirror_thumb.png";
    // let onErrorSrc = "this.src=#cokeThumb";
    // let onErrorSrc = "this.onerror=null;console.log('hi from onerror');this.src='#cokeThumb'";
    // let onErrorSrc = "this.src='/assets/img/thumbs/webgl_mirror_thumb.png'";
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
    // popupEl.setAttribute('onerror', onErrorSrc);
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
    let exampleId = evt.detail.exampleId;

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
    sceneEl.systems['system-utils'].addViewSourceClickHandler(btnEl, exampleRoot, exampleId);
  },
  addViewSourceHoverListener: function(linkEl) {
    // console.log(`SU.addViewSourceHoverListener: entered`);

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
  addViewSourceClickHandler: function(el, exampleRoot, exampleId) {
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
          'exampleId': exampleId,
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
