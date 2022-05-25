import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathologistComponent } from './pathologist.component';

describe('PathologistComponent', () => {
  let component: PathologistComponent;
  let fixture: ComponentFixture<PathologistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathologistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathologistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
