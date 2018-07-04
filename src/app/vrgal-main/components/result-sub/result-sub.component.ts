import { Component, OnInit, Renderer2, } from '@angular/core';
import { CoreBaseService } from '../../../core/services/core-base.service';
import { CoreUtilsService } from '../../../core/services/core-utils.service';
import { ExamplesService } from '../../../core/services/examples.service';
import { NgRedux } from '@angular-redux/store';
import {IAppState} from "../../../store/store";
import { CounterActions, RuntimeActions } from '../../../store/app.actions';

import * as THREE from "three";

@Component({
  selector: 'app-result-sub',
  templateUrl: './result-sub.component.html',
  styleUrls: ['./result-sub.component.css']
})
export class ResultSubComponent implements OnInit {

  exampleResults : [any];
  sceneEl : Element;

  constructor(
    private base: CoreBaseService,
    private utils: CoreUtilsService,
    private examples: ExamplesService,
    private ngRedux: NgRedux<IAppState>,
    private runtimeActions: RuntimeActions,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  queryGenResult(params) {
    console.log(`ResultSubComponent.queryGenResult: now processing query`)

    // let result$ = this.examples.queryCurated();
    // result$.subscribe(
    //   data => {this.addResults((data as any).examples)},
    //   err => {console.log(`err=${err}`);
    // })
    let lastQueryType, lastQueryData;
    if (this.ngRedux.getState().runtime.lastQuery) {
      lastQueryType = this.ngRedux.getState().runtime.lastQuery.queryType;
      lastQueryData = this.ngRedux.getState().runtime.lastQuery.data;
    }
    // debugger;
    console.log(`ResultSubComponent.queryGenResult: lastQueryType=${lastQueryType}`);
    console.log(`ResultSubComponent.queryGenResult: lastQueryData=${lastQueryData}`);

    // pull from ngRedux
    if (lastQueryType && params.queryType === lastQueryType) {
      // debugger;
      this.addResults(lastQueryData);
      // console.log(`ResultSubComponent.queryGenResult: lastQueryData=${lastQueryData}`);
      // switch(lastQueryType) {
      //   case "curated" : {
      //     this.addResults(lastData);
      //     break;
      //   }
      //   case "all_lifted" : {
      //     this.addResults(lastData);
      //     break;
      //   }
      // }
    }
    // assume it's a new query, so get the raw data.
    else {
      switch (params.queryType) {
        case "curated" : {
          let result$ = this.examples.queryCurated();


          result$.subscribe(
            data => {
              let lastQuery : any = {};
              lastQuery.queryType = 'curated';
              lastQuery.data = (data as any).examples;
              this.ngRedux.dispatch(this.runtimeActions.setLastQuery(lastQuery));
              this.utils.saveAppState(this.ngRedux);
              // debugger;

              this.addResults((data as any).examples)
            },
            err => {console.log(`err=${err}`);
          })

          break;
        };
        case "all_lifted" : {
          let result$ = this.examples.queryAllLifted();
          result$.subscribe(
            data => {
              let lastQuery : any = {};
              lastQuery.queryType = 'all_lifted';
              lastQuery.data = (data as any).examples;
              this.ngRedux.dispatch(this.runtimeActions.setLastQuery(lastQuery));

              this.addResults((data as any).examples)
            },
            err => {console.log(`err=${err}`);
          })
          break;
        }
      }
    }
  }

  // Clear out any screen artifacts from prior queries
  clearResults() {
    let linksEl = document.getElementById("app-result-sub-links");
    while (linksEl.firstChild) {
      linksEl.removeChild(linksEl.firstChild);
    }

    let popupsEl = document.getElementById("popups");
    while (popupsEl.firstChild) {
      popupsEl.removeChild(popupsEl.firstChild);
    }

    let sourceBtnsEl = document.getElementById("view-source-btns");
    while (sourceBtnsEl.firstChild) {
      sourceBtnsEl.removeChild(sourceBtnsEl.firstChild);
    }
  }

  addResults(results) {
    // debugger;
    this.sceneEl = document.querySelector('a-scene');
    this.clearResults();

    console.log(`ResultSubComponent.addResults: results.length=${results.length}`);
    this.exampleResults = results;
    this.addLinks();
    this.addImgAssets();
    this.addExamplePopupImgs();
    this.addViewSourceBtns();
    this.addViewSrcClickHandler();

    // and finally, make ourselves visible
    this.utils.toggleSubScenes();
  }

  addLinks() {
    let grid : any = this.utils.gridicize(this.exampleResults.length, 1.25);
    let rows = grid.rows;
    let cols = grid.cols;

    // separate a-frame links by 4 units
    let elemWidth = 4;
    let elemHeight = 4;
    let leftPosX = -1 * (cols / 2) * elemWidth;
    let xPos = leftPosX;
    let yPos = 10;
    // let pos = new THREE.Vector3();

    for(let i=0; i < this.exampleResults.length; i++) {
      // pos.x = xPos;
      // pos.y = yPos;
      // pos.z = 0;

      // append it to the results so downstream processing (such as adding popups)
      // can also access the pos.
      this.exampleResults[i].pos = {};
      this.exampleResults[i].pos.x = xPos;
      this.exampleResults[i].pos.y = yPos;
      this.exampleResults[i].pos.z = 0;

      this.addLink(this.exampleResults[i]);

      xPos += elemWidth;

      if ((i + 1) % cols  == 0) {
        xPos = leftPosX;
        yPos -= elemHeight;
      }
    }

    // move the config panel down to row after last grid row.
    let configPanelEl = document.querySelector('app-config-panel');
    this.renderer.setAttribute(configPanelEl, 'position',`0 ${yPos - 3 * elemHeight} 0`);

    let helpPanelEl = document.querySelector('app-help-panel');
    this.renderer.setAttribute(helpPanelEl, 'position',`0 ${yPos - 3 * elemHeight -0.5} 0`);
  }

  // addLink(data, pos) {
  addLink(data) {
    console.log(`ResultsSubComponent.addLink: now creating link`);
    let linkParentEl = document.querySelector('#app-result-sub-links');
    let linkEl = document.createElement('a-entity');

    let linkAttributes = "";
    let href = `assets/threejs-env/examples/vrize-${data.name}`;
    linkAttributes += `href: ${href};`;
    linkAttributes += ` on: no-click;`
    linkAttributes += ` title: ${data.name};`
    let imgRoot = data['name'].replace(/\.html$/, '');
    linkAttributes += ` image: #${imgRoot}-thumb;`;
    linkAttributes += ` peekMode: "true";`
    linkEl.setAttribute('link', linkAttributes);
    linkEl.setAttribute('position', `${data.pos.x} ${data.pos.y} ${data.pos.z}`);
    // linkEl.setAttribute('position', `$data.{pos.x} ${pos.y} ${pos.z}`);
    // linkEl.setAttribute('position', `${2.5 * index} 0 0`);
    linkEl.setAttribute('id', `${imgRoot}-link`);
    // add in the rails example_id, so event handler can update stats
    let example_id = data.id;
    linkEl.setAttribute('example_id', example_id);
    // disable the system 'on' event handler
    // linkEl.setAttribute('on', 'no-click');
    // and define our own click handler (so we can increment stats before xferring)
    linkEl.addEventListener('click', (evt) => {
      // save dolly state
      this.utils.saveDollyState();

      // set last route so we know where to return to.
      this.ngRedux.dispatch(this.runtimeActions.setLastRoute("result-sub"));
      // let currentStore = this.utils.getCurrentNgRedux();
      // currentStore.dispatch(this.runtimeActions.setLastRoute("result-sub"));
      // save the appStore
      // debugger;
      this.utils.saveAppState(this.ngRedux);
      // this.utils.saveAppState(currentStore);
      // console.log(`now in user click handler`);
      // note: we just use a closure to specify the example_id instead of reading
      // the attribute since we have one event handler per link anyway.
      //TODO: don't do this upon cache recall
      this.examples.incExampleStat(example_id, "clicks")
        .subscribe(rsp => {
          console.log(`click: stats now updated`);
        },
        (err) => {console.log(`ResultsSceneComponent.clickHandler: err=${err}`)},
        // the finally block.. transfer in all cases, even if stats *not* updated
        () => {
          // debugger;
          (window as any).location=href
        }
      )
    });
    //
    linkParentEl.appendChild(linkEl);

    this.examples.addLinkHoverEvtListener(linkEl);

    // increments impressions stats
    // impressions stats are updated at query level since every refresh of
    // the results scene would drive the impressions count.
    // this.incImpressions(example_id);
  }

  // add thumbs to the assets list
  addImgAssets() {
    for (let i = 0; i < this.exampleResults.length; i++) {
    // for(let i=0; i < Object.keys(this.exampleResults).length; i++) {
      // this.addImgAsset(this.exampleResults[i], i);
      // let k = Object.keys(this.exampleResults)[i];
      // this.addImgAsset(this.exampleResults[k], i);
      this.addImgAsset(this.exampleResults[i], i);
    }
  }

  addImgAsset(data, index) {
    let scene: any = document.querySelector('a-scene');
    let appPrefix = this.base.appPrefix

    let evtDetail = {}
    // debugger;
    let imgRoot = data['name'].replace(/\.html$/, '')
    // evtDetail['src'] = `assets/img/thumbs/${imgRoot}_thumb.png`;
    evtDetail['src'] = `assets/img/thumbs/${imgRoot}-thumb.png`;
    evtDetail['id'] = `${imgRoot}-thumb`;

    let evt = new CustomEvent(`${appPrefix}_create_img_asset`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_create_img_asset`, true, true);
    // scene.emit(`${appPrefix}_createlink`);
    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    scene.dispatchEvent(evt)
  }

  addExamplePopupImgs() {
    // for (let i = 0; i < this.exampleResults.length; i++) {
    for(let i=0; i < this.exampleResults.length; i++) {
      // this.addExamplePopupImg(this.exampleResults[i], i);
      // let k = Object.keys(this.exampleResults)[i];
      this.addExamplePopupImg(this.exampleResults[i], i);
    }
  }

  addExamplePopupImg(data, index) {
    let scene: any = document.querySelector('a-scene');
    let appPrefix = this.base.appPrefix

    let evtDetail = {}
    // debugger;
    let imgRoot = data['name'].replace(/\.html$/, '')
    evtDetail['src'] = `#${imgRoot}-thumb`;
    // we need to move out the popup a little on z-axis to reduce interference
    // with the originating link image above.
    // We also need to make sure it's above the area of cursor focus, otherwise
    // the appearance of the overlay causes the cursor to think it's lost focus
    // Note: data.pos only supplies x and y coords.
    // debugger;
    evtDetail['pos'] = {x: data.pos.x, y: data.pos.y + 5, z: 0.5};
    // evtDetail['pos'] = {x: data.pos.x, y: data.pos.y + 5};
    evtDetail['width'] = 5;
    evtDetail['height'] = 5;
    evtDetail['visible'] = false;
    // evtDetail['visible'] = "true";
    evtDetail['linkId'] = `example-link-${index}`;
    evtDetail['id'] = `${imgRoot}-popup`;

    let evt = new CustomEvent(`${appPrefix}_create_popup_img`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_create_popup_img`, true, true);
    // scene.emit(`${appPrefix}_createlink`);
    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    scene.dispatchEvent(evt)
  }

  // Note: with view Source we ping-pong between ng and a-frame quite a bit. The
  // initial driver is here in ng, but we drive an event the creates the  actual
  // buton on the a-frame side.  Then, after the button has been clicked,
  // a-frame kicks off a 'vrgal_view_source_btn_clicked' event, which is
  // responded to here back on ng.  If I had to do it all over again, I would
  // just do it all on ng, but unfortunately there's quite a bit of code
  // (including hover) on the a-frame side, so I resort to ping-ponging.

  //Note: it looks like it's now mostly implemented on the ng side.
  addViewSourceBtns() {
    for (let i = 0; i < this.exampleResults.length; i++) {
      this.addViewSourceBtn(this.exampleResults[i], i);
    }
  }

  addViewSourceBtn(data, index) {
    let evtDetail = {};
    let exampleRoot = data['name'].replace(/\.html$/, '')

    evtDetail['pos'] = { x: data.pos.x + 1.5, y: data.pos.y -1, z: 0.1};
    evtDetail['exampleRoot'] = exampleRoot;
    evtDetail['id'] = `${exampleRoot}-viewSourceBtn`;
    evtDetail['exampleId'] = data.id;

    let evt = new CustomEvent(`${this.base.appPrefix}_create_view_source_btn`, { detail: evtDetail });
    evt.initEvent(`${this.base.appPrefix}_create_view_source_btn`, true, true);

    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    this.sceneEl.dispatchEvent(evt)

  }

  addViewSrcClickHandler() {
    // and register a click handler
    // let examples = this.examples;
    // this.sceneEl.addEventListener('vrgal_view_source_btn_clicked', (evt : CustomEvent) => {
    this.sceneEl.addEventListener(`${this.base.appPrefix}_view_source_btn_clicked`, (evt : CustomEvent) => {
      // debugger;
      // grey out the color, so we know it's selected
      let btnColor = evt.detail.btnEl.getAttribute('color');
      if (!btnColor || btnColor == '#FFF') {
        evt.detail.btnEl.setAttribute('color', '#444');
      }
      else {
        evt.detail.btnEl.setAttribute('color', '#FFF');
      }
      // evt.target.setAttribute()
      // console.log(`---->view source button added: exampleRoot=${evt.detail.exampleRoot}`);
      let exampleRoot = evt.detail.exampleRoot;

      this.utils.getLiftedExample(exampleRoot).subscribe(
        res => {
          // console.log(`result-scene : res=${res.substr(0,500)}`);
          let btnPos = evt.detail.btnEl.object3D.position;
          let logPos = btnPos.clone();
          logPos.x += 7;
          // move out in front a little to avoid interference with other screen artifacts.
          logPos.z += 0.5;

          this.showSource(exampleRoot, res, logPos);
        },
        err => {
          console.log(`result-scene: err=${err.message}`);
        }
      );
      // and increment code_view stats
      this.examples.incExampleStat(evt.detail.exampleId, "code_views")
        .subscribe(rsp => {
          console.log(`code_views: stats now updated`);
        },
        (err) => {console.log(`ResultsSceneComponent.addViewSrcClickHandler: err=${err.message}`)},
      )
    })
  }

  showSource(exampleRoot, exampleText, pos) {
    let logEl = document.getElementById("src-log");
    if (logEl.getAttribute('visible')) {
      this.hideSrcLog(logEl);
      return;
    }

    // set position
    logEl.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
    logEl.setAttribute('text', 'align: left; baseline: center; wrapCount: 120');
    logEl.setAttribute('geometry', 'primitive: plane; width: 12; height: 37')
    logEl.setAttribute('visible', 'true');

    // toggle visibility
    logEl.setAttribute('data-example-root', exampleRoot);

      let sceneEl: any = document.querySelector('a-scene');
      let logSystem = sceneEl.systems['log'];
      console.log(`logSystem.loggers[0].logs.length=${logSystem.loggers[0].logs.length}`);

      logSystem.loggers[0].logs = [];

      sceneEl.emit('log', { message: exampleText, channel: 'vrgal-src' });
      if (logSystem.loggers[0] && logSystem.loggers[0].logs[0]) {
        let lineCnt = logSystem.loggers[0].logs[0].split(/\r\n|\r|\n/).length
        console.log(`lineCnt=${lineCnt}`);
        // debugger;
        let logGeom = logEl.getAttribute('geometry');
        (logGeom as any).height = lineCnt / 5;
        logEl.setAttribute('geometry', logGeom);

      }
      console.log(`logSystem.loggers[0].logs.length-post=${logSystem.loggers[0].logs.length}`);
  }

  srcViewClickHandler(evt: Event) {
    // debugger;
    console.log(`ResultsScene.srcViewClickHandler: entered`);

    let logEl : any= evt.target;
    // let sceneEl = document.querySelector('a-scene');
    let logVisibility = logEl.getAttribute("visible");

    // Don't do anything at all if we're not visible
    if (!logVisibility) {
      return;
    }

    // Otherwise, make it invisible
    // logEl.setAttribute("visible", false);
    this.hideSrcLog(logEl);

    // and de-grey the the "view source" button
    let exampleRoot = logEl.getAttribute('data-example-root');
    let viewSrcBtn = document.getElementById(`${exampleRoot}-viewSourceBtn`);

    if (viewSrcBtn) {
      viewSrcBtn.setAttribute('color', '#FFF');
    }
  }

  hideSrcLog(logEl) {
    // and dock it at 0,0,0 and make it small so it doesn't mask other elements
    logEl.setAttribute('position', '0 0 0');
    let logGeom = logEl.getAttribute('geometry');
    logGeom.width = 0;
    logGeom.height = 0;
    logEl.setAttribute('geometry', logGeom);
    logEl.setAttribute("visible", "false");
  }

  returnToMain(evt: Event) {
    this.ngRedux.dispatch(this.runtimeActions.setLastRoute("query-sub"));
    console.log(`ResultSubComponent.returnToMain: new route=${this.ngRedux.getState().runtime.lastRoute}`)
    this.utils.toggleSubScenes();
  }


}
