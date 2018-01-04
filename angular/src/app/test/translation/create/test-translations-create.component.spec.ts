import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTranslationsCreateComponent } from './test-translations-create.component';

describe('TestTranslationsCreateComponent', () => {
  let component: TestTranslationsCreateComponent;
  let fixture: ComponentFixture<TestTranslationsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTranslationsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTranslationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
