import { Component, OnInit } from '@angular/core';
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

  // constructor() { }
  // constructor(private http: Http, private base: BaseService, private utils: UtilsService) { 
  constructor( 
    // private http: Http, 
    private base: CoreBaseService,
    private utils: CoreUtilsService 
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
  }

  addResources() {
    this.addLinks();
    // this.addImgAssets();
    this.addExamplePopupImgs();
  }

  addLinks() {
    console.log(`ResultsScene.addLinks: this.exampleResults.length=${this.exampleResults.length}`);
    
    for(let i=0; i < this.exampleResults.length; i++) {
      this.addLink(this.exampleResults[i], i);
    }

  }

  addLink(data, index) {
    console.log(`resultsSceneComponent.addLink: http result=${data}`);
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
    evtDetail['pos'] = data.pos
    evtDetail['title'] = data.name;

    // evtDetail['id'] = `example-link-${index}`;
    let imgRoot = data['name'].replace(/\.html$/, '')
    evtDetail['id'] = `${imgRoot}-link`;
    evtDetail['image'] = `assets/img/thumbs/${imgRoot}_thumb.png`;

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
    evtDetail['pos'] = `1 0 0`;
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

}
