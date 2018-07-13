import { Injectable, EventEmitter, Output, } from '@angular/core';
import { CoreBaseService } from './core-base.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
import { takeWhile, takeUntil, first } from 'rxjs/operators'
import { NgRedux } from '@angular-redux/store';
import {IAppState} from "../../store/store";
import { ConfigActions } from '../../store/app.actions';


import * as THREE from "three";
@Injectable()
export class CoreUtilsService {
  @Output() subSceneChange = new EventEmitter();

  // This is used for transferring data between components.  Add a component specific
  // key, so you don't conflict with other components in case they're using this too.
  dataStore : {}

  constructor(
    private base: CoreBaseService,
    private http: HttpClient,
    private ngRedux: NgRedux<IAppState>,
    private configActions : ConfigActions,
  ) {
    console.log(`CoreUtilsService.ctor: entered`);
    this.dataStore = {}
  }

  // don't use this for two reasons:
  // 1) a method to read examples belongs in 'examples.service'
  // 2) It introduces a dependency on the express server (port 3002).
  // Get request can be performed by the NG spa itself, and does not require
  // a node server (only posts, puts, and patches do)
  // getExampleObservable(apiURL: string) {
  //   try {
  //     return this.http.get(apiURL, {})
  //       .map(res => {
  //         let result = res;

  //         return result;
  //       });
  //   }
  //   catch(e) {
  //     console.log(`try-catch-1: e=${e}`);
  //   }
  // }

