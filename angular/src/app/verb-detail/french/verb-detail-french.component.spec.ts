import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbDetailFrenchComponent } from './verb-detail-french.component';

describe('VerbDetailSpanishComponent', () => {
  let component: VerbDetailFrenchComponent;
  let fixture: ComponentFixture<VerbDetailFrenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbDetailFrenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbDetailFrenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
