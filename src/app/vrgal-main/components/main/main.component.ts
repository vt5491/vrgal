import { Component, OnInit, Renderer2, } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { CounterActions, RuntimeActions } from '../../../store/app.actions';
import {IAppState} from "../../../store/store";
import { IQueryResult } from '../../../store/runtime-reducer';

import { CoreBaseService } from '../../../core/services/core-base.service';
import { CoreUtilsService } from '../../../core/services/core-utils.service';
import { QuerySubComponent } from '../query-sub/query-sub.component';
import { ResultSubComponent } from '../result-sub/result-sub.component';
import { ConfigPanelComponent } from '../config-panel/config-panel.component';
import { ConfigActions } from '../../../store/app.actions';

const { version: appVersion } = require('../../../../../package.json')
// import { environment } from '../../environments/environment';


@Component({
  providers: [ResultSubComponent, ConfigPanelComponent],
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
    // private configPanelComponent : ConfigPanelComponent,
    private renderer: Renderer2,
    private configActions : ConfigActions,
  ) {
  }

  ngOnInit() {
    let bgMusicAssetEl = document.querySelector('#bg-music-chill');
    // bgMusicAssetEl.addEventListener('load', (evt) => {
    bgMusicAssetEl.addEventListener('play', (evt) => {
      console.log(`MainComponent.bgSoundInit: bgMusicAssetEl sound has been loaded`);
      this.initBgMusic();
    })
    let bgMusicEl = document.querySelector('#bg-music');
    bgMusicEl.addEventListener('loaded', (evt) => {
      console.log(`MainComponent.bgSoundInit: bgMusicEl sound has been loaded`);
      // this.initBgMusic();
      setTimeout(() => {this.initBgMusic()}, 2000);
    })
    document.querySelector('a-scene')
      .addEventListener('loaded', this.initScene.bind(this))
  }

  initScene() {
    // let bgMusicAssetEl = document.querySelector('#bg-music-chill');
    // bgMusicAssetEl.addEventListener('error', (evt) => {
    // // bgMusicEl.addEventListener('timeout', (evt) => {
    //   console.log(`MainComponent.bgSoundInit: sound has been loaded`);
    //   this.initBgMusic();
    // })
    // this.initBgMusic();
    // let sceneEl = document.querySelector('a-scene');
    // let bgMusicEl = document.querySelector('#bg-music-chill');
    // console.log(`MainComponent.initScene: setting sound event listener`);
    // let assetsEl = document.querySelector('a-assets');
    // let fl = (assetsEl as any).fileLoader
    // fl.onLoad = (arg) => {
    //   console.log(`asset loaded: ${arg}`);
    // }
    // let bgMusicAssetEl = document.querySelector('#bg-music-chill');
    // let bgMusicEl = document.querySelector('#bg-music');
    // // bgMusicEl.addEventListener('loaded', (evt) => {
    // // bgMusicAssetEl.addEventListener('loaded', (evt) => {
    // bgMusicAssetEl.addEventListener('load', (evt) => {
    // // bgMusicEl.addEventListener('timeout', (evt) => {
    //   console.log(`CoreUtils.bgSoundInit: sound has been loaded`);
    //   this.initBgMusic();
    // })
    // yes, a hack to do it based on time.  But using 'load', 'loaded' et al.
    // events, I just can't get this to drive.  So just go with this for now.
    setTimeout(() => {this.initBgMusic()}, 3000);
    // this.initBgMusic();
    // let bgMusicEl = document.querySelector('#bg-music');
    // bgMusicEl.addEventListener('loaded', (evt) => {
    //   console.log(`MainComponent.bgSoundInit: bgMusicEl sound has been loaded`);
    //   // this.initBgMusic();
    //   setTimeout(() => {this.initBgMusic()}, 2000);
    // })

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
    console.log(`MainComponent.initScene: appVersion=${appVersion}`);
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

  // turn off bg music if the config-panel has it set to 'off'
  initBgMusic() {
    let state=this.ngRedux.getState();
    console.log(`MainComponent.initBgMusic: state.config.bgMusicOn=${state.config.bgMusicOn}`)
    // this.configPanelComponent.toggleBgMusicState();
    // this.utils.toggleBgMusicState();
    // debugger;
    let bgMusicEl: any = document.querySelector('#bg-music');
    // debugger;
    if(bgMusicEl.components && bgMusicEl.components.sound) {
      // just make sure sound is synced to state
      switch(state.config.bgMusicOn) {
        case true:
        {
          console.log(`initBgMusic: setting on`);
          // this.ngRedux.dispatch(this.configActions.bgMusicOn());
          bgMusicEl.components.sound.playSound();
          break;
        }
        case false:
        {
          console.log(`initBgMusic: setting off`);
          // this.ngRedux.dispatch(this.configActions.bgMusicOff());
          bgMusicEl.components.sound.pauseSound();
          break;
        }

        default:
        // this.ngRedux.dispatch(this.configActions.bgMusicOn());

      }
    }
  }

}
