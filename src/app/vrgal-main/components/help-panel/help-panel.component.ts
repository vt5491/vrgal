import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.css']
})
export class HelpPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
