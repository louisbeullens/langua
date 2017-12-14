import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationQuestionComponent } from './translation-question.component';

describe('TranslationQuestionComponent', () => {
  let component: TranslationQuestionComponent;
  let fixture: ComponentFixture<TranslationQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
