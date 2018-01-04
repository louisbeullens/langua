import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTranslationsComponent } from './test-translations.component';

describe('TestTranslationsComponent', () => {
  let component: TestTranslationsComponent;
  let fixture: ComponentFixture<TestTranslationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTranslationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
