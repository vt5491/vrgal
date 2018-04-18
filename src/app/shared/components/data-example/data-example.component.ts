import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreDataExampleService } from '../../../core/services/core-data-example.service';

@Component({
  selector: 'app-data-example',
  templateUrl: './data-example.component.html',
  styleUrls: ['./data-example.component.css']
})
export class DataExampleComponent implements OnInit {
  private sub: any;
  private id : string;

  constructor(
    private route: ActivatedRoute,
    private coreDataExample: CoreDataExampleService
  ) { 
    console.log(`DataExampleComponent.ctor: entered`);

    // debugger;
  }

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      // this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(`DataExampleComponent.ngOnInit: params['id']=${params['id']}`);

      // In a real app: dispatch action to load the details here.
      this.coreDataExample.get(params.id).subscribe((rsp) => {
        debugger;
        console.log(`rsp=${rsp}`);
      })
      // this.dataExample.get(params.id)   
    });
  }

}
