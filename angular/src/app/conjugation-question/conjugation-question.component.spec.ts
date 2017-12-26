import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConjugationQuestionComponent } from './conjugation-question.component';

describe('ConjugationQuestionComponent', () => {
  let component: ConjugationQuestionComponent;
  let fixture: ComponentFixture<ConjugationQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConjugationQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConjugationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
