import { Component, OnInit, Renderer2 } from '@angular/core';
import { CoreUtilsService } from '../../../core/services/core-utils.service';

@Component({
  selector: 'vrgal-config',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.css']
})
export class ConfigPanelComponent implements OnInit {

  msg: string;
  position: string;

  constructor(
    private utils: CoreUtilsService,
    private renderer: Renderer2,
  ) {
    console.log(`ConfigComponent.ctor: entered`)
    this.msg ="value: angus young lives;";
    this.position = "0 1 -1.5"

  }

  ngOnInit() {
    console.log(`ConfigComponent.ngOnInit: entered`)
  }

  toggleBgMusic(evt: Event) {
    this.utils.toggleSound(document.querySelector('#bg-music'));
  }

  createEl() {
    // let newEl = document.createElement('a-entity');
    let newEl = this.renderer.createElement('a-entity');

    // newEl.setAttribute('text', this.msg);
    this.renderer.setAttribute(newEl, 'text', this.msg);
    // newEl.setAttribute('position', this.position);
    this.renderer.setAttribute(newEl, 'position', this.position);

    return newEl;
  }


}
