import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestTranslationsComponent } from './create-test-translations.component';

describe('CreateTestTranslationsComponent', () => {
  let component: CreateTestTranslationsComponent;
  let fixture: ComponentFixture<CreateTestTranslationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestTranslationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
