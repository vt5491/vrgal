import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResultSubComponent } from '../result-sub/result-sub.component';

@Component({
  providers: [ResultSubComponent],
  selector: 'app-query-sub',
  templateUrl: './query-sub.component.html',
  styleUrls: ['./query-sub.component.css']
})
export class QuerySubComponent implements OnInit {
  // how we notify the results sub-scene to process a query.
  // @Output() queryGenResult = new EventEmitter();

  constructor(
    private resultSubComponent : ResultSubComponent
  ) { }

  ngOnInit() {
    console.log(`QuerySubComponent.ngOnInit:`);

  }

  queryCurated(evt: Event) {
    console.log(`QuerySubComponent.queryCurated: now calling genResult`)
    // this.queryGenResult.emit(null);
    this.resultSubComponent.queryGenResult({})
  }

  queryAll(evt: Event) {

  }

  tmp() {
    console.log(`QuerySub.tmp: entered`)
  }

}
