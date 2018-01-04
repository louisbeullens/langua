import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConjugationsCreateComponent } from './test-conjugations-create.component';

describe('TestConjugationsCreateComponent', () => {
  let component: TestConjugationsCreateComponent;
  let fixture: ComponentFixture<TestConjugationsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestConjugationsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestConjugationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
