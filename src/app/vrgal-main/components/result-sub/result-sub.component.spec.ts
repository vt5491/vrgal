import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSubComponent } from './result-sub.component';

describe('ResultSubComponent', () => {
  let component: ResultSubComponent;
  let fixture: ComponentFixture<ResultSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
