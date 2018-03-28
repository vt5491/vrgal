import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftBatchComponent } from './lift-batch.component';

xdescribe('LiftBatchComponent', () => {
  let component: LiftBatchComponent;
  let fixture: ComponentFixture<LiftBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiftBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiftBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
