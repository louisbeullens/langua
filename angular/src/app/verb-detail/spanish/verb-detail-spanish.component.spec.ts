import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbDetailSpanishComponent } from './verb-detail-spanish.component';

describe('VerbDetailSpanishComponent', () => {
  let component: VerbDetailSpanishComponent;
  let fixture: ComponentFixture<VerbDetailSpanishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbDetailSpanishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbDetailSpanishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
