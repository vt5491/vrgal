import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { QuerySubComponent } from './components/query-sub/query-sub.component';
import { ResultSubComponent } from './components/result-sub/result-sub.component';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { HelpPanelComponent } from './components/help-panel/help-panel.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MainComponent,
    QuerySubComponent,
    ResultSubComponent,
    ConfigPanelComponent,
    HelpPanelComponent,
    HeaderComponent],
  // providers: [
  //   ResultSubComponent,
  // ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class VrgalMainModule { }
