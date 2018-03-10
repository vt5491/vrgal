import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AframeCubeComponent } from './aframe-cube.component';

xdescribe('AframeCubeComponent', () => {
  let component: AframeCubeComponent;
  let fixture: ComponentFixture<AframeCubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AframeCubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AframeCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
