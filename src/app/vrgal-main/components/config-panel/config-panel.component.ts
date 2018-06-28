import { Component, OnInit, } from '@angular/core';
import { NgRedux, select, select$ } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { ConfigActions } from '../../../store/app.actions';
import { IAppState } from '../../../store/store'
import * as THREE from "three";

import { CoreBaseService } from '../../../core/services/core-base.service';
import { CoreUtilsService } from '../../../core/services/core-utils.service';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.css']
})
export class ConfigPanelComponent implements OnInit {

  // bgMusicOnSubscription;
  // @select('config.bgMusicOn') bgMusicOnSubscription2: Observable<boolean>;
  // bgMusicOn : boolean;
  @select(['config', 'bgMusicOn']) bgMusicOn$;

  constructor(
    private base: CoreBaseService,
    private utils: CoreUtilsService,
    // private ngRedux: NgRedux<any>,
    private ngRedux: NgRedux<IAppState>,
    private configActions : ConfigActions,
  ) {
    console.log(`ConfigPanel: now settig up subscription`);
    // debugger;
    // this.bgMusicOnSubscription = this.ngRedux.select<boolean>('config.bgMusicOn')
    // this.bgMusicOnSubscription = this.ngRedux.select<boolean>(['config', 'bgMusicOn'])
    // // this.bgMusicOnSubscription = this.ngRedux.select<boolean>('bgMusicOn')
    //   .subscribe(
    //     (bgMusicOnState) => {
    //       this.bgMusicOn = bgMusicOnState
    //       console.log(`ConfigPanel: new bgMusicOn state: ${this.bgMusicOn}`);
    //   });
    // @select(state => state.config.bgMusicOn) this.bgMusicOn;
    // this.bgMusicOn.subscribe((newState) => {
    //   // debugger;
    //   console.log(`---> bgMusicOn2 driven, newState=${newState}`)
    // })

    this.bgMusicOn$.subscribe(this.toggleBgMusic);
  }

  ngOnInit() {
    let bgMusicEl = document.getElementById('bg-music-radio');
    console.log(`ConfigPanelComponent.ngOnInit: pre bgMusicEl.checked=${bgMusicEl.getAttribute('checked')}`);
    document.getElementById('bg-music-radio').setAttribute('checked', "true");
    // bgMusicEl.emit('click');
    // bgMusicEl.dispatchEvent(new Event('no-click'));
    //TODO: go off of a query-selectory on the 'app-config-pane' load and see if this
    // eliminates the need for the timeout
    // document.querySelector('a-scene').addEventListener('loaded', () => {
    document.querySelector('app-config-panel').addEventListener('loaded', () => {
      // (bgMusicEl.getElementsByTagName('a-animation')[0] as any).emit('radioAnimation')
      // Note: you do need to do this wait.  AFAIK, there is no official 'gui-radio ready'
      // event.  gui-radio always starts off "off", so we need to flip on if 'checked' is
      // the default ('checked' attribute on <a-gui-radio> doesn't work properly on ng)

      // (bgMusicEl.getElementsByTagName('a-animation')[0] as any).emit('radioAnimation')
      window.setTimeout( () => {
      // console.log(`ConfigPanel: now setting button color`);
      // debugger;
      // (bgMusicEl.getAttribute('material') as any).color ='#ed5b21';
      // console.log(`ConfigPanel: now emmiting radioAnimation`);
      // (bgMusicEl as any).emit('radioAnimation');
      //comment this out if you want the bg music to default to 'off'
        (bgMusicEl.getElementsByTagName('a-animation')[0] as any).emit('radioAnimation')
      }, 1000 )
      // console.log(`ConfigPanel: now kicking off fake click`);
      // bgMusicEl.dispatchEvent(new CustomEvent('click',
      // { detail:
      //   {intersection: {point: new THREE.Vector3(-1.0779723726968995, 0.00246196904143081, 0.009999999776483472)} }}));
    })
    // bgMusicEl.dispatchEvent(new Event('click'));
    // document.dispatchEvent(new Event('no-click'));
    // console.log(`ConfigPanelComponent.ngOnInit: post bgMusicEl.checked=${bgMusicEl.getAttribute('checked')}`);
  }

  toggleBgMusicState(evt: Event) {
    console.log(`ConfigPanelComponent.toggleBgMusic: entered`);
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

  toggleBgMusic(newState) {
    console.log(`---> ControlPanel.toggleBgMusic: newState=${newState}`)
    // this.utils.toggleSound(document.querySelector('#bg-music'));
    let el : any = document.querySelector('#bg-music');
    // debugger;
    if(el) {
      if( el.components.sound.isPlaying) {
        console.log(`toggleBgMusic: pausing sound`)
        el.components.sound.pauseSound();
      }
      else {
        console.log(`toggleBgMusic: playing sound`)
        el.components.sound.playSound();
      }
    }

  }


}
