import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConjugationDetailComponent } from './conjugation-detail.component';

describe('ConjugationDetailComponent', () => {
  let component: ConjugationDetailComponent;
  let fixture: ComponentFixture<ConjugationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConjugationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConjugationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
