import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConjugationsComponent } from './test-conjugations.component';

describe('TestConjugationsComponent', () => {
  let component: TestConjugationsComponent;
  let fixture: ComponentFixture<TestConjugationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestConjugationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestConjugationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
