import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkSelectComponent } from './components/link-select/link-select.component';
import { QuerySelectComponent } from './components/query-select/query-select.component';
import { AframeCubeComponent } from './components/aframe-cube/aframe-cube.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LinkSelectComponent, 
    QuerySelectComponent, 
    AframeCubeComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class VrGalleryModule { }
