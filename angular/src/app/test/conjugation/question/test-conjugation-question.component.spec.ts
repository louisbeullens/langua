import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConjugationQuestionComponent } from './test-conjugation-question.component';

describe('TestConjugationQuestionComponent', () => {
  let component: TestConjugationQuestionComponent;
  let fixture: ComponentFixture<TestConjugationQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestConjugationQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestConjugationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
