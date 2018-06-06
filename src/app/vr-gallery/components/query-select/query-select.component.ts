import { Component, OnInit, OnDestroy, Renderer2, } from '@angular/core';
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
import { NgRedux } from '@angular-redux/store';
import { CounterActions } from '../../../store/app.actions';
import {IAppState} from "../../../store/store";
import { select } from '@angular-redux/store';
// import THREE from "THREE";
// declare var THREE: any;
import * as THREE from "three";
// import * as AFRAME from "AFRAME";
// declare var AFRAME: any;
import {Router} from '@angular/router';
import { debug } from 'util';
import { ConfigPanelComponent } from '../../../vr-gallery/components/config-panel/config-panel.component';
declare var dat: any;

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
  exampleResults : Object = {};
  sceneEl : Element;
  count: number;
  @select() count2$;
  count2 : number;
  // @select('count').subscribe(newCount => this.count_vt= newCount)
  // @select('count') subscribe(newCount => this.count_vt= newCount)
  // @select('count') count$;
  // @select(state => state.count) count_vt;
  // @select(state => {this.count_vt = state.count});
  // my_f = (val) => {this.count_vt = val};
  // @select(state => state.count) my_f;
  // @select(newCount => )
  stateSubscription;
  configPanel: ConfigPanelComponent;

  constructor(
    private http: HttpClient,
    private base: CoreBaseService,
    private utils: CoreUtilsService,
    private router: Router,
    private examples: ExamplesService,
    private ngRedux: NgRedux<IAppState>,
    private actions: CounterActions,
    private renderer: Renderer2,
    // injecting ConfigPanelComponent does not work for some reason
    // private configPanel: ConfigPanelComponent,
  ) {
    console.log('QuerySelectComponent.ctor: entered');
    //TODO: rename base.vrizeSvcUrl to somehting like 'db-server' or
    // 'meta-data-server'
    console.log(`QuerySelectComponent.ctor: base.vrizeSvcUrl=${base.vrizeSvcUrl}`);
    this.stateSubscription = ngRedux.select<number>('count')
      .subscribe(newCount => this.count = newCount);

    this.count2$.subscribe(newCount => this.count2 = newCount);
    let globalngDoCheck = this.renderer.listen('document', 'ngDoCheck', (evt) => {
      console.log(`QuerySelectComponent.ctor: ngDoCheck triggered`);
    })
    console.log(`QuerySelectComponent.ctor now setting up ngAfterViewInit listener`)
    let globalAfterViewInit = this.renderer.listen('document', 'ngAfterViewInit', (evt) => {
      console.log(`QuerySelectComponent.ctor: ngAfterViewInit triggered`);
    })

    this.configPanel = new ConfigPanelComponent(this.utils, this.renderer);

  }

  ngOnInit() {
    console.log(`QuerySelectComponent.ngOnInit: count=${this.count}`)
    console.log(`QuerySelectComponent.ngOnInit: count2=${this.count2}`)
    document.querySelector('a-scene')
      .addEventListener('loaded', this.init.bind(this))

    let hookEl = document.querySelector('#config-panel-hook');
    let newEl = this.configPanel.createEl();
    // hookEl.appendChild(newEl);
    this.renderer.appendChild(hookEl, newEl)
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
  }

  // ngOnChanges() {
  //   console.log(`QuerySelectComponent.ngOnchanges: entered`)
  // }
  //
  // ngDoCheck() {
  //   console.log(`QuerySelectComponent.ngDoCheck: entered`)
  // }

  ngAfterViewInit() {
    console.log(`QuerySelectComponent.ngAfterViewInit: entered`)
    // let vrgalConfigEl = document.querySelector('#vrgal-config');
    let vrgalConfigEl = document.querySelector('vrgal-config');

    console.log(`QuerySelectComponent.ngAfterViewInit: vrgalConfigEl=${vrgalConfigEl}`);
    // document.querySelector('a-scene')
    //   .addEventListener('loaded', this.init.bind(this))
    if( vrgalConfigEl) {
      setTimeout(
        () => {
          console.log(`QuerySelectComponent.ngAfterViewInit: now replacing vrgalConfigEl after delay`);
          // debugger;
          // let vrgalConfigParentEl = vrgalConfigEl.parentElement;
          // // vrgalConfigParent.replaceChild(vrgalConfigEl, vrgalConfigEl);
          // let removedEl = vrgalConfigParentEl.removeChild(vrgalConfigEl);
          //
          // // and re-insert so we trigger a-frame to add to the scene
          // // vrgalConfigParent.appendChild(removedEl);
          // vrgalConfigParentEl.appendChild(vrgalConfigEl);

          // manually re-insert a test element
          let linkParentEl = document.querySelector('#links');
          let linkEl = document.createElement('a-entity');
          let linkAttributes = "";
          let href = `vr-gallery/results-scene`;
          // let href = `vr-gallery/results-scene?ng_routed=1`;
          linkAttributes += `href: ${href};`;
          linkAttributes += ` on: no-click;`
          linkAttributes += ` title: View Results;`;
          linkAttributes += ` peekMode: "true";`
          linkEl.setAttribute('link', linkAttributes);
          linkEl.setAttribute('position', `${4} ${-5.5} ${0}`);

          linkParentEl.appendChild(linkEl);

          let vrgalConfigEl = document.querySelector('vrgal-config');
          // let vrgalConfigEl = document.getElementById('vrgal-config');
          let clone = vrgalConfigEl.cloneNode( true);
          // clone.setAttribute('position', "1 1 0");
          // linkParentEl.appendChild(vrgalConfigEl);
          linkParentEl.appendChild(clone);
          // let guiEl = document.createElement('a-gui-radio');
          let guiEl = document.createElement('a-entity');
          let guiAttr = " title: togo";
          guiEl.setAttribute('link', guiAttr);
          guiEl.setAttribute('id', 'man-gui');
          // guiEl.setAttribute("width", "3");
          // guiEl.setAttribute("height", "0.75");
          // guiEl.setAttribute("value", "togo");

          linkParentEl.appendChild(guiEl);

        }, 3000
      );
    }
  }

  init() {
    console.log(`QuerySelectComponent.init: entered`)
    let scene: any = document.querySelector('a-scene');
    this.sceneEl = scene;
    let sceneObj  = scene.object3D;
    let allBox: any = document.querySelector('#all-query');

    this.utils.bgSoundInit(this.sceneEl, document.getElementById('bg-music-radio'));
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
    httpParams = httpParams.append('col', 'lift_code');
    let lf_codes = ['-2'];
    lf_codes.forEach(lfc => {
      httpParams = httpParams.append('in[]', lfc);
    });

    let headers = new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'http://localhost:4200'
      'Content-Type': 'application/json'
    })

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
    // this.queryDummy();
    if (Object.keys(this.exampleResults).length > 0) {
      this.resetState();
    }
    else {
      try {
        this.examples.get(`${this.base.vrizeSvcUrl}/examples/all_curated.json`)
        .subscribe(
          data => {this.processResults((data as any).examples, "queryCurated")},
          err => {console.log(`err=${err.message}`);
        });
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
          .subscribe(
            data => {this.processResults((data as any).examples, "queryAll")},
            err => {console.log(`queryAll:err=${err.message}`);
        });
      }
      catch (e) {
        console.log(`QuerySelectComponent.queryAll: e=${e}`);
      }
    }
  }

  // query 'dummy/abc' for debugging purposes
  queryDummy() {
    this.http.get(`${this.base.vrizeSvcUrl}/dummy/abc.json`)
      .subscribe(rsp => {
        console.log(`queryDummy: rsp=${rsp}, abc=${rsp["abc"]}`)
      })
  }

  // process a  many rowed result
  processResults(data, queryType) {
    let grid : any = this.utils.gridicize(data.length, 1.25);
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

      xPos += elemWidth;

      if ((i + 1) % cols  == 0) {
        xPos = leftPosX;
        yPos -= elemHeight;
      }
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
    // let href = `vr-gallery/results-scene?ng_routed=1`;
    linkAttributes += `href: ${href};`;
    linkAttributes += ` on: no-click;`
    linkAttributes += ` title: View Results;`;
    linkAttributes += ` peekMode: "true";`
    linkEl.setAttribute('link', linkAttributes);
    linkEl.setAttribute('position', `${linkPos.x} ${linkPos.y} ${linkPos.z}`);

    let that = this;
    linkEl.addEventListener('click', (evt) => {
      console.log(`addResultsLink: now in user click handler`);
      console.log(`addResultsLink: now incrementing count`);
      // debugger;
      that.ngRedux.dispatch(that.actions.increment());
      // that.ngRedux.
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
              // (window as any).location= href
              // debugger;
              // that.router.navigate([(evt.target as any).previousSibling.getAttribute('link').href, {}])
              // that.router.navigate([(evt.target as any).getAttribute('link').href, {}])
              // indicate we came from angular
              sessionStorage.setItem(`${this.base.appPrefix}-ngRouted`, "1");
              that.router.navigate([
                (evt.target as any).getAttribute('link').href,
                // {queryParams: { ng-routed: '1' }}])
                { ngRouted: '1' }])
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
    this.utils.saveAppState(this.ngRedux);
    // setTimeout(function(){ (window as any).location = "https://www.yahoo.com"; }, 3000);
    // this.examples.incExampleStat(16, "clicks");
    // (window as any).location = "https://192.168.50.158:4200/assets/threejs-env/examples/vrize-webgl_morphtargets_horse.html";
    // this.router.navigate(["https://192.168.50.158:4200/assets/threejs-env/examples/vrize-webgl_morphtargets_horse.html", {}])
    // try {
    //   console.log(`now xferring to horise`);
    //   this.utils.saveAppState(this.ngRedux);
    //   (window as any).location = "https://192.168.50.158:4200/assets/threejs-env/examples/vrize-webgl_morphtargets_horse.html";
    //   // this.router.navigate(["assets/threejs-env/examples/vrize-webgl_morphtargets_horse.html", {}])
    //   // this.router.navigateByUrl("https://192.168.50.158:4200/assets/threejs-env/examples/vrize-webgl_morphtargets_horse.html")
    //   // this.router.navigateByUrl("/assets/threejs-env/examples/vrize-webgl_morphtargets_horse.html")
    //   // this.router.navigateByUrl("assets/threejs-env/examples/vrize-webgl_morphtargets_horse.html")
    // }
    // catch(error) {
    //   console.log(`dummyClick: error=${error}`);
    // }
  }

  dummyClick2(evt: Event) {
    this.utils.restoreAppState(this.ngRedux, this.actions);
  }

  dummyClick3(evt: Event) {
    this.ngRedux.dispatch(this.actions.increment());
    console.log(`QuerySelectComponent.dummyClick3: count=${this.count}, count2=${this.count2}`)
  }

 // toggleBgMusic(evt: Event) {
 //   this.utils.toggleSound(document.querySelector('#bg-music'));
 // }


}
