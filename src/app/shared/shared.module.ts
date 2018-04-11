import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleComponent } from './components/example/example.component';
import { DataExampleComponent } from './components/data-example/data-example.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ExampleComponent, DataExampleComponent]
})
export class SharedModule { }
