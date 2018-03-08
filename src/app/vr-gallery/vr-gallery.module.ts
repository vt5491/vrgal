import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { CoreBaseService } from '../core/services/core-base.service';
import { CoreUtilsService } from '../core/services/core-utils.service';
import { LinkSelectComponent } from './components/link-select/link-select.component';
import { QuerySelectComponent } from './components/query-select/query-select.component';
import { AframeCubeComponent } from './components/aframe-cube/aframe-cube.component';
import { ResultsSceneComponent } from './components/results-scene/results-scene.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
  ],
  declarations: [
    LinkSelectComponent, 
    QuerySelectComponent, 
    AframeCubeComponent,
    ResultsSceneComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class VrGalleryModule { }
