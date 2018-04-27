import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  id : number;
  name : string;
  // lifted: boolean;
  lift_code: number;

  constructor() { }

  ngOnInit() {
  }

}
