import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ConfigActions } from '../../../store/app.actions';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.css']
})
export class ConfigPanelComponent implements OnInit {

  constructor(
    private ngRedux: NgRedux<any>,
    private configActions : ConfigActions,
  ) { }

  ngOnInit() {
    let bgMusicEl = document.getElementById('bg-music-radio');
    console.log(`ConfigPanelComponent.ngOnInit: pre bgMusicEl.checked=${bgMusicEl.getAttribute('checked')}`);
    document.getElementById('bg-music-radio').setAttribute('checked', "true");
    // bgMusicEl.emit('click');
    // bgMusicEl.dispatchEvent(new Event('no-click'));
    document.querySelector('a-scene').addEventListener('loaded', () => {
      // debugger;
      bgMusicEl.dispatchEvent(new CustomEvent('click', { detail: {intersection: 1}}));
    })
    bgMusicEl.dispatchEvent(new Event('click'));
    // document.dispatchEvent(new Event('no-click'));
    console.log(`ConfigPanelComponent.ngOnInit: post bgMusicEl.checked=${bgMusicEl.getAttribute('checked')}`);
  }

  toggleBgMusic(evt: Event) {
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
  }


}
