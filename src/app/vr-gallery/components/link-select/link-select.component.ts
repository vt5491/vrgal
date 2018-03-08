import { Component, OnInit } from '@angular/core';
// import { StickyPosService } from '../../aframe/sticky-pos.service';

@Component({
  selector: 'app-link-select',
  templateUrl: './link-select.component.html',
  styleUrls: ['./link-select.component.css']
})
export class LinkSelectComponent implements OnInit {

  // constructor(stickyPos: StickyPosService ) {
  constructor() {
    console.log(`LinkSelectComponent.ctor: entered`);
  }

  ngOnInit() {
  }

}
