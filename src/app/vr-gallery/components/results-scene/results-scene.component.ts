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
  exampleResults : Object[] = []
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
    console.log(`ResultScene.ctor: exampleResult-2=${this.exampleResults[0]}`);
  }

  ngOnInit() {
    console.log('ResultComponent.ngOnInit: entered');

    console.log(`ResultsScene.ngOnInit: this.exampleResults.length=${this.exampleResults.length}`);
    document.querySelector('a-scene')
      .addEventListener('loaded', this.addResources.bind(this))

    var el = document.querySelector("a-log");
    el.setAttribute("visible", "false");
  }

  addResources() {
    this.sceneEl = document.querySelector('a-scene');
    this.appPrefix = this.base.appPrefix

    this.addLinks();
    this.addImgAssets();
    this.addExamplePopupImgs();
    this.addViewSourceBtns();
    this.addViewSrcClickHandler();
    this.incStats("impressions");
  }

  addLinks() {
    console.log(`ResultsScene.addLinks: this.exampleResults.length=${this.exampleResults.length}`);
    // debugger;
    
    for(let i=0; i < this.exampleResults.length; i++) {
      this.addLink(this.exampleResults[i], i);
    }

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
    for (let i = 0; i < this.exampleResults.length; i++) {
      this.addImgAsset(this.exampleResults[i], i);
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
    evtDetail['src'] = `assets/img/thumbs/${imgRoot}_thumb.png`;
    evtDetail['id'] = `${imgRoot}-thumb`;

    let evt = new CustomEvent(`${appPrefix}_create_img_asset`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_create_img_asset`, true, true);
    // scene.emit(`${appPrefix}_createlink`);
    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    scene.dispatchEvent(evt)
  }

  addExamplePopupImgs() {
    for (let i = 0; i < this.exampleResults.length; i++) {
      this.addExamplePopupImg(this.exampleResults[i], i);
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
    evtDetail['pos'] = {x: data.pos.x, y: data.pos.y + 5, z: 0.1};
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
  addViewSourceBtns() {
    for (let i = 0; i < this.exampleResults.length; i++) {
      this.addViewSourceBtn(this.exampleResults[i], i);
      // this.registerViewSourceListener(this.exampleResults[i], i);
    }
  }

  addViewSourceBtn(data, index) {
    let evtDetail = {};
    let exampleRoot = data['name'].replace(/\.html$/, '')
    // let appPrefix = this.base.appPrefix

    evtDetail['pos'] = { x: data.pos.x + 1.5, y: data.pos.y -1, z: 0.1};
    evtDetail['exampleRoot'] = exampleRoot;
    evtDetail['id'] = `${exampleRoot}-viewSourceBtn`;

    let evt = new CustomEvent(`${this.appPrefix}_create_view_source_btn`, { detail: evtDetail });
    evt.initEvent(`${this.appPrefix}_create_view_source_btn`, true, true);

    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    this.sceneEl.dispatchEvent(evt)

  }

  addViewSrcClickHandler() {
    // and register a click handler
    // TODO: change to this.appPrefix instead of 'vrgal'
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
      console.log(`---->view source button added: exampleRoot=${evt.detail.exampleRoot}`);
      let exampleRoot = evt.detail.exampleRoot;

      this.utils.getLiftedExample(exampleRoot).subscribe(
        res => {
          console.log(`result-scene ${Math.random()}: res=${res.substr(0,500)}`);
          this.showSource(res);
        },
        err => {
          console.log(`result-scene: err=${err}`);
        }
      );
      // let el = evt.target; 
      // // Add listeners
      // let global = this.renderer.listen(el, 'click', (evt) => {
      //   console.log(`Clicking for exampleRoot=${exampleRoot}`);
      // })
    })
  }

  showSource(exampleText) {
    // debugger;
    var logEl = document.querySelector("a-log");

    // toggle visibility
    let logVisibility = logEl.getAttribute("visible");
    let newVisibility = !logVisibility;

    logEl.setAttribute("visible", String(newVisibility));

    // debugger;
    if (logEl.getAttribute("visible")) {
      let sceneEl: any = document.querySelector('a-scene');
      let logEl : any = document.querySelector('a-log');
      let logSystem = sceneEl.systems['log'];

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
        logGeom.height = lineCnt / 5;
        logEl.setAttribute('geometry', logGeom);
        
      }
      console.log(`logSystem.loggers[0].logs.length-post=${logSystem.loggers[0].logs.length}`);
      // debugger;
    }

  }

  incStats(metric) {
    for(let i=0; i < this.exampleResults.length; i++) {
      this.incStat(this.exampleResults[i], metric);
    }

    let stat =  { 'impressions': null};
    this.examples.put(`${this.base.vrizeSvcUrl}/examples/260/stats/increment.json`, stat)
      .subscribe(
        rsp => {console.log(`ResultsSceneComoponent.incStats: rsp.likes=${(rsp as any).impressions}`)},
        err => {console.log(`ResultsSceneComoponent.incStats: err=${err.message}`)}
      );
  }

  incStat(data, metric) {
    let statsUrl = `${this.base.vrizeSvcUrl}/examples/${data.id}/stats.json`;
    console.log(`incStat.statsUrl=${statsUrl}`);

    this.examples.get(statsUrl)
      .subscribe(
        rsp => {
          // debugger;
          // let result= (rsp as any).json(); 
          console.log(`incStat->id=${data.id}, ${metric}=${(rsp[0] as any)[metric]}`)
        },
        err => { console.log(`err=${err.message}`) }
      )

    // increment impressions stats
    let stat = { 'impressions': null };
    statsUrl = `${this.base.vrizeSvcUrl}/examples/${data.id}/stats/increment.json`;
    this.examples.put(statsUrl, stat)
    // this.examples.put(`${this.base.vrizeSvcUrl}/examples/260/stats/increment.json`, stat)
      .subscribe(
        rsp => { console.log(`ResultsSceneComoponent.incStats: rsp.impressions=${(rsp as any).impressions}`) },
        err => { console.log(`ResultsSceneComoponent.incStats: err=${err.message}`) }
      );
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

}
