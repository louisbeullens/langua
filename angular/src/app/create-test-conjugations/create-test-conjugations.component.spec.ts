import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestConjugationsComponent } from './create-test-conjugations.component';

describe('CreateTestConjugationsComponent', () => {
  let component: CreateTestConjugationsComponent;
  let fixture: ComponentFixture<CreateTestConjugationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestConjugationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestConjugationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
