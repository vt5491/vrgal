import { Component, OnInit, Renderer2, } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { CounterActions, RuntimeActions } from '../../../store/app.actions';
import {IAppState} from "../../../store/store";
import { IQueryResult } from '../../../store/runtime-reducer';

import { CoreBaseService } from '../../../core/services/core-base.service';
import { CoreUtilsService } from '../../../core/services/core-utils.service';
import { QuerySubComponent } from '../query-sub/query-sub.component';
import { ResultSubComponent } from '../result-sub/result-sub.component';


@Component({
  providers: [ResultSubComponent],
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private base: CoreBaseService,
    private utils: CoreUtilsService,
    private ngRedux: NgRedux<IAppState>,
    // private ngRedux: NgRedux<any>,
    private counterActions: CounterActions,
    private runtimeActions: RuntimeActions,
    private resultSubComponent : ResultSubComponent,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    document.querySelector('a-scene')
      .addEventListener('loaded', this.initScene.bind(this))
  }

  initScene() {
    let resultScene = document.querySelector('app-result-sub');
    resultScene.setAttribute('visible', 'false');

    // this is done in app.module.ts
    // re-hydrate the ngredux store, if any
    // if(sessionStorage.getItem(`${this.base.appPrefix}_appState`)) {
    //   debugger;
    //   // let lastQuery = JSON.parse(this.ngRedux.getState().runtime.lastQuery);
    //   let appState = JSON.parse(sessionStorage.getItem(`${this.base.appPrefix}_appState`));
    //   let lastQuery = appState.runtime.lastQuery;
    //   if (lastQuery) {
    //     this.ngRedux.dispatch(this.runtimeActions.setLastQuery(lastQuery));
    //   }
    // }

    // debugger;
    let lastRoute = this.ngRedux.getState().runtime.lastRoute;
    let runtime = this.ngRedux.getState().runtime;
    let lastQueryType = null;
    if( runtime.lastQuery && runtime.lastQuery.queryType) {
      lastQueryType = runtime.lastQuery.queryType;
    }
    console.log(`MainComponent.initScene: lastRoute=${lastRoute}, lastQueryType=${lastQueryType}`);
    if (lastRoute && lastRoute  === "result-sub") {
      // this.resultSubComponent.queryGenResult({queryType: "curated"})
      this.resultSubComponent.queryGenResult({queryType: lastQueryType})
      // this.toggleSubScenes(null);
    }
    else {
      // restore the base position of the config panel
      let configPanelEl = document.querySelector('app-config-panel');
      this.renderer.setAttribute(configPanelEl, 'position',`0 0 0`);
    }
  }

  // showResults(evt: Event) {
  //   let sceneEl = document.querySelector('a-scene');
  //
  //   let appResultSubEl = document.createElement('app-result-sub');
  //   sceneEl.appendChild(appResultSubEl);
  //
  //   this.utils.toggleSubScenes();
  //
  // }

  toggleSubScenes(evt: Event) {
    this.utils.toggleSubScenes();
  }

  persistStore(evt) {
    // debugger;
    this.ngRedux.dispatch(this.counterActions.increment());
    this.ngRedux.dispatch(this.counterActions.increment());
    // sessionStorage.setItem(`${this.base.appPrefix}_store`, JSON.stringify(this.ngRedux.getState() as any));
    // this.utils.persistStore(this.ngRedux);
    this.utils.saveAppState(this.ngRedux);

  }

  // setLastQuery(evt) {
  //   console.log(`MainComponent.setLastQuery: entered`);
  //   // debugger;
  //   // this.ngRedux.dispatch(this.runtimeActions.bgMusicOn());
  //   // let lastQuery : IQueryResult = {
  //   //   queryType: 'abc',
  //   //   data: [{a: 7, b: "hi"}],
  //   // }
  //   let lastQuery : IQueryResult = {
  //     queryType: 'curated',
  //     data: [{
  //       id: 1,
  //       lift_score: 100,
  //       name: "webgl_mirror.html",
  //       tag: "mini-gal" ,
  //     }],
  //   }
  //   this.ngRedux.dispatch(this.runtimeActions.setLastQuery(lastQuery));
  //
  // }
  //
  // setLastRoute(evt) {
  //   console.log(`MainComponent.setLastQuery: entered`);
  //
  //   // debugger;
  //   this.ngRedux.dispatch(this.runtimeActions.setLastRoute("abc"));
  // }
  subSceneChange(evt: CustomEvent) {
    console.log(`MainComponent.subSceneChange: evt.detail.old=${evt.detail.old}, evt.detail.new=${evt.detail.new}`);

    if(evt.detail.new === 'query-sub') {
      // restore the base position of the config panel
      let configPanelEl = document.querySelector('app-config-panel');
      this.renderer.setAttribute(configPanelEl, 'position',`0 0 0`);

      let helpPanelEl = document.querySelector('app-help-panel');
      this.renderer.setAttribute(helpPanelEl, 'position',`0 -0.5 0`);
    }
  }

}
