import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySubComponent } from './query-sub.component';

describe('QuerySubComponent', () => {
  let component: QuerySubComponent;
  let fixture: ComponentFixture<QuerySubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerySubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