  getLiftedExample(fn: string) {
    let fp = `${this.base.examplesPath}/${this.base.liftPrefix}${fn}.html`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain',
      })
    };

    // return this.http.get(fp, httpOptions);
    return this.http.get(fp, {responseType: "text"});
  }
  // input is the root of the example name e.g. 'myExample.html'.  We will
  // generate the fully qualified path.
  // Note: this attempts to use native javascript 'FileReader' function, but I
  // think it only reads file on the client?  I think I need to use http get
  // to get the file on the server.
  getLiftedExample2(fn: string) {
    // let result = new Blob();
    let fp = `${this.base.examplesPath}/${this.base.liftPrefix}${fn}.html`;
    console.log(`getLiftedExample: fp=${fp}`);

    // let file = new File({fileName: fp});
    let file = new File([], fp);
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      console.log(`getLiftedExample.load: result=${reader.result}`);

      // debugger;
      // result.src = reader.result;
    }, false);

    if (fp) {
      reader.readAsText(file);
    }

  }

  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  // Given an element count and widthScaleFactor, return an object with the rows
  // and cols to fit the elements.  For example 100 elements with  a widthFactor
  // of 1.2 should return cols=12, rows = 9 (you need 9 rows of a 12-col tuple
  // to accomodate 100 elements such that the width is approximatley 20% wider
  // than it is higher).
  gridicize(elemCnt, widthFactor) {
    let result = {};
    let rows, cols : number;

    // start with a square grid
    rows = Math.sqrt(elemCnt);
    cols = rows;

    // and stretch to the width factor
    cols *= widthFactor;
    rows /= widthFactor;

    // integer-ize
    rows = Math.round(rows);
    cols = Math.round(cols);

    // simple hack: if we don't have enough slots, add a row.
    if (rows * cols < elemCnt) {
      rows++;
    }

    result['rows'] = rows;
    result['cols'] = cols;

    return result;
  }

  toggleVisibility(el) {
    let elVisibility = el.getAttribute("visible");
    el.setAttribute("visible", String(!elVisibility));
  };

  toggleSound(el) {
    debugger;
    if (el.components.sound.isPlaying) {
      el.components.sound.pauseSound();
    }
    else {
      el.components.sound.playSound();
    }
  }

  // Try to handle a standard background setup such that we can define it one
  // place and not have to implement it at the component level.
  // The ctrlEl is the gui widget used to control the background music.
  bgSoundInit(sceneEl: Element, guiEl: Element) {
    sceneEl.addEventListener('sound-loaded', (evt) => {
      console.log(`CoreUtils.bgSoundInit: sound has been loaded`);
      this.toggleRadio(guiEl.id);
    })

  }

  // This is a complete hack to deal with limitations of 'aframe-gui'.
  // 'aframe-gui' does not honor the 'checked' attribute, so we have to manually
  // eject  an 'emit(radioAction)' upon sound loading.  This was all empirically
  // determined, and is really not a general solution.
  toggleRadio(animationId) {
    // get all 'a-animations'
    // note: a-radio has four animations, and a-toggle has two, with no official
    // way to distinguish between them.
    let animations = document.getElementsByTagName('a-animation');
    // debugger;

    // the third parent up for 'gui-radio' has the element id the animation
    // belongs to.  We use this  to determine if we have the right element
    // do {
    // }
    // while (condition);
    // let animationIdx = 0;
    // while (animations[animationIdx].parentElement.parentElement.parentElement.id !== animationId)
    // {
    //   animationIdx++;
    // }
    let foundAnimation = false;
    let i;
    for( i=0; i < animations.length; i++) {
      if (animations[i].parentElement.parentElement.parentElement.id === animationId)
      {
        foundAnimation = true;
        break;
      }
    }

    if (foundAnimation) {
      // simulate a physical click by kicking off the gui-radio's first 'a-animation'
      (animations[i] as any).emit('radioAnimation');
    }
  }

  /*
  Jesus...what was I thinking on this.  Replaced by much easier implementation.
  ..see 'saveAppState' further down in the code.
  // save ng-redux state on session storage
  // This is hopefully just a temporary solution until I can figure out
  // 'redux-persist' and how it integrates into 'ng-redux'
  saveAppState(store : NgRedux<IAppState>){
    // debugger;
    // sessionStorage.setItem
    let keys = Object.keys(store.getState());

    let storageKey = `${this.base.appPrefix}-appState`;
    let storageObj = {};

    for (let i=0; i < keys.length; i++) {

      // storageObj[keys[i]] = store.select(keys[i]);
      let key = keys[i];
      // let keyDone = false;
      let saveAppStateObservable = store.select(key).pipe(first());
      // let saveAppStateObservable = takeUntil(store.select(key));
      // let saveAppStateObservable = store.select(key).pipe(takeUntil(keyDone));
      // const myObserver = {
      //   next: x => console.log('Observer got a next value: ' + x),
      //   error: err => console.error('Observer got an error: ' + err),
      //   complete: () => console.log('Observer got a complete notification'),
      // };
      let saveKeySubscription;
      let saveAppStateObserver = {
        next: val => {
            storageObj[key] = val;
            console.log(`saveAppState: val=${val}, storageObj=%o`, storageObj);

            // Once we've done all keys, persist to sessionStorage.
            if (Object.keys(storageObj).length === keys.length) {
              sessionStorage.setItem(storageKey, JSON.stringify(storageObj))
              // sessionStorage.setItem(storageKey, JSON.stringify({count: 20}));
              // saveKeySubscription.unsubscribe();
            }
            // keyDone = true;
          },
        error: err => console.log(`saveAppState err=${err}`),
        complete: () => console.log(`saveAppState: completed`)
      };
        saveKeySubscription = saveAppStateObservable
          .subscribe(saveAppStateObserver)
      }

      // let saveAppStateSub = store.select(key)
        // .subscribe(
        //   val => {
        //     storageObj[key] = val;
        //     console.log(`saveAppState: val=${val}, storageObj=%o`, storageObj);
        //
        //     // Once we've done all keys, persist to sessionStorage.
        //     if (Object.keys(storageObj).length === keys.length) {
        //       // var copy = Object.assign({}, storageObj);
        //       // sessionStorage.setItem(storageKey, JSON.stringify(copy))
        //       sessionStorage.setItem(storageKey, JSON.stringify(storageObj))
        //       // sessionStorage.setItem(storageKey, JSON.stringify({count: 20}));
        //     }
        //   },
        //   error => console.log("Error: ", error),
        //   // complete() {console.log(`done`)}
        //   // () => { console.log(`saveAppState: now in finally`);  }
        // )
    // }
  }

  restoreAppState(store : NgRedux<IAppState>, actionObj) {
    let storageKey = `${this.base.appPrefix}-appState`;
    let storageObj = JSON.parse(sessionStorage.getItem(storageKey));
    console.log(`Utils.restoreAppState: storageObj[count]=${storageObj.count}`)

    let keys = Object.keys(storageObj);

    for (let i=0; i < keys.length; i++) {
      // debugger;
      store.dispatch(actionObj.set( storageObj[keys[i]]))
      // store.dispatch(actionObj.set(15))
    }
  }
  */


  toggleSubScenes() {
    console.log(`CoreUtils.toggleSubScenes: entered`);
    let sceneEl = document.querySelector('a-scene');
    let queryScene = document.querySelector('app-query-sub');
    let resultScene = document.querySelector('app-result-sub');

    let querySceneVisible : any= queryScene.getAttribute('visible');
    let resultSceneVisible : any= resultScene.getAttribute('visible');

    queryScene.setAttribute('visible', querySceneVisible ? 'false' : 'true');
    resultScene.setAttribute('visible', resultSceneVisible ? 'false' : 'true');

    // this.ngRedux.dispatch(this.actions.increment());
    // let state=this.ngRedux.getState();
    // // debugger;
    // console.log(`MainComponent.toggleSubScenes: state.cr1.count=${state.cr1.count}, state.cr1.count2=${state.cr1.count2}`)
    // console.log(`MainComponent.toggleSubScenes: state.config.bgMusicOn=${state.config.bgMusicOn}`)
    // this.subSceneChange.emit("abc");
    let detail = {};

    // debugger;
    if (resultScene.getAttribute('visible')) {
      detail = {old: 'query-sub', new: 'result-sub'};
    }
    else{
      detail = {old: 'result-sub', new: 'query-sub'};
    }

    sceneEl.dispatchEvent(new CustomEvent('subSceneChange', {
      detail: detail,
      bubbles: true
    }));

  }

  // this is just kind of generic method that could be applied to any store
  persistStore(store) {
  // persistStore(store : NgRedux<IAppState>){
    sessionStorage.setItem(`${this.base.appPrefix}_store`, JSON.stringify(store.getState() as any));
  }

  // this is more specific to this particular app
  saveAppState(store : NgRedux<IAppState>) {
    sessionStorage.setItem(`${this.base.appPrefix}_appState`, JSON.stringify(store.getState() as any));
  }

  // We save some a-frame info outside of ngRedux, since it's not really
  // "purely" app level data.
  saveDollyState() {
    let scene = document.querySelector('a-scene');
    let dolly = scene.querySelector('#dolly');
    let dollyObj = (dolly as any).object3D;

    let dollyPos = dolly.getAttribute('position');
    sessionStorage.setItem(`${this.base.appPrefix}_lastDollyPos`, JSON.stringify(dollyPos));

    let dollyRot: any = {};
    // Note: Object3D rotation keys are physically stored as "_x, _y, _z", presumably
    // so the 'order' property can override.  There are wrapper "x", "y", and "z" methods
    // however.  Thus we need to set each "xyz" in lastDollyRot individually e.g
    // mass assignment will assign keys of "_x" etc.
    dollyRot.x = dollyObj.rotation.x;
    dollyRot.y = dollyObj.rotation.y;
    dollyRot.z = dollyObj.rotation.z;

    // console.log(`save-state.saveState: dollyRot.y=${dollyRot.y}`);
    sessionStorage.setItem(`${this.base.appPrefix}_lastDollyRot`, JSON.stringify(dollyRot));
  }

  // You have to be careful about referencing 'this.ngRedux' in callbacks, as you will
  // probably get a closure to an old version of the store object.  Thus we need to
  // always get the current copy.
  getCurrentNgRedux() {
    return this.ngRedux;
  }

  // originally implemented in configPanel.component
  toggleBgMusicState() {
    console.log(`CoreUtils.toggleBgMusic: entered`);
    let state=this.ngRedux.getState();
    console.log(`ConfigPanelComponent.toggleBgMusic: pre state.config.bgMusicOn=${state.config.bgMusicOn}`)

    switch(state.config.bgMusicOn) {
      case true:
      {
        console.log(`setting off`);
        this.ngRedux.dispatch(this.configActions.bgMusicOff());
        break;
      }
      case false:
      {
        console.log(`setting on`);
        this.ngRedux.dispatch(this.configActions.bgMusicOn());
        break;
      }

      default:
        this.ngRedux.dispatch(this.configActions.bgMusicOn());

    }
    // this.utils.toggleSound(document.querySelector('#bg-music'));
    state = this.ngRedux.getState();
    console.log(`ConfigPanelComponent.toggleBgMusic: post state.config.bgMusicOn=${state.config.bgMusicOn}`)

    // debugger;
    // console.log(`-->bgMusicOn2=${this.bgMusicOn2}`);
  }

}
