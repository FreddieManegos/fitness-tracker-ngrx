import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassTrainingComponent } from './pass-training.component';

describe('PassTrainingComponent', () => {
  let component: PassTrainingComponent;
  let fixture: ComponentFixture<PassTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
