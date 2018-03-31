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
    document.querySelector('a-scene').addEventListener('loaded', this.addLinks.bind(this))
  }

  addLinks() {
    console.log(`ResultsScene.addLinks: this.exampleResults.length=${this.exampleResults.length}`);
    
    for(let i=0; i < this.exampleResults.length; i++) {
      this.addLink(this.exampleResults[i])
    }

  }

  addLink(data) {
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
    let evt = new CustomEvent(`${appPrefix}_createlink`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_createlink`, true, true);
    // scene.emit(`${appPrefix}_createlink`);
    scene.dispatchEvent(evt)
  }

}
