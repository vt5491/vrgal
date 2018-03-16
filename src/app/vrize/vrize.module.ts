import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

//services
import { BaseService } from './services/base.service';
import { UtilsService } from './services/utils.service';
import { ParserService } from './services/parser.service';
import { TransformerService } from './services/transformer.service';
import { DataExamplesService } from './services/data-examples.service';
import { ExamplesService } from '../core/services/examples.service';
//components
import { LiftComponent } from './components/lift/lift.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [LiftComponent],
  providers: [
    UtilsService,
    BaseService,
    ParserService,
    TransformerService,
    DataExamplesService,
    ExamplesService,
  ],
  // we need this since we dynamically add this route
  entryComponents: [LiftComponent]
})
export class VrizeModule { }
