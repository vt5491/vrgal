import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsSceneComponent } from './results-scene.component';

describe('ResultsSceneComponent', () => {
  let component: ResultsSceneComponent;
  let fixture: ComponentFixture<ResultsSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
