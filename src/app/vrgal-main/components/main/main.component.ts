import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { CounterActions } from '../../../store/app.actions';
import {IAppState} from "../../../store/store";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    // private ngRedux: NgRedux<IAppState>,
    private ngRedux: NgRedux<any>,
    private actions: CounterActions,
  ) { }

  ngOnInit() {
    document.querySelector('a-scene')
      .addEventListener('loaded', this.initScene.bind(this))
  }

  initScene() {
    let resultScene = document.querySelector('app-result-sub');
    resultScene.setAttribute('visible', 'false');
  }

  toggleSubScenes(evt: Event) {
    console.log(`MainComponent.toggleSubScenes: entered`);
    // let ssa = document.querySelector('app-sub-scene-a'); let ssb = document.querySelector('app-sub-scene-b');
    // let ssaVisible : any= ssa.getAttribute('visible');
    // let ssbVisible : any= ssb.getAttribute('visible');
    //
    // ssa.setAttribute('visible', ssaVisible ? 'false' : 'true');
    // ssb.setAttribute('visible', ssbVisible ? 'false' : 'true');
    let queryScene = document.querySelector('app-query-sub');
    let resultScene = document.querySelector('app-result-sub');

    let querySceneVisible : any= queryScene.getAttribute('visible');
    let resultSceneVisible : any= resultScene.getAttribute('visible');

    queryScene.setAttribute('visible', querySceneVisible ? 'false' : 'true');
    resultScene.setAttribute('visible', resultSceneVisible ? 'false' : 'true');

    this.ngRedux.dispatch(this.actions.increment());
    let state=this.ngRedux.getState();
    // debugger;
    console.log(`MainComponent.toggleSubScenes: state.cr1.count=${state.cr1.count}, state.cr1.count2=${state.cr1.count2}`)
    console.log(`MainComponent.toggleSubScenes: state.config.bgMusicOn=${state.config.bgMusicOn}`)

  }

}
