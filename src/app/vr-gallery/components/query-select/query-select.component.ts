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
    let scene: any = document.querySelector('a-scene');
    // let sbBox: any = document.querySelector('#sb-query');
    let allBox: any = document.querySelector('#all-query');

    // sbBox.addEventListener('click', () => {
    //   console.log(`querySelect.clickHandler: click genned`);
    //   console.log(`querySelect.clickHandler: doing api route`);
    //
    //   this.querySandbox()
    // });

    // allBox.addEventListener('click', () => {
    //   this.queryAll()
    // });

    // make the controller help invisble
    // let handHelpEl = document.querySelector("#hand-overview-chart");
    // handHelpEl.setAttribute("visible","false");
  }

  // If the user clicks anywhere on the scene (that is not an element) clear
  // out any previously generated links.

  // If user toggles the query buttons (clicks on it twice), clear out what was
  // previously done (e.g remove the dynamic links and sessionStorage so they
  // can start anew)
  resetState() {
    console.log(`QuerySelectComponent.resetLinks: entered`);
    this.exampleResults = {};

    sessionStorage.removeItem(`${this.base.appPrefix}_querySelectResults`);

    let linksNode = document.getElementById("links");
    while (linksNode.firstChild) {
      linksNode.removeChild(linksNode.firstChild);
    }

  }

  querySandbox() {

    let httpParams = new HttpParams();
    // httpParams = httpParams.append('col', 'lift_failure_code');
    httpParams = httpParams.append('col', 'lift_code');
    let lf_codes = ['-2'];
    lf_codes.forEach(lfc => {
      httpParams = httpParams.append('in[]', lfc);
    });

    let headers = new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'http://localhost:4200'
      'Content-Type': 'application/json'
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

  queryCurated(evt: Event) {
    console.log(`QuerySelectComponent.queryCurated: entered`);
    if (Object.keys(this.exampleResults).length > 0) {
      this.resetState();
    }
    else {
      try {
        this.examples.get(`${this.base.vrizeSvcUrl}/examples/all_curated.json`)
        .subscribe(
          // (data => {this.processResults(data.examples)}).bind(this),
          data => {this.processResults((data as any).examples, "queryCurated")},
          err => {console.log(`err=${err.message}`);
        });
        // .subscribe(
        //   data => {console.log(`data.length=${(data as any).length}`)},
        //   err => {console.log(`err=${err.message}`)}
        // )
      }
      catch (e) {
        console.log(`QuerySelectComponent.queryCurated: e=${e}`);
      }
    }
  }

  //TODO: Better handle the situation where the service is not running.  Right now, if the server
  // has no network connetection you get no html response, and an esoteric error message on the console.
  queryAll(evt: Event) {
    if (Object.keys(this.exampleResults).length > 0) {
      this.resetState();
    }
    else {
      try {
      this.examples.get(`${this.base.vrizeSvcUrl}/examples/all_lifted.json`)
      //this.examples.get("http://127.0.0.1:3000/examples/260.json")
      //this.examples.get("http://infinitewheelie.org:3000/examples/260.json")
      // works when running http
      //this.examples.get("http://infinitewheelie.org/servers/meta-data-proxy/examples/all_lifted.json")
      // works when running https
      //this.examples.get("https://infinitewheelie.org/servers/meta-data-proxy/examples/all_lifted.json")
      // .subscribe(this.processResults.bind(this), err => {console.log(`err=${err.message}`);
      // });
          .subscribe(
            data => {this.processResults((data as any).examples, "queryAll")},
            err => {console.log(`queryAll:err=${err.message}`);
        });
      //debugger;
      // this.examples.getMetaData();
      }
      catch (e) {
        console.log(`QuerySelectComponent.queryAll: e=${e}`);
      }

      // exObservable.subscribe(this.processResults.bind(this))
    }
  }

  // process a  many rowed result
  processResults(data, queryType) {
    // let xPos = -8;
    // let yPos = 10;
    // debugger;
    let grid : any = this.utils.gridicize(data.length, 1.25);
    // let grid : any = this.utils.gridicize(data.length, 1.5);
    let rows = grid.rows;
    let cols = grid.cols;
    // separate a-frame links by 4 units
    let elemWidth = 4;
    let elemHeight = 4;
    let leftPosX = -1 * (cols / 2) * elemWidth;
    let xPos = leftPosX;
    let yPos = 10;

    for(let i=0; i < data.length; i++) {
      data[i].pos = {}
      data[i].pos.x = xPos
      data[i].pos.y = yPos
      data[i].pos.z = 0

      this.aggregateResults(data[i])

      // xPos += 4
      xPos += elemWidth;

      // if ((i + 1) % 5 == 0) {
      if ((i + 1) % cols  == 0) {
        // xPos = -8;
        // yPos -= 4;
        xPos = leftPosX;
        yPos -= elemHeight;
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
    // console.log(`QuerySelectComponent.processResults: data.example_id=${data[i].example_id}`)
    // this.examples.incExampleStat(data[i].example_id, "impressions")
    //   .subscribe(rsp => {
    //     console.log(`impressions: stats now updated`);
    //   },
    //   (err) => {console.log(`QuerySelectComponent.incImpressions: err=${err}`)},
    // )
    }
    // push the final exampleResults onto sessionStorage
    sessionStorage.setItem(`${this.base.appPrefix}_querySelectResults`, JSON.stringify(this.exampleResults));
    // create dynamic link
    // We can do an offical NG route with something like 'this.router.navigate',
    // but that drops the a-frame vr-mode, and you can't carry vr mode into the
    // next route (all "quantum" transfers require a user-gesture, thus the user
    // *must* do a click to do a vr transfer).
    let scene: any = document.querySelector('a-scene');
    let linkPosX = 0;

    switch(queryType) {
      case "queryAll": {
        linkPosX = 2
        break;
      }
      case "queryCurated": {
        linkPosX = -2
        break;
      }
    }

    /*
    let evtDetail = {}
    evtDetail['href'] = `vr-gallery/results-scene`
    // evtDetail['pos'] = new THREE.Vector3(0, -2, 0)
    evtDetail['pos'] = new THREE.Vector3(linkPosX, -4, 0)
    evtDetail['title'] = "View Results";
    let appPrefix = this.base.appPrefix
    let evt = new CustomEvent(`${appPrefix}_createlink`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_createlink`, true, true);
    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    scene.dispatchEvent(evt)
    */
    this.addResultsLink(new THREE.Vector3(linkPosX, -4, 0));

    // and finally, transfer to it
    // this.transferToResultsScene();
  }

  // put the selected example data onto to sessionStorage.
  aggregateResults(data) {
    let example = {}

    // example['id'] = data.id;
    // some merge queries in rails can have two ids (since the two tables each
    // have an id), and the example table id is qualified as 'example_id', so
    // get that if available, otherwise go with the default of 'id'.
    example['id'] = data.example_id || data.id;
    example['name'] = data.name
    example['pos'] = data.pos

    // this.exampleResults.push(example)
    // add a new entry in the exampleResults
    this.exampleResults[data.id] = example

    // We have to use sessionStorage to transfer data among routes, because a
    // pure a-frame link is more of a pure DOM transfer and is kind of out reach
    // of the NG environment, thus NG injects new services into the
    // transferred-to component instead of the existing one.

    // we put the exampleResults on anew for each example, basically overlaying the old.
    // A little redundant.
    // sessionStorage.setItem(`${this.base.appPrefix}_querySelectResults`, JSON.stringify(this.exampleResults));

  }

  // dynamically add link.  We don't want to create an "<a-link>" but an
  // <entity link="blah">, so we get more control over the "on" action.
  addResultsLink(linkPos) {
    console.log(`QuerySelectComponent.addResultsLink: now creating link`);
    let linkParentEl = document.querySelector('#links');
    let linkEl = document.createElement('a-entity');

    let linkAttributes = "";
    let href = `vr-gallery/results-scene`;
    linkAttributes += `href: ${href};`;
    linkAttributes += ` on: no-click;`
    linkAttributes += ` title: View Results;`;
    // let imgRoot = data['name'].replace(/\.html$/, '');
    // linkAttributes += ` image: #${imgRoot}-thumb;`;
    linkAttributes += ` peekMode: "true";`
    linkEl.setAttribute('link', linkAttributes);
    linkEl.setAttribute('position', `${linkPos.x} ${linkPos.y} ${linkPos.z}`);
    // linkEl.setAttribute('id', `${imgRoot}-link`);
    // add in the rails example_id, so event handler can update stats
    // let example_id = data.id;
    // linkEl.setAttribute('example_id', example_id);
    // evtDetail['image'] = `#${imgRoot}-thumb`;
    // linkEl.setAttribute('image', `#${imgRoot}-thumb`);
    // disable the system 'on' event handler
    // linkEl.setAttribute('on', 'no-click');
    // and define our own click handler (so we can increment stats before xferring)
    /*
    function sequenceSubscriber(observer) {
      // synchronously deliver 1, 2, and 3, then complete
      // observer.next(1);
      // observer.next(2);
      // observer.next(3);
      // observer.complete();
      let keys = Object.keys(this.exampleResults);
      for (let i=0; i < keys.length; i++) {
        let example = this.exampleResults[keys[i]];
        this.examples.incExampleStat(example.id, "impressions")
          .subscribe(rsp => {
            console.log(`click: stats now updated`);
          },
          (err) => {console.log(`ResultsSceneComponent.addResultsLink: err=${err.message}`)},
          // the finally block.. transfer in all cases, even if stats *not* updated
          () => { (window as any).location= href}
        )
      }

      // unsubscribe function doesn't need to do anything in this
      // because values are delivered synchronously
      return {unsubscribe() {}};
    }
    const sequence = new Observable(sequenceSubscriber);
    */
    linkEl.addEventListener('click', (evt) => {
      console.log(`addResultsLink: now in user click handler`);
      // note: we just use a closure to specify the example_id instead of reading
      // the attribute since we have one event handler per link anyway.
      // increment impressions only on the click event, in case they change their
      // minds and click on the scene again to generate a different query or new query.
      let statUpdateCnt = 0;
      let keys = Object.keys(this.exampleResults);
      for (let i=0; i < keys.length; i++) {
        let example = this.exampleResults[keys[i]];
        this.examples.incExampleStat(example.id, "impressions")
          .subscribe(rsp => {
            console.log(`click: stats now updated, statUpdateCnt=${statUpdateCnt}`);
            statUpdateCnt++;

            // transfer to the results page after all examples have been updated.
            if (statUpdateCnt == keys.length) {
              (window as any).location= href
            }
          },
        (err) => {console.log(`ResultsSceneComponent.addResultsLink: err=${err.message}`)},
        // the finally block.. transfer in all cases, even if stats *not* updated
        // () => { (window as any).location= href}
      )
    }
    });
    //
    linkParentEl.appendChild(linkEl);

  }

  // Unfortunately, this does not invoke a user-gesture, thus if you transfer
  // with this you will lose the vr state.
  transferToResultsScene() {
    this.router.navigateByUrl('vr-gallery/results-scene');
  }

  onHelpHoverEnter(evt: Event) {
    let handHelpEl = document.querySelector("#hand-overview-chart");
    handHelpEl.setAttribute("visible","true");
    // (evt.target as any).setAttribute("visible","true");
    // debugger;
  }

  onHelpHoverExit(evt: Event) {
    let handHelpEl = document.querySelector("#hand-overview-chart");
    handHelpEl.setAttribute("visible","false");
    // (evt.target as any).setAttribute("visible","true");
  }

  dummyClick(evt: Event) {
    console.log(`QuerySelectComponent.dummyClick: entered`);
    // setTimeout(function(){ (window as any).location = "https://www.yahoo.com"; }, 3000);
    this.examples.incExampleStat(16, "clicks");
  }


}
