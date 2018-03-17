import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { CoreBaseService } from './services/core-base.service';
import { CoreUtilsService } from './services/core-utils.service';
import { ExamplesService } from './services/examples.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CoreBaseService,
    CoreUtilsService,
    ExamplesService,
  ],
  declarations: []
})
export class CoreModule { }
