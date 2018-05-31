import { Component, OnInit,  Renderer2 } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import {HttpModule, Http, Response} from '@angular/http';
import {ReactiveFormsModule, FormControl, FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
// import { BaseService } from '../../services/base.service';
// import { UtilsService } from '../../services/utils.service';
import { CoreBaseService } from '../../../core/services/core-base.service';
import { CoreUtilsService } from '../../../core/services/core-utils.service';
import { ExamplesService } from '../../../core/services/examples.service';
// import { StatsService } from '../../../core/services/stats.service';
import * as THREE from "three";
// import { BaseComponent} from '../base/base.component'

@Component({
  selector: 'app-results-scene',
  templateUrl: './results-scene.component.html',
  styleUrls: ['./results-scene.component.css']
})
// export class ResultsSceneComponent extends BaseComponent implements OnInit {
export class ResultsSceneComponent implements OnInit {
  // name : string;
  // category: string;
  // utils : UtilsService
  // exampleResults : Object[] = []
  exampleResults : Object = {};
  sceneEl : Element;
  appPrefix : string;
  debugCounter: number = 0;

  // constructor() { }
  // constructor(private http: Http, private base: BaseService, private utils: UtilsService) {
  constructor(
    // private http: Http,
    private base: CoreBaseService,
    private utils: CoreUtilsService,
    private renderer: Renderer2,
    private examples: ExamplesService,
  ) {
    // super()
    console.log(`ResultsSceneComponent.ctor: entered`);
    console.log(`ResultScene.ctor: dataStore=${this.utils.dataStore}`);
    console.log(`ResultsScene.ctor: this.utils.dataStore json=${JSON.stringify(this.utils.dataStore)}`);
    console.log(`ResultScene.ctor: query-select-results=${this.utils.dataStore['query-select-results']}`);


    this.exampleResults = JSON.parse(sessionStorage.getItem(`${this.base.appPrefix}_querySelectResults`))
    // console.log(`ResultScene.ctor: exampleResult-2=${this.exampleResults[0]}`);
  }

  ngOnInit() {
    console.log('ResultComponent.ngOnInit: entered');

    // console.log(`ResultsScene.ngOnInit: this.exampleResults.length=${this.exampleResults.length}`);
    console.log(`ResultsScene.ngOnInit: this.exampleResults.length=${Object.keys(this.exampleResults).length}`);
    document.querySelector('a-scene')
      .addEventListener('loaded', this.addResources.bind(this))

    // var el = document.querySelector("a-log");
    // el.setAttribute("visible", "false");
  }

  addResources() {
    this.sceneEl = document.querySelector('a-scene');
    this.utils.bgSoundInit(this.sceneEl, document.getElementById('bg-music-radio'));
    this.appPrefix = this.base.appPrefix

    this.addLinks();
    this.addImgAssets();
    this.addExamplePopupImgs();
    this.addViewSourceBtns();
    this.addViewSrcClickHandler();
    //TODO: add back incStats after you flesh out proxy meta-data server
    //this.incStats("impressions");
  }

  addLinks() {
    // console.log(`ResultsScene.addLinks: this.exampleResults.length=${this.exampleResults.length}`);
    // debugger;

    // for(let i=0; i < this.exampleResults.length; i++) {
    for(let i=0; i < Object.keys(this.exampleResults).length; i++) {
      // this.addLink(this.exampleResults[i], i);
      let k = Object.keys(this.exampleResults)[i];
      // this.addLink(this.exampleResults[k], i);
      this.addLink2(this.exampleResults[k], i);
    }

  }

  addLink2(data, index) {
    console.log(`ResultsSceneComponent.addLink2: now creating link`);
    let linkParentEl = document.querySelector('#links');
    let linkEl = document.createElement('a-entity');

    // linkEl.setAttribute('position', data.pos);
    // link="href: https://www.google.com; on: no-click;"
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
    // linkEl.setAttribute('title', data.name);
    // linkEl.setAttribute('href', href);
    // evtDetail['id'] = `${imgRoot}-link`;
    linkEl.setAttribute('id', `${imgRoot}-link`);
    // add in the rails example_id, so event handler can update stats
    let example_id = data.id;
    linkEl.setAttribute('example_id', example_id);
    // evtDetail['image'] = `#${imgRoot}-thumb`;
    // linkEl.setAttribute('image', `#${imgRoot}-thumb`);
    // disable the system 'on' event handler
    // linkEl.setAttribute('on', 'no-click');
    // and define our own click handler (so we can increment stats before xferring)
    linkEl.addEventListener('click', (evt) => {
      // console.log(`now in user click handler`);
      // note: we just use a closure to specify the example_id instead of reading
      // the attribute since we have one event handler per link anyway.
      this.examples.incExampleStat(example_id, "clicks")
        .subscribe(rsp => {
          console.log(`click: stats now updated`);
        },
        (err) => {console.log(`ResultsSceneComponent.clickHandler: err=${err}`)},
        // the finally block.. transfer in all cases, even if stats *not* updated
        () => { (window as any).location=href}
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

  incImpressions(example_id) {
    this.examples.incExampleStat(example_id, "impressions")
      .subscribe(rsp => {
        console.log(`impressions: stats now updated`);
      },
      (err) => {console.log(`ResultsSceneComponent.incImpressions: err=${err}`)},
  )
}

  addLink(data, index) {
    console.log(`resultsSceneComponent.addLink: http result=${data}`);
    console.log(`resultsSceneComponent.addLink: http result.id=${data.id}`);
    console.log(`resultsSceneComponent.addLink: http result.name=${data.name}`);
    console.log(`resultsSceneComponent.addLink: http result.category=${data.category}`);
    console.log(`resultsSceneComponent.addLink: http result.created_at=${data.created_at}`);
    // this.name = data.name;
    // this.category = data.category;
    let scene: any = document.querySelector('a-scene');
    let appPrefix = this.base.appPrefix
    let evtPrefix = `${appPrefix}_createlink`
    console.log(`querySelect: evtPrefix=${evtPrefix}`);

    let evtDetail = {}
    evtDetail['href'] = `assets/threejs-env/examples/vrize-${data.name}`
    //temp hack to move it down during testing
    // data.pos.y += 5;
    evtDetail['pos'] = data.pos
    evtDetail['title'] = data.name;

    // evtDetail['id'] = `example-link-${index}`;
    let imgRoot = data['name'].replace(/\.html$/, '')
    evtDetail['id'] = `${imgRoot}-link`;
    // evtDetail['image'] = `assets/img/thumbs/${imgRoot}_thumb.png`;
    evtDetail['image'] = `#${imgRoot}-thumb`;

    // add in the rails example_id, so event handler can update stats
    evtDetail['example_id'] = data.id;

    let evt = new CustomEvent(`${appPrefix}_createlink`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_createlink`, true, true);
    // scene.emit(`${appPrefix}_createlink`);
    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    scene.dispatchEvent(evt)
  }

  // add thumbs to the assets list
  addImgAssets() {
    // for (let i = 0; i < this.exampleResults.length; i++) {
    for(let i=0; i < Object.keys(this.exampleResults).length; i++) {
      // this.addImgAsset(this.exampleResults[i], i);
      let k = Object.keys(this.exampleResults)[i];
      this.addImgAsset(this.exampleResults[k], i);
    }
  }

  addImgAsset(data, index) {
    let scene: any = document.querySelector('a-scene');
    let appPrefix = this.base.appPrefix
    // let evtPrefix = `${appPrefix}_createasset`
    // console.log(`querySelect: evtPrefix=${evtPrefix}`);

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
    for(let i=0; i < Object.keys(this.exampleResults).length; i++) {
      // this.addExamplePopupImg(this.exampleResults[i], i);
      let k = Object.keys(this.exampleResults)[i];
      this.addExamplePopupImg(this.exampleResults[k], i);
    }
  }

  addExamplePopupImg(data, index) {
    let scene: any = document.querySelector('a-scene');
    let appPrefix = this.base.appPrefix

    let evtDetail = {}
    // debugger;
    let imgRoot = data['name'].replace(/\.html$/, '')
    // evtDetail['src'] = `assets/img/thumbs/${imgRoot}_thumb.png`;
    // we want to use the asseted (pre-loaded) version
    evtDetail['src'] = `#${imgRoot}-thumb`;
    // evtDetail['src'] = `assets/img/thumbs/${imgRoot}_thumb.png`;
    // evtDetail['pos'] = `1 0 0`;
    // evtDetail['pos'] = {x: 1, y: 0, z: 0.5};
    // evtDetail['pos'] = data.pos;
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
  // add a 'mouseenter' listener so we can show a popup screen print of what
  // the example looks like.
  // addLinkHoverEvtListener() {

  // }
  // Note: with view Source we ping-pong between ng and a-frame quite a bit. The
  // initial driver is here in ng, but we drive an event the creates the  actual
  // buton on the a-frame side.  Then, after the button has been clicked,
  // a-frame kicks off a 'vrgal_view_source_btn_clicked' event, which is
  // responded to here back on ng.  If I had to do it all over again, I would
  // just do it all on ng, but unfortunately there's quite a bit of code
  // (including hover) on the a-frame side, so I resort to ping-ponging.
  addViewSourceBtns() {
    // for (let i = 0; i < this.exampleResults.length; i++) {
    for(let i=0; i < Object.keys(this.exampleResults).length; i++) {
      // this.addViewSourceBtn(this.exampleResults[i], i);
      // this.registerViewSourceListener(this.exampleResults[i], i);
      let k = Object.keys(this.exampleResults)[i];
      this.addViewSourceBtn(this.exampleResults[k], i);
    }
    // vrgal_view_source_btn_clicked
    // add a listener for after the click has been handled on the a-frame side
    // so we can update stats.  We want to do it on the ng side because we
    // have the meta-server defined in the ng environment file.
    // document.querySelector('#view-source-btns')
    //   .addEventListener('vrgal_view_source_btn_clicked', evt => {
    //     console.log(`ResultComponent.vrgal_view_source_btn_clicked event handler: exampleRoot=${(evt as any).detail.exampleRoot}`)
    // })
  }

  addViewSourceBtn(data, index) {
    let evtDetail = {};
    let exampleRoot = data['name'].replace(/\.html$/, '')
    // let appPrefix = this.base.appPrefix

    evtDetail['pos'] = { x: data.pos.x + 1.5, y: data.pos.y -1, z: 0.1};
    evtDetail['exampleRoot'] = exampleRoot;
    evtDetail['id'] = `${exampleRoot}-viewSourceBtn`;
    evtDetail['exampleId'] = data.id;

    let evt = new CustomEvent(`${this.appPrefix}_create_view_source_btn`, { detail: evtDetail });
    evt.initEvent(`${this.appPrefix}_create_view_source_btn`, true, true);

    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    this.sceneEl.dispatchEvent(evt)

  }

  addViewSrcClickHandler() {
    // and register a click handler
    // TODO: change to this.appPrefix instead of 'vrgal'
    // let examples = this.examples;
    this.sceneEl.addEventListener('vrgal_view_source_btn_clicked', (evt : CustomEvent) => {
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
      // let el = evt.target;
      // // Add listeners
      // let global = this.renderer.listen(el, 'click', (evt) => {
      //   console.log(`Clicking for exampleRoot=${exampleRoot}`);
      // })
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
    // debugger;
    // let logEl = document.getElementById('src-log');

    // if (logEl) {
    //   logEl.parentNode.removeChild(logEl);
    //   return
    // }
    // let logEl = document.querySelector("a-log");
    let logEl = document.getElementById("scr-log");
    // logEl = document.createElement('a-log');
    // logEl.id = "src-log";
    // let sceneEl = document.querySelector('a-scene');
    // sceneEl.appendChild(logEl);
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

    // let logVisibility = logEl.getAttribute("visible");
    // let newVisibility = !logVisibility;

    // logEl.setAttribute("visible", String(newVisibility));

    // and set a data attribute to the exampleRoot (example name), so we can synchronize
    // other artifacts (that also have 'exampleRoot' in their ids) when a
    // click on the log is generated, for example.
    // logEl.id = exampleRoot;
    logEl.setAttribute('data-example-root', exampleRoot);

    // debugger;
    // if (logEl.getAttribute("visible")) {
      let sceneEl: any = document.querySelector('a-scene');
      // let logEl : any = document.querySelector('a-log');
      // let logEl : any = document.getElementById('scr-log');
      let logSystem = sceneEl.systems['log'];
      // debugger;

      // this just stretches w/o increasing the size
      // logEl.object3D.scale.y *= 1.5;
      // logEl.getAttribute('geometry').height = 50;
      // let logGeom = logEl.getAttribute('geometry');
      // logGeom.height = 50;
      // logEl.setAttribute('geometry', logGeom);
      // clear out the prior contents (we do *not* want to accumulate)
      // This is an empirical hack for how to clear out the log.  AFAIK,
      // there is no official API to clear out the contents (?)
      // debugger;
      // this.debugCounter++;
      // console.log(`debugCounter=${this.debugCounter}`);
      console.log(`logSystem.loggers[0].logs.length=${logSystem.loggers[0].logs.length}`);


      // if (this.debugCounter >= 2) {
      //   debugger;
      // }
      logSystem.loggers[0].logs = [];
      // if (logSystem.loggers[0] && logSystem.loggers[0].logs[0]) {
      //   console.log(`showSource: prior logText=${logSystem.loggers[0].logs[0]}`);

      //   // logSystem.loggers[0].logs[0] = '';
      //   logSystem.loggers[0].logs = [];
      // }

      // (document.querySelector('a-scene') as any)
      // (sceneEl as any)
      // sceneEl.emit('log', { message: exampleText.substr(0, 100), channel: 'vrgal-src' });
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
      // debugger;
    // }

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
    // sceneEl.remove(logEl);
    // logEl.parentNode.removeChild(logEl);

    // and de-grey the the "view source" button
    // let exampleRoot = logEl.id;
    let exampleRoot = logEl.getAttribute('data-example-root');
    let viewSrcBtn = document.getElementById(`${exampleRoot}-viewSourceBtn`);

    if (viewSrcBtn) {
      viewSrcBtn.setAttribute('color', '#FFF');
    }
  }

  hideSrcLog(logEl) {
    // toggle visibility
    // let logVisibility = logEl.getAttribute("visible");
    // let newVisibility = !logVisibility;

    // logEl.setAttribute("visible", String(newVisibility));

    // and dock it at 0,0,0 and make it small so it doesn't mask other elements
    logEl.setAttribute('position', '0 0 0');
    // logEl.setAttribute('geometry', 'primitive: plane; width: 2; height: 2')
    let logGeom = logEl.getAttribute('geometry');
    logGeom.width = 0;
    logGeom.height = 0;
    logEl.setAttribute('geometry', logGeom);
      // let sceneEl: any = document.querySelector('a-scene');
      // let logSystem = sceneEl.systems['log'];

      // if (logSystem.loggers[0] && logSystem.loggers[0].logs[0]) {
      //   let lineCnt = logSystem.loggers[0].logs[0].split(/\r\n|\r|\n/).length
      //   console.log(`lineCnt=${lineCnt}`);
      //   // debugger;
      //   let logGeom = logEl.getAttribute('geometry');
      //   logGeom.height = lineCnt / 5;
      //   logEl.setAttribute('geometry', logGeom);
      // }
    logEl.setAttribute("visible", "false");
  }

  incStats(metric) {
    // for(let i=0; i < this.exampleResults.length; i++) {
    for(let i=0; i < Object.keys(this.exampleResults).length; i++) {
      // this.incStat(this.exampleResults[i], metric);
      let k = Object.keys(this.exampleResults)[i];

      let example = this.exampleResults[k];
      if (!example.tabulated) {
        this.incStat(example, metric);

        // and indicate in the session storage that we've already tabulated this
        // example as far as the user session goes (e.g.don't keep incrementing
        // stats everytime they return to this page for this session)
        example.tabulated = true;
      }
    }

    // and rewrite sessionStorage to indicate any 'tabulated' flag changes
    sessionStorage.setItem(`${this.base.appPrefix}_querySelectResults`, JSON.stringify(this.exampleResults));

    // let stat =  { 'impressions': null};
    // this.examples.put(`${this.base.vrizeSvcUrl}/examples/260/stats/increment.json`, stat)
    //   .subscribe(
    //     rsp => {console.log(`ResultsSceneComoponent.incStats: rsp.likes=${(rsp as any).impressions}`)},
    //     err => {console.log(`ResultsSceneComoponent.incStats: err=${err.message}`)}
    //   );
  }

  incStat(data, metric) {
    let statsUrl = `${this.base.vrizeSvcUrl}/examples/${data.id}/stats.json`;
    console.log(`incStat.statsUrl=${statsUrl}`);

    // this.examples.get(statsUrl)
    //   .subscribe(
    //     rsp => {
    //       // debugger;
    //       // let result= (rsp as any).json();
    //       // console.log(`incStat->id=${data.id}, ${metric}=${(rsp[0] as any)[metric]}`)
    //     },
    //     err => { console.log(`err=${err.message}`) }
    //   )

    // increment impressions stats
    /*
    let stat = { 'impressions': null };
    statsUrl = `${this.base.vrizeSvcUrl}/examples/${data.id}/stats/increment.json`;
    this.examples.put(statsUrl, stat)
    // this.examples.put(`${this.base.vrizeSvcUrl}/examples/260/stats/increment.json`, stat)
      .subscribe(
        rsp => { console.log(`ResultsSceneComoponent.incStats: rsp.impressions=${(rsp as any).impressions}`) },
        err => { console.log(`ResultsSceneComoponent.incStats: err=${err.message}`) }
      );
      */
  }


  // registerViewSourceListeners() {
  //   for (let i = 0; i < this.exampleResults.length; i++) {
  //     this.registerViewSourceListener(this.exampleResults[i], i);
  //   }
  // }

  // registerViewSourceListener(data, index) {
  //   // let btn = document.querySelector('#vrize-webgl_lights_pointlights-view-source');
  //   // let exampleRoot =
  //   let exampleRoot = data['name'].replace(/\.html$/, '');
  // }

  toggleBgMusic(evt: Event) {
    this.utils.toggleSound(document.querySelector('#bg-music'));
  }

}
