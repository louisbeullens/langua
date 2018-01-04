import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTranslationQuestionComponent } from './test-translation-question.component';

describe('TestTranslationQuestionComponent', () => {
  let component: TestTranslationQuestionComponent;
  let fixture: ComponentFixture<TestTranslationQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTranslationQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTranslationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
