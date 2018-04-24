import { Component, OnInit } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';  // replaces previous Http service
import {ReactiveFormsModule, FormControl, FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { CoreBaseService } from '../../../core/services/core-base.service';
import { CoreUtilsService } from '../../../core/services/core-utils.service';
import { ExamplesService } from '../../../core/services/examples.service';
// import THREE from "THREE";
// declare var THREE: any;
import * as THREE from "three";
// import * as AFRAME from "AFRAME";
// declare var AFRAME: any;
import {Router} from '@angular/router';
import { debug } from 'util';

@Component({
  selector: 'app-query-select',
  templateUrl: './query-select.component.html',
  styleUrls: ['./query-select.component.css'],
  // providers: [UtilsService]
})
// export class QuerySelectComponent extends BaseComponent implements OnInit {
export class QuerySelectComponent implements OnInit {
  name : string;
  category: string;
  // exampleResults : Object[] = []
  exampleResults : Object = {};
  // expectedResultCnt : number
  // 'webgl_geometry_cube.html'
  // http://localhost:3000/examples/260
  // http://192.168.50.126:3000/examples/260
  constructor(
    private http: HttpClient, 
    private base: CoreBaseService, 
    private utils: CoreUtilsService,
    private router: Router,
    private examples: ExamplesService,
  ) { 
    // super()
    console.log('QuerySelectComponent.ctor: entered');
    //TODO: rename base.vrizeSvcUrl to somehting like 'db-server' or 
    // 'meta-data-server'
    console.log(`QuerySelectComponent.ctor: base.vrizeSvcUrl=${base.vrizeSvcUrl}`);
  }

  ngOnInit() {
    document.querySelector('a-scene')
      .addEventListener('loaded', this.init.bind(this))
  }

  init() {
    console.log('QuerySelectComponent.ngOnInit: entered');

    // let exampleResults : Object[] = [];
    
    let scene: any = document.querySelector('a-scene');
    let sbBox: any = document.querySelector('#sb-query');
    let allBox: any = document.querySelector('#all-query');


    sbBox.addEventListener('click', () => {
      console.log(`querySelect.clickHandler: click genned`);
      console.log(`querySelect.clickHandler: doing api route`);
      
      this.querySandbox()
    });

    allBox.addEventListener('click', () => {
      this.queryAll()
    });

  }

  querySandbox() {
    // this.expectedResultCnt = 3

    // let exObservable_1 = this.getExampleObservable(`${this.base.vrizeSvcUrl}/examples/260.json`, new THREE.Vector3(-6, 0 ,0))
    // let exObservable_2 = this.getExampleObservable(`${this.base.vrizeSvcUrl}/examples/288.json`, new THREE.Vector3(0, 0 ,0))
    // let exObservable_3 = this.getExampleObservable(`${this.base.vrizeSvcUrl}/examples/15.json`, new THREE.Vector3(6, 0 ,0))

    // exObservable_1.subscribe(
    //   rsp => { 
    //     let data: any = rsp; 
    //     data.pos = {}; 
    //     data.pos.x=-4; 
    //     data.pos.y = -8;
    //     this.aggregateResults(data)
    //   },
    //   err => { console.log(`querySandbox: err=${err.message}`);
    //   }
    // )
    // // exObservable_1.subscribe(this.processResults.bind(this))
    // exObservable_2.subscribe(this.aggregateResults.bind(this))
    // exObservable_3.subscribe(this.aggregateResults.bind(this))

    let httpParams = new HttpParams();
    httpParams = httpParams.append('col', 'lift_failure_code');
    let lf_codes = ['-2'];
    lf_codes.forEach(lfc => {
      httpParams = httpParams.append('in[]', lfc);
    });

    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    })

    // httpParams.headers
    // let options = {};
    // options['params'] = httpParams;
    // options['headers'] = headers;
    // httpParams['headers'] = headers;

    try {
      this.examples.get(`${this.base.vrizeSvcUrl}/examples/search.json`, httpParams)
      // this.examples.get(`${this.base.vrizeSvcUrl}/examples/search.json`, options)
        .subscribe(this.processResults.bind(this));
    }
    catch (e) {
      console.log(`QuerySelectComponent.querySb: e=${e}`);
    }

  }

  querySample(evt: Event) {
    console.log(`QuerySelectComponent.querySample: entered`);
    // localhost:3000/examples/search.json?col=id&in[]=260&in[]=120
    const ids = ['260', '120'];
    let httpParams = new HttpParams();
    httpParams = httpParams.append('col', 'id');
    ids.forEach(id => {
      httpParams = httpParams.append('in[]', id);
    });
    // const params = new HttpParams({
    //   fromObject: {
    //     col: 'id',
    //     in: [260, 120],
    //   }
    // });
    try {
      this.examples.get(`${this.base.vrizeSvcUrl}/examples/search.json`, httpParams)
        .subscribe(this.processResults.bind(this));
    }
    catch (e) {
      console.log(`QuerySelectComponent.queryAll: e=${e}`);
    }
    

  }

  //TODO: Better handle the situation where the service is not running.  Right now, if the server
  // has no network connetection you get no html response, and an esoteric error message on the console.
  queryAll() {
    // this.expectedResultCnt = 4

    // let exObservable = this.getExampleObservable(`${this.base.vrizeSvcUrl}/examples/all_lifted.json`, new THREE.Vector3(-6, 0 ,0))
    try {
      this.examples.get(`${this.base.vrizeSvcUrl}/examples/all_lifted.json`)
        .subscribe(this.processResults.bind(this));
    }
    catch (e) {
      console.log(`QuerySelectComponent.queryAll: e=${e}`);
    }

    // exObservable.subscribe(this.processResults.bind(this))
  }

  //TODO: use example service to do get.  Don't use this
  //no..ok
  // actually, I think I really *should* use 'examples.service.ts'
  getExampleObservable(apiURL: string, pos: THREE.Vector3) {
    try {
      return this.http.get(apiURL)
        .map(res => {
          let result = res;
          return result;
        });
    }
    catch(e) {
      console.log(`try-catch-1: e=${e}`);
      // debugger;
    }
  }

  // process a  many rowed result
  processResults(data) {
    let xPos = -8;
    let yPos = 10;
    // debugger;

    for(let i=0; i < data.length; i++) {
      data[i].pos = {}
      data[i].pos.x = xPos
      data[i].pos.y = yPos
      
      this.aggregateResults(data[i])

      xPos += 4

      if ((i + 1) % 5 == 0) {
        xPos = -8;
        yPos -= 4;
      }

    //   // and increment the stats
    //   let statsUrl = `${this.base.vrizeSvcUrl}/examples/${data[i].id}/stats.json`;
    //   console.log(`processResults.statsUrl=${statsUrl}`);
      

    //   this.examples.get(statsUrl)
    //     .subscribe(
    //       rsp => {
    //         // debugger;
    //         // let result= (rsp as any).json(); 
    //         console.log(`id=${data[i].id}, likes=${(rsp[0] as any).likes}`)} ,
    //       err => { console.log(`err=${err.message}`)}
    //   )
    }

    // and finally, transfer to it
    // this.transferToResultsScene();
  }

  aggregateResults(data) {
    let example = {}

    example['id'] = data.id;
    example['name'] = data.name
    example['pos'] = data.pos

    // this.exampleResults.push(example)
    this.exampleResults[data.id] = example

    // We have to use sessionStorage to transfer data among routes, because a
    // pure a-frame link is more of a pure DOM transfer and is kind of out reach
    // of the NG environment, thus NG injects new services into the
    // transferred-to component instead of the existing one. 
    sessionStorage.setItem(`${this.base.appPrefix}_querySelectResults`, JSON.stringify(this.exampleResults));

    // create dynamic link
    // We can do an offical NG route with something like 'this.router.navigate',
    // but that drops the a-frame vr-mode, and you can't carry vr mode into the
    // next route (all "quantum" transfers require a user-gesture, thus the user
    // *must* do a click to do a vr transfer).
    let scene: any = document.querySelector('a-scene');

    let evtDetail = {}
    evtDetail['href'] = `vr-gallery/results-scene`
    evtDetail['pos'] = new THREE.Vector3(0, -2, 0)
    evtDetail['title'] = "View Results";
    let appPrefix = this.base.appPrefix
    let evt = new CustomEvent(`${appPrefix}_createlink`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_createlink`, true, true);
    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    scene.dispatchEvent(evt)
  }

  // Unfortunately, this does not invoke a user-gesture, thus if you transfer
  // with this you will lose the vr state.
  transferToResultsScene() {
    this.router.navigateByUrl('vr-gallery/results-scene');
  }


}
