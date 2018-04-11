import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExampleComponent } from './data-example.component';

describe('DataExampleComponent', () => {
  let component: DataExampleComponent;
  let fixture: ComponentFixture<DataExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
